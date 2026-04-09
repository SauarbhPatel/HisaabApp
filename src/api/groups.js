import { apiCall } from "./client";
const BASE = "/api/groups";
// ─── Date helpers ─────────────────────────────────────────────────────────────
export function isoToShort(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-IN", { month: "short" });
    return `${day} ${mon} ${d.getFullYear()}`;
}

export function isoToMonthYear(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

// ─── Category icons (matches backend) ────────────────────────────────────────
export const CATEGORY_ICONS = {
    food: "🍕",
    travel: "🚌",
    bills: "⚡",
    entertainment: "🎬",
    shopping: "🛒",
    health: "🏥",
    education: "📚",
    fashion: "👗",
    rent: "🏠",
    medical: "💊",
    gifts: "🎁",
    drinks: "🍺",
    fuel: "⛽",
    recharge: "📱",
    trip: "✈️",
    other: "➕",
};

export const CATEGORY_BG = {
    food: "#faece7",
    travel: "#e6f1fb",
    bills: "#faeeda",
    entertainment: "#fbeaf0",
    shopping: "#e1f5ee",
    health: "#f0fdf4",
    education: "#eef2ff",
    fashion: "#fbeaf0",
    rent: "#EDE9FE",
    medical: "#fdf4ff",
    gifts: "#fef9ee",
    drinks: "#EDE9FE",
    fuel: "#faeeda",
    recharge: "#e6f1fb",
    trip: "#e6eeff",
    other: "#F3F4F6",
};

export const CATEGORIES = Object.keys(CATEGORY_ICONS);

// ─── Balance badge config ─────────────────────────────────────────────────────
export const BADGE_CONFIG = {
    owe: { bg: "#FEE2E2", text: "#991B1B" },
    lent: { bg: "#D1FAE5", text: "#065F46" },
    settled: { bg: "#F3F4F6", text: "#6B7280" },
};

export function getBadgeLabel(balanceType, balance) {
    if (balanceType === "owe")
        return `You owe ₹${Math.abs(balance).toLocaleString("en-IN")}`;
    if (balanceType === "lent")
        return `Owed ₹${balance.toLocaleString("en-IN")}`;
    return "All Settled ✅";
}

// ─── Member avatar helpers ────────────────────────────────────────────────────
const AVATAR_COLORS = [
    "#1a7a5e",
    "#378add",
    "#d4537e",
    "#534ab7",
    "#ba7517",
    "#d85a30",
    "#0891b2",
    "#7c3aed",
];
export function getMemberColor(name = "") {
    let h = 0;
    for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
export function getMemberInitials(name = "") {
    return (
        name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??"
    );
}

// ─── Group type icons ────────────────────────────────────────────────────────
export const TYPE_ICONS = { home: "🏠", trip: "✈️", work: "💼", other: "👥" };

// ══════════════════════════════════════════════════════════════════════════════
//  GROUPS — LIST
// ══════════════════════════════════════════════════════════════════════════════
export async function fetchGroups() {
    return apiCall(BASE, { auth: true });
}

// ══════════════════════════════════════════════════════════════════════════════
//  GROUPS — SINGLE
// ══════════════════════════════════════════════════════════════════════════════
export async function fetchGroup(id) {
    return apiCall(`${BASE}/${id}`, { auth: true });
}

// ══════════════════════════════════════════════════════════════════════════════
//  GROUPS — CREATE
// Body: { name, icon?, type?, members? }
// members: [{ userId? } | { name, phone? }]
// ══════════════════════════════════════════════════════════════════════════════
export async function createGroup({ name, icon, type, members }) {
    return apiCall(`${BASE}`, {
        method: "POST",
        auth: true,
        body: { name, icon, type, members },
    });
}

// ══════════════════════════════════════════════════════════════════════════════
//  GROUPS — UPDATE  (name / icon / type — admin only)
// ══════════════════════════════════════════════════════════════════════════════
export async function updateGroup(id, fields) {
    return apiCall(`${BASE}/${id}`, {
        method: "PATCH",
        body: fields,
        auth: true,
    });
}

// ══════════════════════════════════════════════════════════════════════════════
//  GROUPS — ARCHIVE (soft delete — admin only)
// ══════════════════════════════════════════════════════════════════════════════
export async function deleteGroup(id) {
    return apiCall(`${BASE}/${id}`, { method: "DELETE", auth: true });
}

// ══════════════════════════════════════════════════════════════════════════════
//  MEMBERS — ADD
// Body: { userId? } or { name, phone? }
// ══════════════════════════════════════════════════════════════════════════════
export async function addMember(groupId, { userId, name, phone }) {
    return apiCall(`${BASE}/${groupId}/members`, {
        method: "POST",
        body: { userId, name, phone },
        auth: true,
    });
}

// ══════════════════════════════════════════════════════════════════════════════
//  MEMBERS — REMOVE  (admin only, blocked if unsettled balance)
// ══════════════════════════════════════════════════════════════════════════════
export async function removeMember(groupId, memberId) {
    return apiCall(`${BASE}/${groupId}/members/${memberId}`, {
        method: "DELETE",
        auth: true,
    });
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPENSES — ADD
// Body: { description, amount, paidBy?, date?, category?, splitType?, splits?, note? }
// splitType: 'equal' | 'percent' | 'custom'
// ══════════════════════════════════════════════════════════════════════════════
export async function addGroupExpense(groupId, payload) {
    return apiCall(`${BASE}/${groupId}/expenses`, {
        method: "POST",
        body: payload,
        auth: true,
    });
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPENSES — DELETE (payer or admin, reverses balances)
// ══════════════════════════════════════════════════════════════════════════════
export async function deleteGroupExpense(groupId, expenseId) {
    return apiCall(`${BASE}/${groupId}/expenses/${expenseId}`, {
        method: "DELETE",
        auth: true,
    });
}

// ══════════════════════════════════════════════════════════════════════════════
//  SETTLE — zero out a member's balance
// ══════════════════════════════════════════════════════════════════════════════
export async function settleMember(groupId, memberId) {
    return apiCall(`${BASE}/${groupId}/settle/${memberId}`, {
        method: "POST",
        auth: true,
    });
}
