import { apiCall } from "./client";

const BASE = "/api/developers";

// ─── Helper: generate initials + avatar color from name ───────────────────────
export function getDevInitials(name = "") {
    return (
        name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "DV"
    );
}

const AVATAR_COLORS = [
    "#ba7517",
    "#378add",
    "#d4537e",
    "#534ab7",
    "#1a7a5e",
    "#d85a30",
];
export function getDevColor(name = "") {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Status badge config ──────────────────────────────────────────────────────
export function getDevStatusConfig(dev) {
    if (dev.status === "inactive")
        return { bg: "#F3F4F6", text: "#6B7280", label: "⏸ Inactive" };
    if ((dev.totalPending || 0) === 0)
        return { bg: "#D1FAE5", text: "#065F46", label: "Paid ✅" };
    if ((dev.totalPaid || 0) === 0)
        return { bg: "#FEE2E2", text: "#991B1B", label: "Unpaid" };
    const k = ((dev.totalPending || 0) / 1000).toFixed(0);
    return { bg: "#FEF3C7", text: "#92400E", label: `Pending ₹${k}k` };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/developers?role=&status=&search=
//  Returns: { count, stats: { totalPaid, totalPending }, developers }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchDevelopers({ role, status, search } = {}) {
    const p = new URLSearchParams();
    if (role) p.append("role", role);
    if (status) p.append("status", status);
    if (search) p.append("search", search);
    const q = p.toString() ? `?${p}` : "";
    return apiCall(`${BASE}${q}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/developers/:id
//  Returns: { developer, projects }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchDeveloper(id) {
    return apiCall(`${BASE}/${id}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/developers/:id/payment-history
//  Returns: { developer, stats, history }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchDevPaymentHistory(id) {
    return apiCall(`${BASE}/${id}/payment-history`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/developers
//  Body: { name, phone?, email?, upiId?, role?, notes? }
//  Returns: { developer }
// ═══════════════════════════════════════════════════════════════════════════════
export async function createDeveloper({
    name,
    phone,
    email,
    upiId,
    role,
    notes,
}) {
    return apiCall(BASE, {
        method: "POST",
        auth: true,
        body: {
            name: name.trim(),
            phone: phone?.trim() || undefined,
            email: email?.trim() || undefined,
            upiId: upiId?.trim() || undefined,
            role: role?.trim() || undefined,
            notes: notes?.trim() || undefined,
        },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/developers/:id
//  Body: any subset of { name, phone, email, upiId, role, notes, status }
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateDeveloper(id, fields) {
    return apiCall(`${BASE}/${id}`, {
        method: "PATCH",
        auth: true,
        body: fields,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/developers/:id
//  Blocked if dev is active on an in-progress project
// ═══════════════════════════════════════════════════════════════════════════════
export async function deleteDeveloper(id) {
    return apiCall(`${BASE}/${id}`, { method: "DELETE", auth: true });
}
