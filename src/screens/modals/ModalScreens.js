import React, { useEffect, useState } from "react";
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
import PaymentMethodPicker from "../../components/shared/PaymentMethodPicker";
import { SuggestionChipRow } from "../../components/shared/SuggestionChip";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import {
    addDeveloperToProject,
    addDevToProject,
    isoToDisplay,
    updateProject,
    updateProjectStatus,
} from "../../api/projects";
import { fetchDevelopers, updateDeveloper } from "../../api/developers";
import { fetchClients } from "../../api/clients";

// ─── Shared helpers ────────────────────────────────────────────────────────────
function ModalHeader({ colors, title, subtitle, onBack, insets }) {
    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0.13, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[shared.header, { paddingTop: insets.top + 6 }]}
        >
            <TouchableOpacity onPress={onBack} style={shared.backBtn}>
                <Text style={shared.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={shared.headerTitle}>{title}</Text>
            {subtitle && <Text style={shared.headerSub}>{subtitle}</Text>}
        </LinearGradient>
    );
}
function FormField({ label, children }) {
    return (
        <View style={shared.formRow}>
            <Text style={shared.label}>{label}</Text>
            {children}
        </View>
    );
}
function Input({
    value,
    onChangeText,
    placeholder,
    keyboardType,
    defaultValue,
}) {
    return (
        <TextInput
            style={shared.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text3}
            keyboardType={keyboardType}
            defaultValue={defaultValue}
        />
    );
}
function SubmitBtn({
    label,
    onPress,
    color,
    saving = false,
    disabled = false,
}) {
    return (
        <TouchableOpacity
            style={[
                shared.submitBtn,
                color && { backgroundColor: color },
                saving && { opacity: 0.7 },
            ]}
            onPress={onPress}
            activeOpacity={0.85}
            disabled={disabled}
        >
            {saving ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text style={shared.submitBtnText}>{label}</Text>
            )}
        </TouchableOpacity>
    );
}

