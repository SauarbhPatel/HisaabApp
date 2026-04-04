import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from "react-native";
import { ActivityIndicator, Alert } from "react-native";
import { createDeveloper } from "../../api/developers";
import { createClient } from "../../api/clients";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SuggestionChipRow } from "../../components/shared/SuggestionChip";
import PaymentMethodPicker from "../../components/shared/PaymentMethodPicker";
import SplitToggle from "../../components/shared/SplitToggle";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS, SIZES, RADIUS } from "../../theme/typography";
import { FRIENDS } from "../../data/mockData";

// ─── Shared helpers ──────────────────────────────────────────────────────────
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
    secureTextEntry,
}) {
    return (
        <TextInput
            style={shared.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text3}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
        />
    );
}
function Header({ colors, title, onBack, insets }) {
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
        </LinearGradient>
    );
}
function SubmitBtn({ label, onPress }) {
    return (
        <TouchableOpacity
            style={shared.submitBtn}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={shared.submitBtnText}>{label}</Text>
        </TouchableOpacity>
    );
}

// ─── AddGroupScreen ───────────────────────────────────────────────────────────
export function AddGroupScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState("");
    const [groupType, setGroupType] = useState("🏠 Home");
    const [selectedIcon, setSelectedIcon] = useState("🏠");
    const ICONS = ["🏠", "✈️", "🎉", "💼", "🍺", "🏖️"];
    const GROUP_TYPES = ["🏠 Home", "✈️ Trip", "💼 Work", "🎉 Other"];
    const [members, setMembers] = useState(["priya", "amit"]);

    return (
        <View style={shared.container}>
            <Header
                colors={COLORS.gradientBlue}
                title="👥 Create New Group"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={shared.card}>
                        <Text style={shared.cardTitle}>📝 Group Info</Text>
                        <View style={shared.row}>
                            <View>
                                <Text style={shared.label}>Icon</Text>
                                <View style={styles.iconGrid}>
                                    {ICONS.map((ic) => (
                                        <TouchableOpacity
                                            key={ic}
                                            onPress={() => setSelectedIcon(ic)}
                                            style={[
                                                styles.iconOpt,
                                                selectedIcon === ic &&
                                                    styles.iconOptActive,
                                            ]}
                                        >
                                            <Text style={{ fontSize: 18 }}>
                                                {ic}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormField label="Group Name">
                                    <Input
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="e.g. Flat Koramangala"
                                    />
                                </FormField>
                            </View>
                        </View>
                        <FormField label="Type">
                            <SplitToggle
                                value={groupType}
                                onChange={setGroupType}
                                options={GROUP_TYPES}
                            />
                        </FormField>
                    </View>

                    <View style={shared.card}>
                        <Text style={shared.cardTitle}>👥 Add Members</Text>
                        {FRIENDS.map((friend) => (
                            <View key={friend.id} style={styles.memberRow}>
                                <View
                                    style={[
                                        styles.memberAv,
                                        { backgroundColor: friend.color },
                                    ]}
                                >
                                    <Text style={styles.memberAvText}>
                                        {friend.initials}
                                    </Text>
                                </View>
                                <Text style={styles.memberName}>
                                    {friend.name}
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        setMembers((m) =>
                                            m.includes(friend.id)
                                                ? m.filter(
                                                      (id) => id !== friend.id,
                                                  )
                                                : [...m, friend.id],
                                        )
                                    }
                                    style={[
                                        styles.memberToggle,
                                        members.includes(friend.id) &&
                                            styles.memberToggleActive,
                                    ]}
                                >
                                    <Text style={styles.memberToggleText}>
                                        {members.includes(friend.id)
                                            ? "✓"
                                            : "+"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <SubmitBtn
                        label="✅ Create Group"
                        onPress={() => navigation.goBack()}
                    />
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

// ─── AddFriendScreen ──────────────────────────────────────────────────────────
export function AddFriendScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [nick, setNick] = useState("");
    const [avatarColor, setAvatarColor] = useState("#1a7a5e");
    const AVATAR_COLORS = [
        "#1a7a5e",
        "#378add",
        "#d4537e",
        "#534ab7",
        "#ba7517",
        "#d85a30",
    ];

    return (
        <View style={shared.container}>
            <Header
                colors={COLORS.gradientGreen}
                title="🤝 Add Friend"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={shared.card}>
                        <Text style={shared.cardTitle}>👤 Friend Details</Text>
                        <FormField label="Full Name">
                            <View style={styles.inputWithIcon}>
                                <Text>👤</Text>
                                <TextInput
                                    style={styles.inputInner}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. Rahul Kumar"
                                    placeholderTextColor={COLORS.text3}
                                />
                            </View>
                        </FormField>
                        <FormField label="Phone Number">
                            <View style={styles.inputWithIcon}>
                                <Text>📱</Text>
                                <TextInput
                                    style={styles.inputInner}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="+91 XXXXX XXXXX"
                                    placeholderTextColor={COLORS.text3}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </FormField>
                        <FormField label="Email (optional)">
                            <View style={styles.inputWithIcon}>
                                <Text>✉️</Text>
                                <TextInput
                                    style={styles.inputInner}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="friend@example.com"
                                    placeholderTextColor={COLORS.text3}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </FormField>
                        <FormField label="Nick Name (optional)">
                            <Input
                                value={nick}
                                onChangeText={setNick}
                                placeholder="e.g. Raju, Neha Di..."
                            />
                        </FormField>
                        <FormField label="Avatar Color">
                            <View style={styles.colorRow}>
                                {AVATAR_COLORS.map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        onPress={() => setAvatarColor(c)}
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: c },
                                            avatarColor === c &&
                                                styles.colorDotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        </FormField>
                    </View>

                    <View style={styles.inviteBox}>
                        <Text style={styles.inviteTitle}>
                            📲 Invite to Hisaab
                        </Text>
                        <Text style={styles.inviteSub}>
                            Send your friend an invite link so they can track
                            expenses together.
                        </Text>
                        <View style={styles.inviteActions}>
                            <TouchableOpacity
                                style={[
                                    styles.inviteBtn,
                                    { backgroundColor: "#D1FAE5" },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.inviteBtnText,
                                        { color: "#065F46" },
                                    ]}
                                >
                                    💬 WhatsApp
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.inviteBtn,
                                    { backgroundColor: "#DBEAFE" },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.inviteBtnText,
                                        { color: "#1D4ED8" },
                                    ]}
                                >
                                    📤 Share Link
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <SubmitBtn
                        label="✅ Add Friend"
                        onPress={() => navigation.goBack()}
                    />
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

// ─── AddClientPayScreen ───────────────────────────────────────────────────────
export function AddClientPayScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [label, setLabel] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("22/03/2026");
    const [payMethod, setPayMethod] = useState("upi");
    const [ref, setRef] = useState("");
    const [note, setNote] = useState("");

    return (
        <View style={shared.container}>
            <Header
                colors={COLORS.gradientBlue}
                title="📥 Record Client Payment"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    {/* Project info banner */}
                    <LinearGradient
                        colors={COLORS.gradientBlue}
                        style={styles.projectBanner}
                    >
                        <Text style={styles.projectBannerSub}>
                            Recording payment for
                        </Text>
                        <Text style={styles.projectBannerTitle}>
                            Flatshare Karo (Development)
                        </Text>
                        <View style={styles.projectBannerStats}>
                            <Text style={styles.projectBannerStat}>
                                Total: ₹10,000
                            </Text>
                            <Text
                                style={[
                                    styles.projectBannerStat,
                                    { color: "#A7F3D0" },
                                ]}
                            >
                                Received: ₹7,000
                            </Text>
                            <Text
                                style={[
                                    styles.projectBannerStat,
                                    { color: "#FCA5A5" },
                                ]}
                            >
                                Due: ₹3,000
                            </Text>
                        </View>
                    </LinearGradient>

                    <View style={shared.card}>
                        <FormField label="Payment Label">
                            <Input
                                value={label}
                                onChangeText={setLabel}
                                placeholder="e.g. Final Payment, Milestone 2..."
                            />
                        </FormField>
                        <View style={shared.twoCol}>
                            <View style={{ flex: 1 }}>
                                <FormField label="Amount (₹)">
                                    <Input
                                        value={amount}
                                        onChangeText={setAmount}
                                        placeholder="₹3,000"
                                        keyboardType="numeric"
                                    />
                                </FormField>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormField label="Date Received">
                                    <Input
                                        value={date}
                                        onChangeText={setDate}
                                    />
                                </FormField>
                            </View>
                        </View>
                        <FormField label="Payment Method">
                            <PaymentMethodPicker
                                value={payMethod}
                                onChange={setPayMethod}
                                options={[
                                    {
                                        id: "upi",
                                        icon: "📱",
                                        label: "UPI / PhonePe / GPay",
                                    },
                                    {
                                        id: "bank",
                                        icon: "🏦",
                                        label: "Bank Transfer / NEFT",
                                    },
                                    { id: "cash", icon: "💵", label: "Cash" },
                                    {
                                        id: "cheque",
                                        icon: "🧾",
                                        label: "Cheque",
                                    },
                                ]}
                            />
                        </FormField>
                        <FormField label="Transaction ID / Reference (optional)">
                            <Input
                                value={ref}
                                onChangeText={setRef}
                                placeholder="e.g. UPI Ref: 123456789"
                            />
                        </FormField>
                        <FormField label="Notes">
                            <Input
                                value={note}
                                onChangeText={setNote}
                                placeholder="e.g. Received after follow-up call"
                            />
                        </FormField>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>
                                After this payment
                            </Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>
                                    Total received
                                </Text>
                                <Text style={styles.summaryVal}>
                                    ₹10,000 / ₹10,000
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>
                                    Project status
                                </Text>
                                <Text
                                    style={[
                                        styles.summaryVal,
                                        { color: COLORS.primary },
                                    ]}
                                >
                                    ✅ Fully Paid
                                </Text>
                            </View>
                        </View>
                        <SubmitBtn
                            label="✅ Save Payment Record"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

// ─── AddDevFormScreen ─────────────────────────────────────────────────────────
export function AddDevFormScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const onAdded = route?.params?.onAdded;
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [upi, setUpi] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const ROLE_CHIPS = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack",
        "UI/UX Designer",
        "DevOps Engineer",
        "Mobile Developer",
        "QA Tester",
        "Team Lead",
    ];

    const handleSubmit = async () => {
        setError("");
        if (!name.trim()) {
            setError("Developer name is required.");
            return;
        }
        setLoading(true);
        const res = await createDeveloper({
            name,
            phone,
            upiId: upi,
            role,
            notes,
        });
        setLoading(false);
        if (res.ok) {
            if (onAdded) onAdded();
            navigation.goBack();
        } else setError(res.message);
    };

    return (
        <View style={shared.container}>
            <Header
                colors={COLORS.gradientAmber}
                title="➕ Add Developer / Team"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={shared.card}>
                        <View style={shared.twoCol}>
                            <View style={{ flex: 1 }}>
                                <FormField label="Full Name">
                                    <Input
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="e.g. Zafran"
                                    />
                                </FormField>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormField label="Phone">
                                    <Input
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="+91 XXXXX"
                                        keyboardType="phone-pad"
                                    />
                                </FormField>
                            </View>
                        </View>
                        <FormField label="Role / Skill">
                            <Input
                                value={role}
                                onChangeText={setRole}
                                placeholder="e.g. Frontend, Backend..."
                            />
                            <SuggestionChipRow
                                chips={ROLE_CHIPS}
                                onSelect={setRole}
                                small
                            />
                        </FormField>
                        <FormField label="UPI / Bank ID">
                            <Input
                                value={upi}
                                onChangeText={setUpi}
                                placeholder="UPI ID or bank account"
                            />
                        </FormField>
                        <FormField label="Notes (optional)">
                            <Input
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="e.g. Specializes in React, Node.js"
                            />
                        </FormField>
                        {!!error && (
                            <View
                                style={{
                                    backgroundColor: "#FEF2F2",
                                    borderRadius: 8,
                                    padding: 10,
                                    borderLeftWidth: 3,
                                    borderLeftColor: "#EF4444",
                                    marginBottom: 8,
                                }}
                            >
                                <Text
                                    style={{ color: "#EF4444", fontSize: 13 }}
                                >
                                    ⚠️ {error}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={[
                                shared.submitBtn,
                                loading && { opacity: 0.7 },
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={shared.submitBtnText}>
                                    ✅ Add Developer / Team
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

// ─── AddClientFormScreen ──────────────────────────────────────────────────────
export function AddClientFormScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const onAdded = route?.params?.onAdded;
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [industry, setIndustry] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const INDUSTRY_CHIPS = [
        "Technology",
        "Education",
        "Real Estate",
        "Retail",
        "Finance",
        "Healthcare",
        "Other",
    ];

    const handleSubmit = async () => {
        setError("");
        if (!name.trim()) {
            setError("Client name is required.");
            return;
        }
        setLoading(true);
        const res = await createClient({
            name,
            contactPerson: contact,
            phone,
            email,
            industry,
            notes,
        });
        setLoading(false);
        if (res.ok) {
            if (onAdded) onAdded();
            navigation.goBack();
        } else setError(res.message);
    };

    return (
        <View style={shared.container}>
            <Header
                colors={COLORS.gradientBlue}
                title="➕ Add New Client"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={shared.card}>
                        <FormField label="Company / Client Name">
                            <Input
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Maksoft Technologies"
                            />
                        </FormField>
                        <View style={shared.twoCol}>
                            <View style={{ flex: 1 }}>
                                <FormField label="Contact Person">
                                    <Input
                                        value={contact}
                                        onChangeText={setContact}
                                        placeholder="Name"
                                    />
                                </FormField>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormField label="Phone">
                                    <Input
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="+91 XXXXX"
                                        keyboardType="phone-pad"
                                    />
                                </FormField>
                            </View>
                        </View>
                        <FormField label="Email (optional)">
                            <Input
                                value={email}
                                onChangeText={setEmail}
                                placeholder="client@company.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </FormField>
                        <FormField label="Industry">
                            <Input
                                value={industry}
                                onChangeText={setIndustry}
                                placeholder="e.g. Tech, Education..."
                            />
                            <SuggestionChipRow
                                chips={INDUSTRY_CHIPS}
                                onSelect={setIndustry}
                                small
                            />
                        </FormField>
                        <FormField label="Notes (optional)">
                            <Input
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="e.g. Referred by Rahul"
                            />
                        </FormField>
                        {!!error && (
                            <View
                                style={{
                                    backgroundColor: "#FEF2F2",
                                    borderRadius: 8,
                                    padding: 10,
                                    borderLeftWidth: 3,
                                    borderLeftColor: "#EF4444",
                                    marginBottom: 8,
                                }}
                            >
                                <Text
                                    style={{ color: "#EF4444", fontSize: 13 }}
                                >
                                    ⚠️ {error}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={[
                                shared.submitBtn,
                                loading && { opacity: 0.7 },
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={shared.submitBtnText}>
                                    ✅ Add Client
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
}

// ─── GroupAddExpenseScreen ─────────────────────────────────────────────────────
export function GroupAddExpenseScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState("0");
    const [description, setDescription] = useState("");
    const [paidBy, setPaidBy] = useState("rahul");
    const [splitType, setSplitType] = useState("= Equal");
    const [date, setDate] = useState("22/03/2026");
    const members = [
        { id: "rahul", label: "Rahul (You)" },
        { id: "priya", label: "Priya" },
        { id: "amit", label: "Amit" },
        { id: "neha", label: "Neha" },
    ];

    return (
        <View style={shared.container}>
            <Header
                colors={COLORS.gradientBlue}
                title="➕ Add Group Expense"
                onBack={() => navigation.goBack()}
                insets={insets}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={shared.body}>
                    <View style={styles.amtBlock}>
                        <Text style={styles.amtLbl}>Total Amount</Text>
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
                        <FormField label="Description">
                            <Input
                                value={description}
                                onChangeText={setDescription}
                                placeholder="e.g. Electricity Bill, Groceries..."
                            />
                        </FormField>
                        <FormField label="Paid by">
                            <View style={styles.paidByRow}>
                                {members.map((m) => (
                                    <TouchableOpacity
                                        key={m.id}
                                        onPress={() => setPaidBy(m.id)}
                                        style={[
                                            styles.paidByOpt,
                                            paidBy === m.id &&
                                                styles.paidByOptActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.paidByText,
                                                paidBy === m.id &&
                                                    styles.paidByTextActive,
                                            ]}
                                        >
                                            {m.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </FormField>
                        <FormField label="Split">
                            <SplitToggle
                                value={splitType}
                                onChange={setSplitType}
                            />
                        </FormField>
                        <FormField label="Date">
                            <Input value={date} onChangeText={setDate} />
                        </FormField>
                        <SubmitBtn
                            label="✅ Save Expense"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
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
    body: { padding: 14 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.card,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.card,
    },
    cardTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: COLORS.text,
        marginBottom: 12,
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
    twoCol: { flexDirection: "row", gap: 8 },
    row: { flexDirection: "row", gap: 12, marginBottom: 12 },
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
});

const styles = StyleSheet.create({
    iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, width: 140 },
    iconOpt: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#F3F4F6",
        borderWidth: 2,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    iconOptActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    memberAv: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    memberAvText: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: "#fff",
    },
    memberName: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: COLORS.text,
        flex: 1,
    },
    memberToggle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    memberToggleActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    memberToggleText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.md,
        color: "#fff",
    },
    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.lg,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
    },
    inputInner: {
        flex: 1,
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.md2,
        color: COLORS.text,
    },
    colorRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 4 },
    colorDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorDotActive: { borderColor: "#0f2e24", borderWidth: 3 },
    inviteBox: {
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },
    inviteTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md,
        color: COLORS.primary,
        marginBottom: 6,
    },
    inviteSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
        marginBottom: 10,
    },
    inviteActions: { flexDirection: "row", gap: 8 },
    inviteBtn: { flex: 1, padding: 9, borderRadius: 10, alignItems: "center" },
    inviteBtnText: { fontFamily: FONTS.nunito.bold, fontSize: SIZES.base },
    projectBanner: { borderRadius: 12, padding: 12, marginBottom: 12 },
    projectBannerSub: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 2,
    },
    projectBannerTitle: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.md2,
        color: "#fff",
    },
    projectBannerStats: { flexDirection: "row", gap: 12, marginTop: 8 },
    projectBannerStat: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.8)",
    },
    summaryBox: {
        backgroundColor: COLORS.primaryUltraLight,
        borderRadius: 12,
        padding: 12,
        marginTop: 14,
        marginBottom: 4,
    },
    summaryTitle: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.sm2,
        color: COLORS.primary,
        marginBottom: 6,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    summaryLabel: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    summaryVal: {
        fontFamily: FONTS.nunito.extraBold,
        fontSize: SIZES.base,
        color: COLORS.text,
    },
    amtBlock: {
        backgroundColor: COLORS.text,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        marginBottom: 14,
    },
    amtLbl: {
        fontFamily: FONTS.dmSans.regular,
        fontSize: SIZES.sm2,
        color: "rgba(255,255,255,0.55)",
        marginBottom: 6,
    },
    amtInput: {
        fontFamily: FONTS.nunito.black,
        fontSize: 40,
        color: "#fff",
        letterSpacing: -2,
        textAlign: "center",
        minWidth: 120,
    },
    paidByRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    paidByOpt: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: "#F9FAFB",
    },
    paidByOptActive: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryUltraLight,
    },
    paidByText: {
        fontFamily: FONTS.nunito.bold,
        fontSize: SIZES.base,
        color: COLORS.text2,
    },
    paidByTextActive: { color: COLORS.primary },
});
