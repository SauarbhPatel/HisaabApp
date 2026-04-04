import { apiCall } from "./client";

const BASE = "/api/clients";

// ─── Status badge config ──────────────────────────────────────────────────────
export function getClientStatusConfig(client) {
    const pending =
        client.totalPending ??
        Math.max(0, (client.totalBilled || 0) - (client.totalReceived || 0));
    if (pending === 0)
        return { bg: "#D1FAE5", text: "#065F46", label: "Active" };
    if (pending > 5000)
        return {
            bg: "#FEE2E2",
            text: "#991B1B",
            label: `Due ₹${(pending / 1000).toFixed(0)}k`,
        };
    return {
        bg: "#FEF3C7",
        text: "#92400E",
        label: `Pending ₹${(pending / 1000).toFixed(0)}k`,
    };
}

// ─── Payment status config (for project rows) ─────────────────────────────────
export const PAY_STATUS_CONFIG = {
    completed: { bg: "#D1FAE5", text: "#065F46", label: "Paid ✅" },
    inprogress: { bg: "#FEF3C7", text: "#92400E", label: "⏳ Partial" },
    onstay: { bg: "#FEE2E2", text: "#991B1B", label: "⚠️ Due" },
    inactive: { bg: "#F3F4F6", text: "#6B7280", label: "Inactive" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
};

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/clients?status=&industry=&search=
//  Returns: { count, stats: { totalBilled, totalReceived, totalPending }, clients }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchClients({ status, industry, search } = {}) {
    const p = new URLSearchParams();
    if (status) p.append("status", status);
    if (industry) p.append("industry", industry);
    if (search) p.append("search", search);
    const q = p.toString() ? `?${p}` : "";
    return apiCall(`${BASE}${q}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/clients/:id
//  Returns: { client, projects }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchClient(id) {
    return apiCall(`${BASE}/${id}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/clients/:id/payment-history
//  Returns: { client, stats, history }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchClientPaymentHistory(id) {
    return apiCall(`${BASE}/${id}/payment-history`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/clients
//  Body: { name, contactPerson?, phone?, email?, industry?, notes?, icon?, avatarColor? }
//  Returns: { client }
// ═══════════════════════════════════════════════════════════════════════════════
export async function createClient({
    name,
    contactPerson,
    phone,
    email,
    industry,
    notes,
    icon,
    avatarColor,
}) {
    return apiCall(BASE, {
        method: "POST",
        auth: true,
        body: {
            name: name.trim(),
            contactPerson: contactPerson?.trim() || undefined,
            phone: phone?.trim() || undefined,
            email: email?.trim() || undefined,
            industry: industry || "Other",
            notes: notes?.trim() || undefined,
            icon: icon || "🏢",
            avatarColor: avatarColor || "#E5E7EB",
        },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/clients/:id
//  Body: any subset of { name, contactPerson, phone, email, industry, notes, icon, avatarColor }
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateClient(id, fields) {
    return apiCall(`${BASE}/${id}`, {
        method: "PATCH",
        auth: true,
        body: fields,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/clients/:id/status
//  Body: { status: 'active' | 'inactive' }
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateClientStatus(id, status) {
    return apiCall(`${BASE}/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/clients/:id
//  Blocked if client has active/onstay projects
// ═══════════════════════════════════════════════════════════════════════════════
export async function deleteClient(id) {
    return apiCall(`${BASE}/${id}`, { method: "DELETE", auth: true });
}