// ─── SettleScreen ─────────────────────────────────────────────────────────────
export function SettleScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [payMethod, setPayMethod] = useState("upi");
    return (
        <View style={shared.container}>
            <ModalHeader
                colors={COLORS.gradientGreen}
                title="💰 Settle Up"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={shared.card}>
                        <FormField label="Paying To">
                            {[
                                "Priya Kapoor — ₹210 pending",
                                "Sneha Kulkarni — ₹2,990 pending",
                            ].map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={shared.selectOpt}
                                >
                                    <Text style={shared.selectOptText}>
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </FormField>
                        <FormField label="Amount">
                            <Input defaultValue="₹210" placeholder="Amount" />
                        </FormField>
                        <FormField label="Payment Method">
                            <PaymentMethodPicker
                                value={payMethod}
                                onChange={setPayMethod}
                            />
                        </FormField>
                        <SubmitBtn
                            label="✅ Confirm Settlement"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── GiveMoneyScreen ──────────────────────────────────────────────────────────
export function GiveMoneyScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState("0");
    const [note, setNote] = useState("");
    const [date, setDate] = useState("22/03/2026");
    return (
        <View style={shared.container}>
            <LinearGradient
                colors={["#991B1B", COLORS.danger]}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[shared.header, { paddingTop: insets.top + 6 }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={shared.backBtn}
                >
                    <Text style={shared.backText}>← Back</Text>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 8,
                    }}
                >
                    <View style={styles.dirIcon}>
                        <Text style={{ fontSize: 20 }}>↑</Text>
                    </View>
                    <View>
                        <Text style={shared.headerTitle}>You Gave Money</Text>
                        <Text style={shared.headerSub}>to Priya Kapoor</Text>
                    </View>
                </View>
            </LinearGradient>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={styles.amtBlock}>
                        <Text style={styles.amtLbl}>Enter Amount</Text>
                        <TextInput
                            style={styles.amtInput}
                            value={`₹ ${amount}`}
                            onChangeText={(v) =>
                                setAmount(v.replace(/[^0-9]/g, ""))
                            }
                            keyboardType="numeric"
                            selectTextOnFocus
                        />
                    </View>
                    <View style={shared.card}>
                        <FormField label="Note">
                            <Input
                                value={note}
                                onChangeText={setNote}
                                placeholder="e.g. Lunch split, Cab fare..."
                            />
                        </FormField>
                        <FormField label="Date">
                            <Input value={date} onChangeText={setDate} />
                        </FormField>
                        <SubmitBtn
                            label="✅ Save — You Gave"
                            onPress={() => navigation.goBack()}
                            color={COLORS.danger}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── GetMoneyScreen ───────────────────────────────────────────────────────────
export function GetMoneyScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState("0");
    const [note, setNote] = useState("");
    const [date, setDate] = useState("22/03/2026");
    return (
        <View style={shared.container}>
            <LinearGradient
                colors={["#065F46", COLORS.primary]}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[shared.header, { paddingTop: insets.top + 6 }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={shared.backBtn}
                >
                    <Text style={shared.backText}>← Back</Text>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 8,
                    }}
                >
                    <View style={styles.dirIcon}>
                        <Text style={{ fontSize: 20 }}>↓</Text>
                    </View>
                    <View>
                        <Text style={shared.headerTitle}>
                            You Received Money
                        </Text>
                        <Text style={shared.headerSub}>from Priya Kapoor</Text>
                    </View>
                </View>
            </LinearGradient>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={styles.amtBlock}>
                        <Text style={styles.amtLbl}>Enter Amount</Text>
                        <TextInput
                            style={styles.amtInput}
                            value={`₹ ${amount}`}
                            onChangeText={(v) =>
                                setAmount(v.replace(/[^0-9]/g, ""))
                            }
                            keyboardType="numeric"
                            selectTextOnFocus
                        />
                    </View>
                    <View style={shared.card}>
                        <FormField label="Note">
                            <Input
                                value={note}
                                onChangeText={setNote}
                                placeholder="e.g. She paid me back, Split return..."
                            />
                        </FormField>
                        <FormField label="Date">
                            <Input value={date} onChangeText={setDate} />
                        </FormField>
                        <SubmitBtn
                            label="✅ Save — You Received"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── EditProjectScreen ────────────────────────────────────────────────────────
// export function EditProjectScreen({ navigation, route }) {
//     const insets = useSafeAreaInsets();
//     const { projectId, project: proj, onSaved } = route?.params || {};
//     const [name, setName] = useState(proj?.name || "");
//     const [client, setClient] = useState(proj?.client || "");
//     const [type, setType] = useState(proj?.type || "Development");
//     const [startDate, setStartDate] = useState(
//         proj?.startDate ? isoToDisplay(proj.startDate) : "",
//     );
//     const [endDate, setEndDate] = useState(
//         proj?.endDate ? isoToDisplay(proj.endDate) : "",
//     );
//     const [price, setPrice] = useState(String(proj?.totalPrice || ""));
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const TYPE_CHIPS = [
//         "Development",
//         "UI/UX Design",
//         "Deployment",
//         "Maintenance",
//         "Mobile App",
//         "Web App",
//         "API Integration",
//     ];

//     const handleSave = async () => {
//         setError("");
//         if (!name.trim()) {
//             setError("Project name is required.");
//             return;
//         }
//         if (!client.trim()) {
//             setError("Client is required.");
//             return;
//         }
//         setLoading(true);
//         const res = await updateProject(projectId, {
//             name,
//             client,
//             type,
//             startDate,
//             endDate,
//             totalPrice: price,
//         });
//         setLoading(false);
//         if (res.ok) {
//             if (onSaved) onSaved();
//             navigation.goBack();
//         } else setError(res.message);
//     };

//     return (
//         <KeyboardAvoidingView
//             style={{ flex: 1 }}
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//         >
//             <View style={shared.container}>
//                 <ModalHeader
//                     colors={COLORS.gradientGreen}
//                     title="✏️ Edit Project"
//                     onBack={() => navigation.goBack()}
//                     insets={insets}
//                 />
//                 <ScrollView
//                     showsVerticalScrollIndicator={false}
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     <View style={shared.body}>
//                         {!!error && (
//                             <View style={shared.errorBox}>
//                                 <Text style={shared.errorTxt}>⚠️ {error}</Text>
//                             </View>
//                         )}
//                         <View style={shared.card}>
//                             <FormField label="Project Name">
//                                 <Input
//                                     value={name}
//                                     onChangeText={setName}
//                                     placeholder="e.g. School ERP"
//                                 />
//                             </FormField>
//                             <FormField label="Client / Company">
//                                 <Input
//                                     value={client}
//                                     onChangeText={setClient}
//                                     placeholder="e.g. Maksoft"
//                                 />
//                             </FormField>
//                             <View style={shared.twoCol}>
//                                 <View style={{ flex: 1 }}>
//                                     <FormField label="Start Date">
//                                         <Input
//                                             value={startDate}
//                                             onChangeText={setStartDate}
//                                             placeholder="DD/MM/YYYY"
//                                             keyboardType="numeric"
//                                         />
//                                     </FormField>
//                                 </View>
//                                 <View style={{ flex: 1 }}>
//                                     <FormField label="End Date">
//                                         <Input
//                                             value={endDate}
//                                             onChangeText={setEndDate}
//                                             placeholder="Optional"
//                                             keyboardType="numeric"
//                                         />
//                                     </FormField>
//                                 </View>
//                             </View>
//                             <FormField label="Project Price (₹)">
//                                 <Input
//                                     value={price}
//                                     onChangeText={setPrice}
//                                     placeholder="e.g. 15000"
//                                     keyboardType="numeric"
//                                 />
//                             </FormField>
//                             <FormField label="Project Type">
//                                 <Input
//                                     value={type}
//                                     onChangeText={setType}
//                                     placeholder="e.g. Development"
//                                 />
//                                 <SuggestionChipRow
//                                     chips={TYPE_CHIPS}
//                                     onSelect={setType}
//                                     small
//                                 />
//                             </FormField>
//                             <TouchableOpacity
//                                 style={[
//                                     shared.submitBtn,
//                                     loading && { opacity: 0.65 },
//                                 ]}
//                                 onPress={handleSave}
//                                 disabled={loading}
//                                 activeOpacity={0.85}
//                             >
//                                 {loading ? (
//                                     <ActivityIndicator color="#fff" />
//                                 ) : (
//                                     <Text style={shared.submitBtnText}>
//                                         💾 Save Changes
//                                     </Text>
//                                 )}
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </ScrollView>
//             </View>
//         </KeyboardAvoidingView>
//     );
// }

function fmtDate(raw) {
    const d = raw.replace(/\\D/g, "").slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return d.slice(0, 2) + "/" + d.slice(2);
    return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
}
function dispToISO(display) {
    if (!display) return "";
    const parts = display.split("/");
    if (parts.length !== 3 || parts[2].length < 4) return display;
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

// ─── EditProjectScreen ────────────────────────────────────────────────────────
export function EditProjectScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { projectId, project: proj, onSaved } = route?.params || {};

    const [name, setName] = useState(proj?.name || "");
    const [client, setClient] = useState(proj?.client || "");
    const [type, setType] = useState(proj?.type || "Development");
    const [startDate, setStartDate] = useState(
        proj?.startDate ? isoToDisplay(proj.startDate) : "",
    );
    const [endDate, setEndDate] = useState(
        proj?.endDate ? isoToDisplay(proj.endDate) : "",
    );
    const [price, setPrice] = useState(String(proj?.totalPrice || ""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Client selection
    const [clients, setClients] = useState([]);
    const [clientLoading, setClientLoading] = useState(true);

    const clientChips = clients.length > 0 ? clients.map((c) => c.name) : [];

    useEffect(() => {
        fetchClients().then((r) => {
            if (r.ok) setClients(r.data.clients || []);
            setClientLoading(false);
        });
    }, []);
    const TYPE_GRID = [
        { id: "Development", icon: "💻", label: "Development" },
        { id: "UI/UX Design", icon: "🎨", label: "UI/UX" },
        { id: "Mobile App", icon: "📱", label: "Mobile" },
        { id: "Web App", icon: "🌐", label: "Web App" },
        { id: "Deployment", icon: "🚀", label: "Deploy" },
        { id: "Maintenance", icon: "🔧", label: "Maintain" },
        { id: "API Integration", icon: "🔗", label: "API" },
        { id: "Other", icon: "➕", label: "Other" },
    ];
    const CLIENT_CHIPS = [
        "Maksoft Technologies",
        "Flatshare Karo",
        "School ERP Client",
    ];

    const handleSave = async () => {
        setError("");
        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }
        if (!client.trim()) {
            setError("Client is required.");
            return;
        }
        if (startDate && startDate.length > 0 && startDate.length < 10) {
            setError("Enter a complete start date (DD/MM/YYYY).");
            return;
        }
        setLoading(true);
        const res = await updateProject(projectId, {
            name,
            client,
            type,
            startDate: startDate ? dispToISO(startDate) : undefined,
            endDate: endDate ? dispToISO(endDate) : undefined,
            totalPrice: price || undefined,
        });
        setLoading(false);
        if (res.ok) {
            if (onSaved) onSaved();
            navigation.goBack();
        } else setError(res.message);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={shared.container}>
                <LinearGradient
                    colors={COLORS.gradientBlue}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[epStyles.header, { paddingTop: insets.top + 6 }]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={epStyles.backBtn}
                    >
                        <Text style={epStyles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={epStyles.headerTitle}>✏️ Edit Project</Text>
                    <Text style={epStyles.headerSub}>
                        Update project info and save
                    </Text>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View style={shared.body}>
                        {!!error && (
                            <View style={shared.errorBox}>
                                <Text style={shared.errorTxt}>⚠️ {error}</Text>
                            </View>
                        )}

                        {/* ── Project Info card ── */}
                        <View style={shared.card}>
                            <Text style={epStyles.cardTitle}>
                                📋 Project Info
                            </Text>

                            <FormField label="Project Name">
                                <Input
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. School ERP v2"
                                />
                            </FormField>

                            <FormField label="Project Type">
                                <Input
                                    value={type}
                                    onChangeText={setType}
                                    placeholder="e.g. Development, UI/UX..."
                                />
                                <View style={epStyles.typeGrid}>
                                    {TYPE_GRID.map((t) => (
                                        <TouchableOpacity
                                            key={t.id}
                                            onPress={() => setType(t.id)}
                                            style={[
                                                epStyles.typeCard,
                                                type === t.id &&
                                                    epStyles.typeCardActive,
                                            ]}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={epStyles.typeCardIcon}>
                                                {t.icon}
                                            </Text>
                                            <Text
                                                style={[
                                                    epStyles.typeCardLbl,
                                                    type === t.id &&
                                                        epStyles.typeCardLblActive,
                                                ]}
                                            >
                                                {t.label}
                                            </Text>
                                            {type === t.id && (
                                                <View
                                                    style={
                                                        epStyles.typeCardCheck
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 9,
                                                            color: "#fff",
                                                            fontFamily:
                                                                FONTS.nunito
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
                            </FormField>
                        </View>

                        {/* ── Client card ── */}
                        <View style={shared.card}>
                            <Text style={epStyles.cardTitle}>🏢 Client</Text>
                            <FormField label="Client / Company">
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
                            </FormField>
                        </View>

                        {/* ── Timeline & Budget card ── */}
                        <View style={shared.card}>
                            <Text style={epStyles.cardTitle}>
                                📅 Timeline & Budget
                            </Text>

                            <View style={shared.twoCol}>
                                <View style={{ flex: 1 }}>
                                    <FormField label="Start Date">
                                        <View style={epStyles.dateWrap}>
                                            <Text style={epStyles.dateIcon}>
                                                📅
                                            </Text>
                                            <TextInput
                                                style={epStyles.dateInput}
                                                value={startDate}
                                                onChangeText={(v) =>
                                                    setStartDate(fmtDate(v))
                                                }
                                                placeholder="DD/MM/YYYY"
                                                placeholderTextColor={
                                                    COLORS.text3
                                                }
                                                keyboardType="numeric"
                                                maxLength={10}
                                            />
                                        </View>
                                    </FormField>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FormField label="End Date">
                                        <View style={epStyles.dateWrap}>
                                            <Text style={epStyles.dateIcon}>
                                                🏁
                                            </Text>
                                            <TextInput
                                                style={epStyles.dateInput}
                                                value={endDate}
                                                onChangeText={(v) =>
                                                    setEndDate(fmtDate(v))
                                                }
                                                placeholder="DD/MM/YYYY"
                                                placeholderTextColor={
                                                    COLORS.text3
                                                }
                                                keyboardType="numeric"
                                                maxLength={10}
                                            />
                                        </View>
                                    </FormField>
                                </View>
                            </View>

                            <FormField label="Project Price (₹)">
                                <View style={epStyles.priceWrap}>
                                    <View style={epStyles.pricePfx}>
                                        <Text style={epStyles.pricePfxTxt}>
                                            ₹
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={epStyles.priceInput}
                                        value={price}
                                        onChangeText={setPrice}
                                        placeholder="0"
                                        placeholderTextColor={COLORS.text3}
                                        keyboardType="numeric"
                                    />
                                    {!!price && Number(price) > 0 && (
                                        <Text style={epStyles.priceFmt}>
                                            ₹
                                            {Number(price).toLocaleString(
                                                "en-IN",
                                            )}
                                        </Text>
                                    )}
                                </View>
                            </FormField>
                        </View>

                        <TouchableOpacity
                            style={[
                                epStyles.saveBtn,
                                loading && { opacity: 0.65 },
                            ]}
                            onPress={handleSave}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={epStyles.saveBtnTxt}>
                                    💾 Save Changes
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}
// ─── StatusScreen ─────────────────────────────────────────────────────────────
export function StatusScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { projectId, currentStatus, onChanged } = route?.params || {};
    const [selected, setSelected] = useState(currentStatus || "inprogress");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const STATUS_OPTIONS = [
        {
            id: "inactive",
            icon: "⏸️",
            label: "In-Active",
            sub: "Project is on hold or not started",
            bg: "#F3F4F6",
            bc: "#9CA3AF",
        },
        {
            id: "inprogress",
            icon: "🔵",
            label: "In-Progress",
            sub: "Currently being worked on",
            bg: "#DBEAFE",
            bc: "#2563eb",
        },
        {
            id: "onstay",
            icon: "⏳",
            label: "On-Stay",
            sub: "Paused, waiting for client/input",
            bg: "#FEF3C7",
            bc: "#F59E0B",
        },
        {
            id: "completed",
            icon: "✅",
            label: "Completed",
            sub: "Project delivered & done",
            bg: "#D1FAE5",
            bc: COLORS.primary,
        },
        {
            id: "cancelled",
            icon: "❌",
            label: "Cancelled",
            sub: "Project was cancelled",
            bg: "#FEE2E2",
            bc: COLORS.danger,
        },
    ];

    const handleUpdate = async () => {
        setError("");
        setLoading(true);
        const res = await updateProjectStatus(projectId, selected);
        setLoading(false);
        if (res.ok) {
            if (onChanged) onChanged();
            navigation.goBack();
        } else setError(res.message);
    };

    return (
        <View style={shared.container}>
            <ModalHeader
                colors={COLORS.gradientGreen}
                title="🔄 Change Status"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={shared.body}>
                    {!!error && (
                        <View style={shared.errorBox}>
                            <Text style={shared.errorTxt}>⚠️ {error}</Text>
                        </View>
                    )}
                    <View style={shared.card}>
                        <Text style={shared.sectionHeader}>
                            Select Project Status
                        </Text>
                        <View style={{ gap: 10 }}>
                            {STATUS_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt.id}
                                    onPress={() => setSelected(opt.id)}
                                    style={[
                                        styles.statusOpt,
                                        {
                                            borderColor:
                                                selected === opt.id
                                                    ? opt.bc
                                                    : COLORS.border,
                                            borderWidth:
                                                selected === opt.id ? 2 : 1.5,
                                            backgroundColor:
                                                selected === opt.id
                                                    ? opt.bg
                                                    : "#F9FAFB",
                                        },
                                    ]}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            styles.statusIcon,
                                            { backgroundColor: opt.bg },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 18 }}>
                                            {opt.icon}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.statusLabel}>
                                            {opt.label}
                                        </Text>
                                        <Text style={styles.statusSub}>
                                            {opt.sub}
                                        </Text>
                                    </View>
                                    {selected === opt.id && (
                                        <Text style={{ fontSize: 16 }}>✅</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={[
                                shared.submitBtn,
                                loading && { opacity: 0.65 },
                            ]}
                            onPress={handleUpdate}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={shared.submitBtnText}>
                                    ✅ Update Status
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── EditDevScreen ────────────────────────────────────────────────────────────
export function EditDevScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [role, setRole] = useState("Frontend Developer");
    const ROLE_CHIPS = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack",
        "UI/UX Designer",
        "DevOps Engineer",
        "Mobile Developer",
    ];
    return (
        <View style={shared.container}>
            <ModalHeader
                colors={COLORS.gradientAmber}
                title="✏️ Edit Developer"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={shared.card}>
                        <FormField label="Full Name">
                            <Input defaultValue="Zafran" />
                        </FormField>
                        <View style={shared.twoCol}>
                            <View style={{ flex: 1 }}>
                                <FormField label="Phone">
                                    <Input
                                        defaultValue="+91 98XXX XXXXX"
                                        keyboardType="phone-pad"
                                    />
                                </FormField>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormField label="UPI ID">
                                    <Input defaultValue="zafran@upi" />
                                </FormField>
                            </View>
                        </View>
                        <FormField label="Role / Skill">
                            <Input value={role} onChangeText={setRole} />
                            <SuggestionChipRow
                                chips={ROLE_CHIPS}
                                onSelect={setRole}
                                small
                            />
                        </FormField>
                        <SubmitBtn
                            label="💾 Save Changes"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── DevStatusScreen ──────────────────────────────────────────────────────────
export function DevStatusScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [selected, setSelected] = useState("active");
    return (
        <View style={shared.container}>
            <ModalHeader
                colors={COLORS.gradientAmber}
                title="🔄 Developer Status"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={shared.body}>
                    <View style={shared.card}>
                        <Text style={shared.sectionHeader}>Select Status</Text>
                        <View style={{ gap: 10 }}>
                            {[
                                {
                                    id: "active",
                                    icon: "✅",
                                    label: "Active",
                                    sub: "Currently working on projects",
                                    bg: "#D1FAE5",
                                    bc: COLORS.primary,
                                },
                                {
                                    id: "inactive",
                                    icon: "⏸️",
                                    label: "In-Active",
                                    sub: "Paused contract / not working",
                                    bg: "#F3F4F6",
                                    bc: "#9CA3AF",
                                },
                            ].map((opt) => (
                                <TouchableOpacity
                                    key={opt.id}
                                    onPress={() => setSelected(opt.id)}
                                    style={[
                                        styles.statusOpt,
                                        {
                                            borderColor:
                                                selected === opt.id
                                                    ? opt.bc
                                                    : COLORS.border,
                                            borderWidth:
                                                selected === opt.id ? 2 : 1.5,
                                            backgroundColor:
                                                selected === opt.id
                                                    ? opt.bg
                                                    : "#F9FAFB",
                                        },
                                    ]}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            styles.statusIcon,
                                            { backgroundColor: opt.bg },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 18 }}>
                                            {opt.icon}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.statusLabel}>
                                            {opt.label}
                                        </Text>
                                        <Text style={styles.statusSub}>
                                            {opt.sub}
                                        </Text>
                                    </View>
                                    {selected === opt.id && (
                                        <Text style={{ fontSize: 16 }}>✅</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <SubmitBtn
                            label="✅ Update Status"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── EditClientScreen ─────────────────────────────────────────────────────────
export function EditClientScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [industry, setIndustry] = useState("Technology");
    const INDUSTRY_CHIPS = [
        "Technology",
        "Education",
        "Real Estate",
        "Retail",
        "Finance",
    ];
    return (
        <View style={shared.container}>
            <ModalHeader
                colors={COLORS.gradientBlue}
                title="✏️ Edit Client"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={shared.card}>
                        <FormField label="Company Name">
                            <Input defaultValue="Flatshare Karo" />
                        </FormField>
                        <View style={shared.twoCol}>
                            <View style={{ flex: 1 }}>
                                <FormField label="Contact Person">
                                    <Input defaultValue="Prashant K." />
                                </FormField>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormField label="Phone">
                                    <Input
                                        defaultValue="+91 97XXX XXXXX"
                                        keyboardType="phone-pad"
                                    />
                                </FormField>
                            </View>
                        </View>
                        <FormField label="Industry">
                            <Input
                                value={industry}
                                onChangeText={setIndustry}
                            />
                            <SuggestionChipRow
                                chips={INDUSTRY_CHIPS}
                                onSelect={setIndustry}
                                small
                            />
                        </FormField>
                        <SubmitBtn
                            label="💾 Save Changes"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── ClientStatusScreen ───────────────────────────────────────────────────────
export function ClientStatusScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [selected, setSelected] = useState("active");
    return (
        <View style={shared.container}>
            <ModalHeader
                colors={COLORS.gradientBlue}
                title="🔄 Client Status"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={shared.body}>
                    <View style={shared.card}>
                        <Text style={shared.sectionHeader}>Select Status</Text>
                        <View style={{ gap: 10 }}>
                            {[
                                {
                                    id: "active",
                                    icon: "✅",
                                    label: "Active",
                                    sub: "Ongoing business relationship",
                                    bg: "#D1FAE5",
                                    bc: COLORS.primary,
                                },
                                {
                                    id: "inactive",
                                    icon: "⏸️",
                                    label: "In-Active",
                                    sub: "No current projects or dealings",
                                    bg: "#F3F4F6",
                                    bc: "#9CA3AF",
                                },
                            ].map((opt) => (
                                <TouchableOpacity
                                    key={opt.id}
                                    onPress={() => setSelected(opt.id)}
                                    style={[
                                        styles.statusOpt,
                                        {
                                            borderColor:
                                                selected === opt.id
                                                    ? opt.bc
                                                    : COLORS.border,
                                            borderWidth:
                                                selected === opt.id ? 2 : 1.5,
                                            backgroundColor:
                                                selected === opt.id
                                                    ? opt.bg
                                                    : "#F9FAFB",
                                        },
                                    ]}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            styles.statusIcon,
                                            { backgroundColor: opt.bg },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 18 }}>
                                            {opt.icon}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.statusLabel}>
                                            {opt.label}
                                        </Text>
                                        <Text style={styles.statusSub}>
                                            {opt.sub}
                                        </Text>
                                    </View>
                                    {selected === opt.id && (
                                        <Text style={{ fontSize: 16 }}>✅</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <SubmitBtn
                            label="✅ Update Status"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── AddDevToProjectScreen ────────────────────────────────────────────────────
export function AddDevToProjectScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const { projectId, onAdded } = route?.params || {};

    const [knownDevs, setKnownDevs] = useState([]);
    const [loadingDevs, setLoadingDevs] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDev, setSelectedDev] = useState(null);
    const [devRole, setDevRole] = useState("");
    const [pay, setPay] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const ROLE_CHIPS = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack",
        "UI/UX Designer",
        "DevOps",
        "QA Tester",
    ];

    // ── Helpers ──────────────────────────────────────────────────────────────
    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "DV";
    const COLORS_LIST = [
        "#ba7517",
        "#378add",
        "#d4537e",
        "#534ab7",
        "#1a7a5e",
        "#d85a30",
    ];
    const getColor = (name = "") => {
        let h = 0;
        for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
        return COLORS_LIST[Math.abs(h) % COLORS_LIST.length];
    };

    React.useEffect(() => {
        setLoadingDevs(true);
        fetchDevelopers().then((res) => {
            if (res.ok) setKnownDevs(res.data.developers || []);
            setLoadingDevs(false);
        });
    }, []);

    // ── Filtered list ────────────────────────────────────────────────────────
    const filteredDevs = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return knownDevs;
        return knownDevs.filter(
            (d) =>
                d.name?.toLowerCase().includes(q) ||
                d.role?.toLowerCase().includes(q) ||
                d.phone?.toLowerCase().includes(q),
        );
    }, [knownDevs, search]);

    const handleSelect = (dev) => {
        setSelectedDev(dev);
        if (dev.role && !devRole) setDevRole(dev.role);
        setSearch(""); // clear search after pick so list resets
    };

    const handleAdd = async () => {
        setError("");
        if (!selectedDev) {
            setError("Please select a developer.");
            return;
        }
        if (!pay || isNaN(Number(pay)) || Number(pay) <= 0) {
            setError("Enter a valid agreed amount.");
            return;
        }
        setLoading(true);
        const res = await addDevToProject(projectId, {
            developer: selectedDev._id,
            role: devRole,
            agreedAmount: pay,
        });
        setLoading(false);
        if (res.ok) {
            if (onAdded) onAdded();
            navigation.goBack();
        } else setError(res.message);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={shared.container}>
                {/* Header */}
                <LinearGradient
                    colors={COLORS.gradientGreen}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[shared.header, { paddingTop: insets.top + 6 }]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={shared.backBtn}
                    >
                        <Text style={shared.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={shared.headerTitle}>
                        ➕ Add Developer to Project
                    </Text>
                    <Text style={shared.headerSub}>
                        Search and pick a developer, then set role & pay
                    </Text>
                </LinearGradient>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View style={shared.body}>
                        {!!error && (
                            <View
                                style={[shared.errorBox, { marginBottom: 12 }]}
                            >
                                <Text style={shared.errorTxt}>⚠️ {error}</Text>
                            </View>
                        )}

                        {/* ── STEP 1: Select Developer ── */}
                        <View style={shared.card}>
                            {/* Step label + count */}
                            <View style={styles.stepHeader}>
                                <View style={styles.stepBadge}>
                                    <Text style={styles.stepBadgeTxt}>1</Text>
                                </View>
                                <Text style={styles.stepTitle}>
                                    Select Developer
                                </Text>
                                {knownDevs.length > 0 && (
                                    <Text style={styles.devCount}>
                                        {filteredDevs.length}/{knownDevs.length}
                                    </Text>
                                )}
                            </View>

                            {/* Search bar — only shown when devs exist */}
                            {!loadingDevs && knownDevs.length > 0 && (
                                <View style={styles.searchBar}>
                                    <Text style={styles.searchIcon}>🔍</Text>
                                    <TextInput
                                        style={styles.searchInput}
                                        value={search}
                                        onChangeText={setSearch}
                                        placeholder="Search by name, role or phone..."
                                        placeholderTextColor={COLORS.text3}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                    />
                                    {search.length > 0 && (
                                        <TouchableOpacity
                                            onPress={() => setSearch("")}
                                            hitSlop={{
                                                top: 8,
                                                bottom: 8,
                                                left: 8,
                                                right: 8,
                                            }}
                                        >
                                            <Text style={styles.searchClear}>
                                                ✕
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {/* Loading */}
                            {loadingDevs && (
                                <View style={styles.devLoadingRow}>
                                    <ActivityIndicator
                                        size="small"
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.devLoadingTxt}>
                                        Loading your team...
                                    </Text>
                                </View>
                            )}

                            {/* Empty team */}
                            {!loadingDevs && knownDevs.length === 0 && (
                                <View style={styles.emptyDevBox}>
                                    <Text
                                        style={{
                                            fontSize: 28,
                                            marginBottom: 6,
                                        }}
                                    >
                                        👨‍💻
                                    </Text>
                                    <Text style={styles.emptyDevTitle}>
                                        No developers yet
                                    </Text>
                                    <Text style={styles.emptyDevSub}>
                                        Go to Profile → My Developers to add
                                        your team first.
                                    </Text>
                                </View>
                            )}

                            {/* No search results */}
                            {!loadingDevs &&
                                knownDevs.length > 0 &&
                                filteredDevs.length === 0 && (
                                    <View style={styles.emptyDevBox}>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                marginBottom: 6,
                                            }}
                                        >
                                            🔍
                                        </Text>
                                        <Text style={styles.emptyDevTitle}>
                                            No match for "{search}"
                                        </Text>
                                        <Text style={styles.emptyDevSub}>
                                            Try a different name or role.
                                        </Text>
                                    </View>
                                )}

                            {/* ── Horizontal card list ── */}
                            {!loadingDevs && filteredDevs.length > 0 && (
                                <>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={
                                            styles.devHScroll
                                        }
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        {filteredDevs.map((dev) => {
                                            const isSelected =
                                                selectedDev?._id === dev._id;
                                            const col = getColor(dev.name);
                                            const init = getInitials(dev.name);
                                            const hasDebt =
                                                (dev.totalPending || 0) > 0;

                                            return (
                                                <TouchableOpacity
                                                    key={dev._id}
                                                    onPress={() =>
                                                        handleSelect(dev)
                                                    }
                                                    style={[
                                                        styles.devHCard,
                                                        isSelected &&
                                                            styles.devHCardSelected,
                                                    ]}
                                                    activeOpacity={0.8}
                                                >
                                                    {/* Selection ring on avatar */}
                                                    <View
                                                        style={[
                                                            styles.devHAvRing,
                                                            isSelected && {
                                                                borderColor:
                                                                    COLORS.primary,
                                                                borderWidth: 3,
                                                            },
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.devHAv,
                                                                {
                                                                    backgroundColor:
                                                                        col,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.devHAvTxt
                                                                }
                                                            >
                                                                {init}
                                                            </Text>
                                                        </View>
                                                        {isSelected && (
                                                            <View
                                                                style={
                                                                    styles.devHCheck
                                                                }
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.devHCheckTxt
                                                                    }
                                                                >
                                                                    ✓
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    {/* Name */}
                                                    <Text
                                                        style={[
                                                            styles.devHName,
                                                            isSelected && {
                                                                color: COLORS.primary,
                                                            },
                                                        ]}
                                                        numberOfLines={1}
                                                    >
                                                        {dev.name}
                                                    </Text>

                                                    {/* Role chip */}
                                                    <Text
                                                        style={styles.devHRole}
                                                        numberOfLines={1}
                                                    >
                                                        {dev.role ||
                                                            "Developer"}
                                                    </Text>

                                                    {/* Pending badge */}
                                                    {hasDebt && (
                                                        <View
                                                            style={
                                                                styles.devHDebt
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.devHDebtTxt
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
                                                                      ) + "k"
                                                                    : dev.totalPending}{" "}
                                                                due
                                                            </Text>
                                                        </View>
                                                    )}

                                                    {/* Status dot */}
                                                    <View
                                                        style={
                                                            styles.devHStatusRow
                                                        }
                                                    >
                                                        <View
                                                            style={[
                                                                styles.devHDot,
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
                                                                styles.devHStatusTxt
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

                                    {/* Hint text when nothing selected yet */}
                                    {!selectedDev && (
                                        <Text style={styles.scrollHint}>
                                            ← Scroll to browse · tap to select
                                        </Text>
                                    )}
                                </>
                            )}
                        </View>

                        {/* ── STEP 2: Role & Payment (appears after selection) ── */}
                        {selectedDev && (
                            <View
                                style={[
                                    shared.card,
                                    {
                                        borderWidth: 1.5,
                                        borderColor: COLORS.primary,
                                    },
                                ]}
                            >
                                {/* Step label */}
                                <View
                                    style={[
                                        styles.stepHeader,
                                        { marginBottom: 14 },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.stepBadge,
                                            { backgroundColor: COLORS.primary },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.stepBadgeTxt,
                                                { color: "#fff" },
                                            ]}
                                        >
                                            2
                                        </Text>
                                    </View>
                                    <Text style={styles.stepTitle}>
                                        Role & Payment
                                    </Text>
                                </View>

                                {/* Selected dev banner */}
                                <View style={styles.selectedBanner}>
                                    <View
                                        style={[
                                            styles.selectedAv,
                                            {
                                                backgroundColor: getColor(
                                                    selectedDev.name,
                                                ),
                                            },
                                        ]}
                                    >
                                        <Text style={styles.selectedAvTxt}>
                                            {getInitials(selectedDev.name)}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.selectedName}>
                                            {selectedDev.name}
                                        </Text>
                                        <Text style={styles.selectedRole}>
                                            {selectedDev.role || "Developer"}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedDev(null);
                                            setDevRole("");
                                            setPay("");
                                        }}
                                        style={styles.changeBadge}
                                    >
                                        <Text style={styles.changeTxt}>
                                            Change
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Role field */}
                                <FormField label="Role on this Project">
                                    <Input
                                        value={devRole}
                                        onChangeText={setDevRole}
                                        placeholder="e.g. Frontend Developer"
                                    />
                                    <SuggestionChipRow
                                        chips={ROLE_CHIPS}
                                        onSelect={setDevRole}
                                        small
                                    />
                                </FormField>

                                {/* Pay field */}
                                <FormField label="Agreed Pay for this Project (₹)">
                                    <Input
                                        value={pay}
                                        onChangeText={setPay}
                                        placeholder="e.g. 5000"
                                        keyboardType="numeric"
                                    />
                                </FormField>

                                {/* Payment preview */}
                                {!!pay && Number(pay) > 0 && (
                                    <View style={styles.payPreview}>
                                        <Text style={styles.payPreviewTitle}>
                                            💰 Payment Preview
                                        </Text>
                                        <View style={styles.payPreviewRow}>
                                            <Text style={styles.payPreviewLbl}>
                                                Developer
                                            </Text>
                                            <Text style={styles.payPreviewVal}>
                                                {selectedDev.name}
                                            </Text>
                                        </View>
                                        <View style={styles.payPreviewRow}>
                                            <Text style={styles.payPreviewLbl}>
                                                Role
                                            </Text>
                                            <Text style={styles.payPreviewVal}>
                                                {devRole ||
                                                    selectedDev.role ||
                                                    "—"}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.payPreviewRow,
                                                {
                                                    borderBottomWidth: 0,
                                                    marginBottom: 0,
                                                    paddingBottom: 0,
                                                },
                                            ]}
                                        >
                                            <Text style={styles.payPreviewLbl}>
                                                Agreed amount
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.payPreviewVal,
                                                    {
                                                        color: COLORS.primary,
                                                        fontSize: SIZES.md2,
                                                    },
                                                ]}
                                            >
                                                ₹
                                                {Number(pay).toLocaleString(
                                                    "en-IN",
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Submit */}
                                <TouchableOpacity
                                    style={[
                                        shared.submitBtn,
                                        loading && { opacity: 0.65 },
                                    ]}
                                    onPress={handleAdd}
                                    disabled={loading}
                                    activeOpacity={0.85}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={shared.submitBtnText}>
                                            ✅ Add to Project
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────
const shared = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 18, paddingBottom: 18 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
    },
    headerTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.xl,
        color: "#fff",
    },
    headerSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.card,
    },
    sectionHeader: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    formRow: { marginBottom: 12 },
    label: {
        fontFamily: FONTS.dmSans.semiBold,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
        marginBottom: 4,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 12,
        paddingVertical: 9,
        fontSize: SIZES.md,
        fontFamily: FONTS.dmSans.regular,
        color: COLORS.text,
    },
    selectOpt: {
        padding: 10,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
        marginBottom: 6,
    },
    selectOptText: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.lg,
        padding: 12,
        alignItems: "center",
        marginTop: 6,
    },
    submitBtnText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    twoCol: { flexDirection: "row", gap: 8 },
    errorBox: {
        backgroundColor: "#FEF2F2",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        marginTop: 8,
    },
    errorTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.danger,
    },
    successBox: {
        backgroundColor: "#F0FDF4",
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
        marginTop: 8,
    },
    successTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.primary,
    },
});

const styles = StyleSheet.create({
    amtBlock: {
        backgroundColor: COLORS.text,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
    },
    amtLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: "rgba(255,255,255,0.55)",
        marginBottom: 8,
    },
    amtInput: {
        fontFamily: FONTS.nunito.black,
        fontSize: 42,
        color: "#fff",
        letterSpacing: -2,
        textAlign: "center",
        minWidth: 140,
    },
    dirIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    statusOpt: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 12,
    },
    statusIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    statusLabel: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    statusSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },

    // AddDevToProjectScreen styles

    devPickOpt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
        marginBottom: 6,
    },
    devPickOptActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    devPickTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
        flex: 1,
    },
    devPickTxtActive: { color: COLORS.text, fontFamily: FONTS.dmSans.semiBold },
    // AddDevToProject styles
    // stepTitle: {
    //     fontFamily: FONTS.nunito.black,
    //     fontSize: SIZES.md2,
    //     color: COLORS.text,
    //     marginBottom: 12,
    // },
    // stepNum: {
    //     fontFamily: FONTS.nunito.black,
    //     fontSize: SIZES.md2,
    //     color: COLORS.primary,
    // },
    // devLoadingRow: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     gap: 10,
    //     padding: 12,
    // },
    // devLoadingTxt: {
    //     fontFamily: FONTS.dmSans.regular,
    //     fontSize: SIZES.md,
    //     color: COLORS.text2,
    // },
    // emptyDevBox: { alignItems: "center", padding: 20, gap: 6 },
    // emptyDevTitle: {
    //     fontFamily: FONTS.nunito.extraBold,
    //     fontSize: SIZES.lg2,
    //     color: COLORS.text,
    // },
    // emptyDevSub: {
    //     fontFamily: FONTS.dmSans.regular,
    //     fontSize: SIZES.base,
    //     color: COLORS.text2,
    //     textAlign: "center",
    //     lineHeight: 18,
    // },
    // devGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    // devCard: {
    //     width: "47%",
    //     backgroundColor: "#F9FAFB",
    //     borderRadius: 14,
    //     padding: 12,
    //     alignItems: "center",
    //     borderWidth: 1.5,
    //     borderColor: COLORS.border,
    //     position: "relative",
    // },
    // devCardSelected: {
    //     borderColor: COLORS.primary,
    //     backgroundColor: COLORS.primaryUltraLight,
    // },
    // devCardCheck: {
    //     position: "absolute",
    //     top: 8,
    //     right: 8,
    //     width: 20,
    //     height: 20,
    //     borderRadius: 10,
    //     backgroundColor: COLORS.primary,
    //     alignItems: "center",
    //     justifyContent: "center",
    // },
    // devCardCheckTxt: {
    //     fontFamily: FONTS.nunito.black,
    //     fontSize: 11,
    //     color: "#fff",
    // },
    // devCardAv: {
    //     width: 44,
    //     height: 44,
    //     borderRadius: 22,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     marginBottom: 8,
    // },
    // devCardAvTxt: {
    //     fontFamily: FONTS.nunito.black,
    //     fontSize: 18,
    //     color: "#fff",
    // },
    // devCardName: {
    //     fontFamily: FONTS.nunito.extraBold,
    //     fontSize: SIZES.base,
    //     color: COLORS.text,
    //     textAlign: "center",
    // },
    // devCardRole: {
    //     fontFamily: FONTS.dmSans.regular,
    //     fontSize: SIZES.sm2,
    //     color: COLORS.text2,
    //     textAlign: "center",
    //     marginTop: 2,
    // },
    // devCardBadge: {
    //     marginTop: 6,
    //     backgroundColor: "#FEE2E2",
    //     borderRadius: 8,
    //     paddingHorizontal: 6,
    //     paddingVertical: 2,
    // },
    // devCardBadgeTxt: {
    //     fontFamily: FONTS.nunito.bold,
    //     fontSize: SIZES.sm,
    //     color: COLORS.danger,
    // },
    // selectedBanner: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     gap: 10,
    //     backgroundColor: COLORS.primaryUltraLight,
    //     borderRadius: 12,
    //     padding: 12,
    //     marginBottom: 14,
    // },
    // selectedAv: {
    //     width: 38,
    //     height: 38,
    //     borderRadius: 19,
    //     alignItems: "center",
    //     justifyContent: "center",
    // },
    // selectedAvTxt: {
    //     fontFamily: FONTS.nunito.black,
    //     fontSize: 16,
    //     color: "#fff",
    // },
    // selectedName: {
    //     fontFamily: FONTS.nunito.extraBold,
    //     fontSize: SIZES.md,
    //     color: COLORS.text,
    // },
    // selectedRole: {
    //     fontFamily: FONTS.dmSans.regular,
    //     fontSize: SIZES.sm2,
    //     color: COLORS.text2,
    // },
    // changeBadge: {
    //     backgroundColor: COLORS.primary,
    //     borderRadius: 8,
    //     paddingHorizontal: 8,
    //     paddingVertical: 4,
    // },
    // changeTxt: {
    //     fontFamily: FONTS.nunito.bold,
    //     fontSize: SIZES.sm2,
    //     color: "#fff",
    // },
    // payPreview: {
    //     backgroundColor: "#F0FDF4",
    //     borderRadius: 10,
    //     padding: 12,
    //     marginBottom: 12,
    //     borderWidth: 1,
    //     borderColor: "#A7F3D0",
    // },
    // payPreviewTitle: {
    //     fontFamily: FONTS.nunito.bold,
    //     fontSize: SIZES.sm2,
    //     color: COLORS.primary,
    //     marginBottom: 8,
    // },
    // payPreviewRow: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     marginBottom: 4,
    // },
    // payPreviewLbl: {
    //     fontFamily: FONTS.dmSans.regular,
    //     fontSize: SIZES.base,
    //     color: COLORS.text2,
    // },
    // payPreviewVal: {
    //     fontFamily: FONTS.nunito.extraBold,
    //     fontSize: SIZES.base,
    //     color: COLORS.text,
    // },
    stepHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    stepBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primaryUltraLight,
        alignItems: "center",
        justifyContent: "center",
    },
    stepBadgeTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.sm2,
        color: COLORS.primary,
    },
    stepTitle: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        color: COLORS.text,
        flex: 1,
    },
    devCount: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
    },
    // Search bar
    searchBar: {
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
    searchIcon: { fontSize: 15 },
    searchInput: {
        flex: 1,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    searchClear: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text3,
        paddingHorizontal: 4,
    },
    // Loading / empty
    devLoadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 16,
    },
    devLoadingTxt: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md,
        color: COLORS.text2,
    },
    emptyDevBox: { alignItems: "center", paddingVertical: 20, gap: 4 },
    emptyDevTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.lg2,
        color: COLORS.text,
    },
    emptyDevSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        textAlign: "center",
        lineHeight: 18,
    },
    // Horizontal scroll list
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
        marginTop: 2,
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
    scrollHint: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        textAlign: "center",
        marginTop: 10,
    },
    // Step 2 — selected banner
    selectedBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
    },
    selectedAv: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedAvTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: 16,
        color: "#fff",
    },
    selectedName: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    selectedRole: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: COLORS.text2,
    },
    changeBadge: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    changeTxt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: "#fff",
    },
    // Payment preview
    payPreview: {
        backgroundColor: "#F0FDF4",
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#A7F3D0",
    },
    payPreviewTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.primary,
        marginBottom: 10,
    },
    payPreviewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#A7F3D0",
    },
    payPreviewLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    payPreviewVal: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.base,
        color: COLORS.text,
    },
});
const epStyles = StyleSheet.create({
    header: { paddingHorizontal: 18, paddingBottom: 18 },
    backBtn: { marginBottom: 10 },
    backText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "rgba(255,255,255,0.9)",
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
    cardTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
        marginBottom: 14,
    },
    typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
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
    dateWrap: {
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
    optLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm,
        color: COLORS.text3,
        marginTop: 4,
    },
    priceWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        overflow: "hidden",
    },
    pricePfx: {
        backgroundColor: COLORS.primaryUltraLight,
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRightWidth: 1.5,
        borderRightColor: COLORS.border,
    },
    pricePfxTxt: {
        fontFamily: FONTS.nunito.black,
        fontSize: SIZES.md2,
        color: COLORS.primary,
    },
    priceInput: {
        flex: 1,
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.lg,
        color: COLORS.text,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    priceFmt: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.text3,
        paddingRight: 12,
    },
    saveBtn: {
        backgroundColor: "#1D4ED8",
        borderRadius: RADIUS.xl,
        padding: 14,
        alignItems: "center",
        marginBottom: 10,
    },
    saveBtnTxt: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
});
