import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SuggestionChipRow } from "../../components/shared/SuggestionChip";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { createProject, PROJECT_TYPES } from "../../api/projects";
import { fetchDevelopers } from "../../api/developers";
import { fetchClients } from "../../api/clients";
// ─── Date formatter ───────────────────────────────────────────────────────────
// Auto-inserts "/" as user types: "01" → "01/" → "01/04" → "01/04/2026"
function formatDateInput(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
    return (
        digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4)
    );
}
// Convert DD/MM/YYYY → YYYY-MM-DD for API
function displayToISO(display) {
    if (!display) return "";
    const parts = display.split("/");
    if (parts.length !== 3 || parts[2].length < 4) return display;
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

// ─── Avatar helpers (match ModalScreens) ─────────────────────────────────────
const AVATAR_COLORS = [
    "#ba7517",
    "#378add",
    "#d4537e",
    "#534ab7",
    "#1a7a5e",
    "#d85a30",
];
function devColor(name = "") {
    let h = 0;
    for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function devInitials(name = "") {
    return (
        name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "DV"
    );
}

// ─── Tiny shared field wrapper ─────────────────────────────────────────────────
function Field({ label, required, children }) {
    return (
        <View style={s.formRow}>
            <View style={s.labelRow}>
                <Text style={s.label}>{label}</Text>
                {required ? (
                    <Text style={s.requiredStar}>*</Text>
                ) : (
                    <Text style={s.requiredStar}></Text>
                )}
            </View>
            {children}
        </View>
    );
}
function Input({ value, onChangeText, placeholder, keyboardType, maxLength }) {
    return (
        <TextInput
            style={s.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text3}
            keyboardType={keyboardType}
            autoCapitalize="none"
            maxLength={maxLength}
        />
    );
}

const DEV_ROLE_CHIPS = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack",
    "UI/UX Designer",
    "DevOps",
    "QA Tester",
];

export default function AddProjectScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const onAdded = route?.params?.onAdded;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ── Step 1 fields ─────────────────────────────────────────────────────────
    const [name, setName] = useState("");
    const [type, setType] = useState("Development");
    const [client, setClient] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [price, setPrice] = useState("");

    // ── Step 2 — dev picker (one slot, same UX as AddDevToProject) ────────────
    const [knownDevs, setKnownDevs] = useState([]);
    const [loadingDevs, setLoadingDevs] = useState(true);
    const [devSearch, setDevSearch] = useState("");
    const [devSlots, setDevSlots] = useState([]); // [{ dev, role, pay }]

    // Client selection
    const [clients, setClients] = useState([]);
    const [clientLoading, setClientLoading] = useState(true);

    const clientChips = clients.length > 0 ? clients.map((c) => c.name) : [];

    useEffect(() => {
        fetchClients().then((r) => {
            if (r.ok) setClients(r.data.clients || []);
            setClientLoading(false);
        });
        fetchDevelopers().then((res) => {
            if (res.ok) setKnownDevs(res.data.developers || []);
            setLoadingDevs(false);
        });
    }, []);

    const filteredDevs = useMemo(() => {
        const q = devSearch.trim().toLowerCase();
        if (!q) return knownDevs;
        return knownDevs.filter(
            (d) =>
                d.name?.toLowerCase().includes(q) ||
                d.role?.toLowerCase().includes(q) ||
                d.phone?.toLowerCase().includes(q),
        );
    }, [knownDevs, devSearch]);

    // Selected dev IDs (for disabling already-added ones)
    const selectedDevIds = devSlots.map((sl) => sl.dev._id);

    const toggleDev = (dev) => {
        if (selectedDevIds.includes(dev._id)) {
            // remove
            setDevSlots((prev) => prev.filter((sl) => sl.dev._id !== dev._id));
        } else {
            // add
            setDevSlots((prev) => [
                ...prev,
                { dev, role: dev.role || "", pay: "" },
            ]);
        }
    };

    const updateSlotField = (devId, field, val) =>
        setDevSlots((prev) =>
            prev.map((sl) =>
                sl.dev._id === devId ? { ...sl, [field]: val } : sl,
            ),
        );

    // ── Step 1 → 2 ────────────────────────────────────────────────────────────
    const handleStep1 = () => {
        setError("");
        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }
        if (!client.trim()) {
            setError("Client name is required.");
            return;
        }
        if (!startDate || startDate.length < 8) {
            setError("Start date is required (DD/MM/YYYY).");
            return;
        }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            setError("Valid project price is required.");
            return;
        }
        setError("");
        setStep(2);
    };

    // ── Final submit ──────────────────────────────────────────────────────────
    const handleSubmit = async (skipDevs = false) => {
        setError("");
        setLoading(true);

        if (!skipDevs) {
            const invalidDev = devSlots.find(
                (sl) => !sl.pay || Number(sl.pay) <= 0,
            );

            if (invalidDev) {
                setLoading(false);
                setError(
                    `${invalidDev.dev?.name || "Developer"}: Pay amount is missing or invalid`,
                );
                return;
            }
        }
        const developers = skipDevs
            ? []
            : devSlots
                  .filter((sl) => sl.pay && Number(sl.pay) > 0)
                  .map((sl) => ({
                      developer: sl.dev._id,
                      role: sl.role || undefined,
                      agreedAmount: Number(sl.pay),
                  }));

        const res = await createProject({
            name,
            type,
            client,
            startDate: displayToISO(startDate),
            endDate: endDate ? displayToISO(endDate) : undefined,
            totalPrice: price,
            developers: developers.length ? developers : undefined,
        });
        setLoading(false);
        if (res.ok) {
            if (onAdded) onAdded();
            navigation.goBack();
        } else setError(res.message);
    };

    // ── Type grid config ──────────────────────────────────────────────────────
    const TYPE_GRID = [
        { id: "Development", icon: "💻", label: "Development" },
        { id: "UI/UX Design", icon: "🎨", label: "UI/UX Design" },
        { id: "Mobile App", icon: "📱", label: "Mobile App" },
        { id: "Web App", icon: "🌐", label: "Web App" },
        { id: "Deployment", icon: "🚀", label: "Deployment" },
        { id: "Maintenance", icon: "🔧", label: "Maintenance" },
        { id: "API Integration", icon: "🔗", label: "API" },
        { id: "Other", icon: "➕", label: "Other" },
    ];

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={s.container}>
                {/* ── Header ── */}
                <LinearGradient
                    colors={COLORS.gradientBlue}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[s.header, { paddingTop: insets.top + 6 }]}
                >
                    <TouchableOpacity
                        onPress={
                            step === 1
                                ? () => navigation.goBack()
                                : () => {
                                      setStep(1);
                                      setError("");
                                  }
                        }
                        style={s.backBtn}
                    >
                        <Text style={s.backText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={s.headerRow}>
                        <Text style={s.headerTitle}>
                            {step === 1
                                ? "💼 New Project"
                                : "👨‍💻 Add Developers"}
                        </Text>
                        <View style={s.stepBadge}>
                            <Text style={s.stepBadgeTxt}>Step {step} / 2</Text>
                        </View>
                    </View>

                    <Text style={s.headerSub}>
                        {step === 1
                            ? "Fill in the project details below"
                            : "Select developers and set their agreed pay"}
                    </Text>

                    {/* Progress bar */}
                    <View style={s.progressRow}>
                        <View style={[s.progressSeg, s.progressDone]} />
                        <View
                            style={[
                                s.progressSeg,
                                step === 2 && s.progressDone,
                            ]}
                        />
                    </View>
                    <View style={s.progressLabels}>
                        <Text style={[s.progressLbl, s.progressLblDone]}>
                            Project Details
                        </Text>
                        <Text
                            style={[
                                s.progressLbl,
                                step === 2 && s.progressLblDone,
                            ]}
                        >
                            Add Developers
                        </Text>
                    </View>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View style={s.body}>
                        {/* ══════════════════════════════════════════
                STEP 1 — PROJECT DETAILS
            ══════════════════════════════════════════ */}
                        {step === 1 && (
                            <>
                                {/* Project Name */}
                                <View style={s.card}>
                                    <Text style={s.cardSectionTitle}>
                                        📋 Project Info
                                    </Text>

                                    <Field label="Project Name" required>
                                        <Input
                                            value={name}
                                            onChangeText={setName}
                                            placeholder="e.g. School ERP v2, QR Park Plus..."
                                        />
                                    </Field>

                                    {/* Type grid */}
                                    <Field label="Project Type" required>
                                        <Input
                                            value={type}
                                            onChangeText={setType}
                                            placeholder="e.g. Development, UI/UX..."
                                        />

                                        <View style={s.typeGrid}>
                                            {TYPE_GRID.map((t) => (
                                                <TouchableOpacity
                                                    key={t.id}
                                                    onPress={() =>
                                                        setType(t.id)
                                                    }
                                                    style={[
                                                        s.typeCard,
                                                        type === t.id &&
                                                            s.typeCardActive,
                                                    ]}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={s.typeCardIcon}
                                                    >
                                                        {t.icon}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            s.typeCardLbl,
                                                            type === t.id &&
                                                                s.typeCardLblActive,
                                                        ]}
                                                    >
                                                        {t.label}
                                                    </Text>
                                                    {type === t.id && (
                                                        <View
                                                            style={
                                                                s.typeCardCheck
                                                            }
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 9,
                                                                    color: "#fff",
                                                                    fontFamily:
                                                                        FONTS
                                                                            .nunito
                                                                            .black,
                                                                }}
                                                            >
                                                                ✓
                                                            </Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </Field>
                                </View>

                                {/* Client */}
                                <View style={s.card}>
                                    <Text style={s.cardSectionTitle}>
                                        🏢 Client
                                    </Text>
                                    <Field label="Client / Company" required>
                                        <Input
                                            value={client}
                                            onChangeText={setClient}
                                            placeholder="e.g. Maksoft Technologies"
                                        />

                                        {clientLoading ? (
                                            <ActivityIndicator
                                                size="small"
                                                color={COLORS.primary}
                                                style={{ marginTop: 6 }}
                                            />
                                        ) : (
                                            <SuggestionChipRow
                                                chips={clientChips}
                                                onSelect={setClient}
                                                small
                                                style={{ marginTop: 6 }}
                                            />
                                        )}
                                    </Field>
                                </View>

                                {/* Dates + Price */}
                                <View style={s.card}>
                                    <Text style={s.cardSectionTitle}>
                                        📅 Timeline & Budget
                                    </Text>

                                    {/* Date row */}
                                    <View style={s.twoCol}>
                                        <View style={{ flex: 1 }}>
                                            <Field label="Start Date" required>
                                                <View style={s.dateInputWrap}>
                                                    <Text style={s.dateIcon}>
                                                        📅
                                                    </Text>
                                                    <TextInput
                                                        style={s.dateInput}
                                                        value={startDate}
                                                        onChangeText={(v) =>
                                                            setStartDate(
                                                                formatDateInput(
                                                                    v,
                                                                ),
                                                            )
                                                        }
                                                        placeholder="DD/MM/YYYY"
                                                        placeholderTextColor={
                                                            COLORS.text3
                                                        }
                                                        keyboardType="numeric"
                                                        maxLength={10}
                                                    />
                                                </View>
                                            </Field>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Field label="End Date">
                                                <View style={s.dateInputWrap}>
                                                    <Text style={s.dateIcon}>
                                                        🏁
                                                    </Text>
                                                    <TextInput
                                                        style={s.dateInput}
                                                        value={endDate}
                                                        onChangeText={(v) =>
                                                            setEndDate(
                                                                formatDateInput(
                                                                    v,
                                                                ),
                                                            )
                                                        }
                                                        placeholder="DD/MM/YYYY"
                                                        placeholderTextColor={
                                                            COLORS.text3
                                                        }
                                                        keyboardType="numeric"
                                                        maxLength={10}
                                                    />
                                                </View>
                                            </Field>
                                        </View>
                                    </View>

                                    {/* Price */}
                                    <Field label="Project Price (₹)" required>
                                        <View style={s.priceInputWrap}>
                                            <View style={s.pricePrefix}>
                                                <Text style={s.pricePrefixTxt}>
                                                    ₹
                                                </Text>
                                            </View>
                                            <TextInput
                                                style={s.priceInput}
                                                value={price}
                                                onChangeText={setPrice}
                                                placeholder="0"
                                                placeholderTextColor={
                                                    COLORS.text3
                                                }
                                                keyboardType="numeric"
                                            />
                                            {!!price && Number(price) > 0 && (
                                                <Text style={s.priceFormatted}>
                                                    ₹
                                                    {Number(
                                                        price,
                                                    ).toLocaleString("en-IN")}
                                                </Text>
                                            )}
                                        </View>
                                    </Field>

                                    {/* Summary card — shows once all required fields are filled */}
                                    {name &&
                                    client &&
                                    startDate?.length >= 8 &&
                                    price ? (
                                        <View style={s.summaryPreview}>
                                            <Text style={s.summaryPreviewTitle}>
                                                📋 Summary
                                            </Text>
                                            <View style={s.summaryRow}>
                                                <Text style={s.summaryLbl}>
                                                    Project
                                                </Text>
                                                <Text style={s.summaryVal}>
                                                    {name}
                                                </Text>
                                            </View>
                                            <View style={s.summaryRow}>
                                                <Text style={s.summaryLbl}>
                                                    Client
                                                </Text>
                                                <Text style={s.summaryVal}>
                                                    {client}
                                                </Text>
                                            </View>
                                            <View style={s.summaryRow}>
                                                <Text style={s.summaryLbl}>
                                                    Type
                                                </Text>
                                                <Text style={s.summaryVal}>
                                                    {type}
                                                </Text>
                                            </View>
                                            <View style={s.summaryRow}>
                                                <Text style={s.summaryLbl}>
                                                    Start
                                                </Text>
                                                <Text style={s.summaryVal}>
                                                    {startDate}
                                                    {endDate
                                                        ? ` → ${endDate}`
                                                        : ""}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    s.summaryRow,
                                                    { borderBottomWidth: 0 },
                                                ]}
                                            >
                                                <Text style={s.summaryLbl}>
                                                    Budget
                                                </Text>
                                                <Text
                                                    style={[
                                                        s.summaryVal,
                                                        {
                                                            color: COLORS.primary,
                                                            fontFamily:
                                                                FONTS.nunito
                                                                    .black,
                                                        },
                                                    ]}
                                                >
                                                    ₹
                                                    {Number(
                                                        price,
                                                    ).toLocaleString("en-IN")}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                </View>
                                {/* Error */}
                                {!!error && (
                                    <View style={s.errorBox}>
                                        <Text style={s.errorTxt}>
                                            ⚠️ {error}
                                        </Text>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={s.primaryBtn}
                                    onPress={handleStep1}
                                    activeOpacity={0.85}
                                >
                                    <Text style={s.primaryBtnTxt}>
                                        Next: Add Developers →
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* ══════════════════════════════════════════
                STEP 2 — DEVELOPER PICKER
            ══════════════════════════════════════════ */}
                        {step === 2 && (
                            <>
                                {/* Dev picker card */}
                                <View style={s.card}>
                                    {/* Header row */}
                                    <View style={s.devPickHeader}>
                                        <View style={s.devStepBadge}>
                                            <Text style={s.devStepBadgeTxt}>
                                                1
                                            </Text>
                                        </View>
                                        <Text style={s.devPickTitle}>
                                            Pick Developers (Optional)
                                        </Text>
                                        {knownDevs.length > 0 && (
                                            <Text style={s.devPickCount}>
                                                {filteredDevs.length}/
                                                {knownDevs.length}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Search bar */}
                                    {!loadingDevs && knownDevs.length > 0 && (
                                        <View style={s.devSearchBar}>
                                            <Text style={s.devSearchIcon}>
                                                🔍
                                            </Text>
                                            <TextInput
                                                style={s.devSearchInput}
                                                value={devSearch}
                                                onChangeText={setDevSearch}
                                                placeholder="Search by name, role or phone..."
                                                placeholderTextColor={
                                                    COLORS.text3
                                                }
                                                autoCapitalize="none"
                                                returnKeyType="done"
                                            />
                                            {devSearch.length > 0 && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setDevSearch("")
                                                    }
                                                    hitSlop={{
                                                        top: 8,
                                                        bottom: 8,
                                                        left: 8,
                                                        right: 8,
                                                    }}
                                                >
                                                    <Text
                                                        style={s.devSearchClear}
                                                    >
                                                        ✕
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}

                                    {/* Loading */}
                                    {loadingDevs && (
                                        <View style={s.devLoadRow}>
                                            <ActivityIndicator
                                                size="small"
                                                color={COLORS.primary}
                                            />
                                            <Text style={s.devLoadTxt}>
                                                Loading your team...
                                            </Text>
                                        </View>
                                    )}

                                    {/* Empty team */}
                                    {!loadingDevs && knownDevs.length === 0 && (
                                        <View style={s.devEmptyBox}>
                                            <Text
                                                style={{
                                                    fontSize: 28,
                                                    marginBottom: 6,
                                                }}
                                            >
                                                👨‍💻
                                            </Text>
                                            <Text style={s.devEmptyTitle}>
                                                No developers yet
                                            </Text>
                                            <Text style={s.devEmptySub}>
                                                Go to Profile → My Developers to
                                                add your team first.{"\n"}
                                                You can skip and add developers
                                                later.
                                            </Text>
                                        </View>
                                    )}

                                    {/* No search match */}
                                    {!loadingDevs &&
                                        knownDevs.length > 0 &&
                                        filteredDevs.length === 0 && (
                                            <View style={s.devEmptyBox}>
                                                <Text
                                                    style={{
                                                        fontSize: 22,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    🔍
                                                </Text>
                                                <Text style={s.devEmptyTitle}>
                                                    No match for "{devSearch}"
                                                </Text>
                                            </View>
                                        )}

                                    {/* ── Horizontal scroll card list ── */}
                                    {!loadingDevs &&
                                        filteredDevs.length > 0 && (
                                            <>
                                                <ScrollView
                                                    horizontal
                                                    showsHorizontalScrollIndicator={
                                                        false
                                                    }
                                                    contentContainerStyle={
                                                        s.devHScroll
                                                    }
                                                    keyboardShouldPersistTaps="handled"
                                                >
                                                    {filteredDevs.map((dev) => {
                                                        const isSelected =
                                                            selectedDevIds.includes(
                                                                dev._id,
                                                            );
                                                        const col = devColor(
                                                            dev.name,
                                                        );
                                                        const init =
                                                            devInitials(
                                                                dev.name,
                                                            );
                                                        const hasDebt =
                                                            (dev.totalPending ||
                                                                0) > 0;

                                                        return (
                                                            <TouchableOpacity
                                                                key={dev._id}
                                                                onPress={() =>
                                                                    toggleDev(
                                                                        dev,
                                                                    )
                                                                }
                                                                style={[
                                                                    s.devHCard,
                                                                    isSelected &&
                                                                        s.devHCardSelected,
                                                                ]}
                                                                activeOpacity={
                                                                    0.8
                                                                }
                                                            >
                                                                {/* Avatar with selection ring */}
                                                                <View
                                                                    style={[
                                                                        s.devHAvRing,
                                                                        isSelected && {
                                                                            borderColor:
                                                                                COLORS.primary,
                                                                            borderWidth: 3,
                                                                        },
                                                                    ]}
                                                                >
                                                                    <View
                                                                        style={[
                                                                            s.devHAv,
                                                                            {
                                                                                backgroundColor:
                                                                                    col,
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Text
                                                                            style={
                                                                                s.devHAvTxt
                                                                            }
                                                                        >
                                                                            {
                                                                                init
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                    {isSelected && (
                                                                        <View
                                                                            style={
                                                                                s.devHCheck
                                                                            }
                                                                        >
                                                                            <Text
                                                                                style={
                                                                                    s.devHCheckTxt
                                                                                }
                                                                            >
                                                                                ✓
                                                                            </Text>
                                                                        </View>
                                                                    )}
                                                                </View>

                                                                <Text
                                                                    style={[
                                                                        s.devHName,
                                                                        isSelected && {
                                                                            color: COLORS.primary,
                                                                        },
                                                                    ]}
                                                                    numberOfLines={
                                                                        1
                                                                    }
                                                                >
                                                                    {dev.name}
                                                                </Text>
                                                                <Text
                                                                    style={
                                                                        s.devHRole
                                                                    }
                                                                    numberOfLines={
                                                                        1
                                                                    }
                                                                >
                                                                    {dev.role ||
                                                                        "Developer"}
                                                                </Text>

                                                                {hasDebt && (
                                                                    <View
                                                                        style={
                                                                            s.devHDebt
                                                                        }
                                                                    >
                                                                        <Text
                                                                            style={
                                                                                s.devHDebtTxt
                                                                            }
                                                                        >
                                                                            ₹
                                                                            {dev.totalPending >=
                                                                            1000
                                                                                ? (
                                                                                      dev.totalPending /
                                                                                      1000
                                                                                  ).toFixed(
                                                                                      0,
                                                                                  ) +
                                                                                  "k"
                                                                                : dev.totalPending}{" "}
                                                                            due
                                                                        </Text>
                                                                    </View>
                                                                )}

                                                                <View
                                                                    style={
                                                                        s.devHStatusRow
                                                                    }
                                                                >
                                                                    <View
                                                                        style={[
                                                                            s.devHDot,
                                                                            {
                                                                                backgroundColor:
                                                                                    dev.status ===
                                                                                    "active"
                                                                                        ? "#10B981"
                                                                                        : "#9CA3AF",
                                                                            },
                                                                        ]}
                                                                    />
                                                                    <Text
                                                                        style={
                                                                            s.devHStatusTxt
                                                                        }
                                                                    >
                                                                        {dev.status ===
                                                                        "active"
                                                                            ? "Active"
                                                                            : "Inactive"}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </ScrollView>

                                                {devSlots.length === 0 && (
                                                    <Text
                                                        style={s.devScrollHint}
                                                    >
                                                        ← Scroll · tap to select
                                                        · tap again to remove
                                                    </Text>
                                                )}
                                            </>
                                        )}
                                </View>

                                {/* ── Selected devs — role + pay fields ── */}
                                {devSlots.length > 0 && (
                                    <View
                                        style={[
                                            s.card,
                                            {
                                                borderWidth: 1.5,
                                                borderColor: COLORS.primary,
                                            },
                                        ]}
                                    >
                                        <View style={s.devPickHeader}>
                                            <View
                                                style={[
                                                    s.devStepBadge,
                                                    {
                                                        backgroundColor:
                                                            COLORS.primary,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        s.devStepBadgeTxt,
                                                        { color: "#fff" },
                                                    ]}
                                                >
                                                    2
                                                </Text>
                                            </View>
                                            <Text style={s.devPickTitle}>
                                                Set Role & Pay
                                            </Text>
                                            <Text style={s.devPickCount}>
                                                {devSlots.length} selected
                                            </Text>
                                        </View>

                                        {devSlots.map((slot, idx) => {
                                            const col = devColor(slot.dev.name);
                                            const init = devInitials(
                                                slot.dev.name,
                                            );
                                            const isLast =
                                                idx === devSlots.length - 1;
                                            return (
                                                <View
                                                    key={slot.dev._id}
                                                    style={[
                                                        s.slotCard,
                                                        !isLast && {
                                                            marginBottom: 12,
                                                            paddingBottom: 12,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor:
                                                                COLORS.border,
                                                        },
                                                    ]}
                                                >
                                                    {/* Dev banner */}
                                                    <View style={s.slotBanner}>
                                                        <View
                                                            style={[
                                                                s.slotAv,
                                                                {
                                                                    backgroundColor:
                                                                        col,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={
                                                                    s.slotAvTxt
                                                                }
                                                            >
                                                                {init}
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={{ flex: 1 }}
                                                        >
                                                            <Text
                                                                style={
                                                                    s.slotName
                                                                }
                                                            >
                                                                {slot.dev.name}
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    s.slotDefaultRole
                                                                }
                                                            >
                                                                {slot.dev
                                                                    .role ||
                                                                    "Developer"}
                                                            </Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                toggleDev(
                                                                    slot.dev,
                                                                )
                                                            }
                                                            style={
                                                                s.slotRemoveBtn
                                                            }
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text
                                                                style={
                                                                    s.slotRemoveTxt
                                                                }
                                                            >
                                                                ✕ Remove
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    {/* Role + Pay row */}
                                                    <View style={s.twoCol}>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                gap: 7,
                                                            }}
                                                        >
                                                            <Text
                                                                style={s.label}
                                                            >
                                                                Role on Project
                                                            </Text>
                                                            <TextInput
                                                                style={s.input}
                                                                value={
                                                                    slot.role
                                                                }
                                                                onChangeText={(
                                                                    v,
                                                                ) =>
                                                                    updateSlotField(
                                                                        slot.dev
                                                                            ._id,
                                                                        "role",
                                                                        v,
                                                                    )
                                                                }
                                                                placeholder="e.g. Frontend"
                                                                placeholderTextColor={
                                                                    COLORS.text3
                                                                }
                                                                autoCapitalize="words"
                                                            />
                                                        </View>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                gap: 7,
                                                            }}
                                                        >
                                                            <Text
                                                                style={s.label}
                                                            >
                                                                Agreed Pay (₹)
                                                            </Text>
                                                            <View
                                                                style={
                                                                    s.slotPayWrap
                                                                }
                                                            >
                                                                <Text
                                                                    style={
                                                                        s.slotPayPrefix
                                                                    }
                                                                >
                                                                    ₹
                                                                </Text>
                                                                <TextInput
                                                                    style={
                                                                        s.slotPayInput
                                                                    }
                                                                    value={
                                                                        slot.pay
                                                                    }
                                                                    onChangeText={(
                                                                        v,
                                                                    ) =>
                                                                        updateSlotField(
                                                                            slot
                                                                                .dev
                                                                                ._id,
                                                                            "pay",
                                                                            v,
                                                                        )
                                                                    }
                                                                    placeholder="0"
                                                                    placeholderTextColor={
                                                                        COLORS.text3
                                                                    }
                                                                    keyboardType="numeric"
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>

                                                    {/* Role chips */}
                                                    <ScrollView
                                                        horizontal
                                                        showsHorizontalScrollIndicator={
                                                            false
                                                        }
                                                        style={{
                                                            marginTop: 10,
                                                        }}
                                                        contentContainerStyle={{
                                                            gap: 6,
                                                        }}
                                                    >
                                                        {DEV_ROLE_CHIPS.map(
                                                            (chip) => (
                                                                <TouchableOpacity
                                                                    key={chip}
                                                                    onPress={() =>
                                                                        updateSlotField(
                                                                            slot
                                                                                .dev
                                                                                ._id,
                                                                            "role",
                                                                            chip,
                                                                        )
                                                                    }
                                                                    style={[
                                                                        s.roleChip,
                                                                        slot.role ===
                                                                            chip &&
                                                                            s.roleChipActive,
                                                                    ]}
                                                                    activeOpacity={
                                                                        0.8
                                                                    }
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            s.roleChipTxt,
                                                                            slot.role ===
                                                                                chip &&
                                                                                s.roleChipTxtActive,
                                                                        ]}
                                                                    >
                                                                        {chip}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ),
                                                        )}
                                                    </ScrollView>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                                {/* Error */}
                                {!!error && (
                                    <View style={s.errorBox}>
                                        <Text style={s.errorTxt}>
                                            ⚠️ {error}
                                        </Text>
                                    </View>
                                )}

                                {/* Buttons */}
                                <TouchableOpacity
                                    style={[s.primaryBtn, loading && s.btnDim]}
                                    onPress={() => handleSubmit(false)}
                                    disabled={loading}
                                    activeOpacity={0.85}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={s.primaryBtnTxt}>
                                            ✅ Create Project
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[s.outlineBtn, loading && s.btnDim]}
                                    onPress={() => setStep(1)}
                                    disabled={loading}
                                    activeOpacity={0.85}
                                >
                                    <Text style={s.outlineBtnTxt}>
                                        ← Back To Project Details
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },

    // ── Header ──
    header: { paddingHorizontal: 18, paddingBottom: 18 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
    },
    headerTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl2,
        color: "#fff",
    },
    headerSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.75)",
        marginTop: 4,
    },
    stepBadge: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    stepBadgeTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: "#fff",
    },
    progressRow: { flexDirection: "row", gap: 6, marginTop: 14 },
    progressSeg: {
        flex: 1,
        height: 4,
        borderRadius: 99,
        backgroundColor: "rgba(255,255,255,0.25)",
    },
    progressDone: { backgroundColor: "#fff" },
    progressLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    progressLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: "rgba(255,255,255,0.45)",
    },
    progressLblDone: { color: "rgba(255,255,255,0.85)" },

    // ── Body / Card ──
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.card,
    },
    cardSectionTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
        marginBottom: 14,
    },

    // ── Form ──
    formRow: { marginBottom: 12 },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 6,
    },
    label: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    requiredStar: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },
    optionalLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text3,
        marginTop: 4,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    twoCol: { flexDirection: "row", gap: 8 },

    // ── Type grid ──
    typeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 6,
    },
    typeCard: {
        width: "23.35%",
        // aspectRatio: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        gap: 4,
        position: "relative",
        paddingTop: 16,
        paddingBottom: 6,
    },
    typeCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    typeCardIcon: { fontSize: 20 },
    typeCardLbl: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm,
        color: COLORS.text2,
        textAlign: "center",
    },
    typeCardLblActive: { color: COLORS.primary },
    typeCardCheck: {
        position: "absolute",
        top: 5,
        right: 5,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    // ── Date input ──
    dateInputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 8,
    },
    dateIcon: { fontSize: 15 },
    dateInput: {
        flex: 1,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text,
    },

    // ── Price input ──
    priceInputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        overflow: "hidden",
    },
    pricePrefix: {
        backgroundColor: COLORS.primaryUltraLight,
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRightWidth: 1.5,
        borderRightColor: COLORS.border,
    },
    pricePrefixTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        color: COLORS.primary,
    },
    priceInput: {
        flex: 1,
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.lg,
        color: COLORS.text,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    priceFormatted: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        paddingRight: 12,
    },

    // ── Summary preview card ──
    summaryPreview: {
        backgroundColor: "#EFF6FF",
        borderRadius: 12,
        padding: 14,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#BFDBFE",
    },
    summaryPreviewTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#1D4ED8",
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#BFDBFE",
    },
    summaryLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "#3B82F6",
    },
    summaryVal: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text,
        maxWidth: "60%",
        textAlign: "right",
    },

    // ── Buttons ──
    primaryBtn: {
        backgroundColor: "#1D4ED8",
        borderRadius: RADIUS.xl,
        padding: 14,
        alignItems: "center",
        marginBottom: 10,
    },
    primaryBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    outlineBtn: {
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.xl,
        padding: 13,
        alignItems: "center",
    },
    outlineBtnTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md2,
        color: COLORS.text2,
    },
    btnDim: { opacity: 0.65 },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginBottom: 12,
    },
    errorTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },

    // ── Dev picker ──
    devPickHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    devStepBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primaryUltraLight,
        alignItems: "center",
        justifyContent: "center",
    },
    devStepBadgeTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.sm2,
        color: COLORS.primary,
    },
    devPickTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        color: COLORS.text,
        flex: 1,
    },
    devPickCount: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
    },
    devSearchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginBottom: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    devSearchIcon: { fontSize: 15 },
    devSearchInput: {
        flex: 1,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    devSearchClear: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text3,
        paddingHorizontal: 4,
    },
    devLoadRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 16,
    },
    devLoadTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    devEmptyBox: { alignItems: "center", paddingVertical: 20, gap: 4 },
    devEmptyTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    devEmptySub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        textAlign: "center",
        lineHeight: 20,
    },
    devHScroll: { paddingVertical: 4, paddingHorizontal: 2, gap: 10 },
    devHCard: {
        width: 110,
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        padding: 14,
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        gap: 4,
    },
    devHCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    devHAvRing: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
        position: "relative",
    },
    devHAv: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    devHAvTxt: { fontFamily: FONTS.nunito.black, fontSize: 20, color: "#fff" },
    devHCheck: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    devHCheckTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: 10,
        color: "#fff",
    },
    devHName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.base,
        color: COLORS.text,
        textAlign: "center",
    },
    devHRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text2,
        textAlign: "center",
    },
    devHDebt: {
        backgroundColor: "#FEE2E2",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    devHDebtTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm,
        color: COLORS.danger,
    },
    devHStatusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    devHDot: { width: 6, height: 6, borderRadius: 3 },
    devHStatusTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text3,
    },
    devScrollHint: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textAlign: "center",
        marginTop: 10,
    },

    // ── Selected slot cards ──
    slotCard: { paddingTop: 4 },
    slotBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    slotAv: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    slotAvTxt: { fontFamily: FONTS.nunito.black, fontSize: 15, color: "#fff" },
    slotName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    slotDefaultRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    slotRemoveBtn: {
        backgroundColor: "#FEE2E2",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    slotRemoveTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.danger,
    },
    slotPayWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        overflow: "hidden",
    },
    slotPayPrefix: {
        backgroundColor: COLORS.primaryUltraLight,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRightWidth: 1.5,
        borderRightColor: COLORS.border,
    },
    slotPayInput: {
        flex: 1,
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    roleChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    roleChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    roleChipTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    roleChipTxtActive: { color: "#fff" },
});
