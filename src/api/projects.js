import { apiCall } from "./client";

const BASE = "/api/projects";

// ─── Status display config ────────────────────────────────────────────────────
export const STATUS_CONFIG = {
    inprogress: { label: "🔵 Active", bg: "#DBEAFE", text: "#1D4ED8" },
    completed: { label: "✅ Completed", bg: "#D1FAE5", text: "#065F46" },
    onstay: { label: "⏳ On Stay", bg: "#FEF3C7", text: "#92400E" },
    inactive: { label: "⏸ Inactive", bg: "#F3F4F6", text: "#6B7280" },
    cancelled: { label: "❌ Cancelled", bg: "#FEE2E2", text: "#991B1B" },
};

// ─── Progress color by percentage ────────────────────────────────────────────
export function progressColor(pct) {
    if (pct >= 100) return "#1a7a5e";
    if (pct >= 50) return "#F59E0B";
    return "#EF4444";
}

// ─── Dev slot status config ───────────────────────────────────────────────────
export const DEV_SLOT_STATUS = {
    active: { label: "● Active", color: "#1a7a5e" },
    paused: { label: "⏸ Paused", color: "#F59E0B" },
    removed: { label: "🗑 Removed", color: "#EF4444" },
};

// ─── Valid project types (backend enum) ───────────────────────────────────────
export const PROJECT_TYPES = [
    "Development",
    "UI/UX Design",
    "Deployment",
    "Maintenance",
    "Mobile App",
    "Web App",
    "API Integration",
    "Other",
];

// ─── Format date DD/MM/YYYY → ISO ─────────────────────────────────────────────
export function displayToISO(str) {
    if (!str) return undefined;
    if (str.includes("-")) return new Date(str).toISOString(); // already ISO
    const [dd, mm, yyyy] = str.split("/");
    if (!dd || !mm || !yyyy) return undefined;
    return new Date(
        `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`,
    ).toISOString();
}

// ─── Format ISO → DD/MM/YYYY ──────────────────────────────────────────────────
export function isoToDisplay(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// ─── Format ISO → short "02/01/2026" ─────────────────────────────────────────
export function isoToShort(iso) {
    if (!iso) return "—";
    return isoToDisplay(iso);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/projects?year=&status=&client=&search=
//  Returns: { count, stats, grouped, projects }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchProjects({ year, status, client, search } = {}) {
    const p = new URLSearchParams();
    if (year) p.append("year", year);
    if (status) p.append("status", status);
    if (client) p.append("client", client);
    if (search) p.append("search", search);
    const q = p.toString() ? `?${p}` : "";
    return apiCall(`${BASE}${q}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/projects/summary?year=
//  Returns: { year, summary: { totalBilled, totalReceived, totalPending, netProfit, byStatus, byClient } }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchProjectSummary(year) {
    const q = year ? `?year=${year}` : "";
    return apiCall(`${BASE}/summary${q}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/projects/:id
//  Returns: { project } — with populated developers
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchProject(id) {
    return apiCall(`${BASE}/${id}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/projects
//  Body: { name, type?, client, startDate, endDate?, totalPrice, notes?, tags?, developers? }
// ═══════════════════════════════════════════════════════════════════════════════
export async function createProject({
    name,
    type,
    client,
    startDate,
    endDate,
    totalPrice,
    notes,
    developers,
}) {
    return apiCall(BASE, {
        method: "POST",
        auth: true,
        body: {
            name: name.trim(),
            type: type || "Development",
            client: client.trim(),
            startDate: displayToISO(startDate),
            endDate: endDate ? displayToISO(endDate) : undefined,
            totalPrice: Number(totalPrice),
            notes: notes?.trim() || undefined,
            developers: developers?.length ? developers : undefined,
        },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/projects/:id
//  Body: any subset of { name, type, client, startDate, endDate, totalPrice, notes }
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateProject(id, fields) {
    // Convert display dates to ISO if present
    const body = { ...fields };
    if (body.startDate) body.startDate = displayToISO(body.startDate);
    if (body.endDate) body.endDate = displayToISO(body.endDate);
    if (body.totalPrice) body.totalPrice = Number(body.totalPrice);
    return apiCall(`${BASE}/${id}`, { method: "PATCH", auth: true, body });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/projects/:id/status
//  Body: { status }
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateProjectStatus(id, status) {
    return apiCall(`${BASE}/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/projects/:id  (soft delete — archive)
// ═══════════════════════════════════════════════════════════════════════════════
export async function deleteProject(id) {
    return apiCall(`${BASE}/${id}`, { method: "DELETE", auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CLIENT PAYMENTS
// ═══════════════════════════════════════════════════════════════════════════════
export async function addClientPayment(
    projectId,
    { label, amount, date, method, reference, note, status },
) {
    return apiCall(`${BASE}/${projectId}/client-payments`, {
        method: "POST",
        auth: true,
        body: {
            label,
            amount: Number(amount),
            date: displayToISO(date) || new Date().toISOString(),
            method: method || "upi",
            reference: reference?.trim() || undefined,
            note: note?.trim() || undefined,
            status: status || "paid",
        },
    });
}

export async function updateClientPayment(projectId, paymentId, fields) {
    return apiCall(`${BASE}/${projectId}/client-payments/${paymentId}`, {
        method: "PATCH",
        auth: true,
        body: fields,
    });
}

export async function deleteClientPayment(projectId, paymentId) {
    return apiCall(`${BASE}/${projectId}/client-payments/${paymentId}`, {
        method: "DELETE",
        auth: true,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DEVELOPER SLOTS
// ═══════════════════════════════════════════════════════════════════════════════
export async function addDevToProject(
    projectId,
    { developer, role, agreedAmount },
) {
    return apiCall(`${BASE}/${projectId}/developers`, {
        method: "POST",
        auth: true,
        body: {
            developer,
            role: role?.trim() || undefined,
            agreedAmount: Number(agreedAmount),
        },
    });
}

export async function updateDevSlotStatus(projectId, devSlotId, status) {
    return apiCall(`${BASE}/${projectId}/developers/${devSlotId}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
    });
}

export async function payDeveloperOnProject(
    projectId,
    devSlotId,
    { amount, date, method, note },
) {
    return apiCall(`${BASE}/${projectId}/developers/${devSlotId}/pay`, {
        method: "POST",
        auth: true,
        body: {
            amount: Number(amount),
            date: date ? displayToISO(date) : new Date().toISOString(),
            method: method || "upi",
            note: note?.trim() || undefined,
        },
    });
}

export async function fetchDevPaymentHistoryOnProject(projectId, devSlotId) {
    return apiCall(
        `${BASE}/${projectId}/developers/${devSlotId}/payment-history`,
        { auth: true },
    );
}
