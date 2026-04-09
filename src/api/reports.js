import { apiCall } from "./client";

// ─── Period → API param ───────────────────────────────────────────────────────
// UI labels → backend `period` param: month | 3months | year
// Custom: send startDate + endDate as query params instead
export const PERIOD_MAP = {
    "This Month": "month",
    "Last 3 Months": "3months",
    "This Year": "year",
};

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function formatDateInput(raw) {
    const d = raw.replace(/\D/g, "").slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return d.slice(0, 2) + "/" + d.slice(2);
    return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
}

// DD/MM/YYYY → YYYY-MM-DD
export function displayToISO(display) {
    if (!display || display.length < 10) return "";
    const [dd, mm, yyyy] = display.split("/");
    if (!dd || !mm || !yyyy || yyyy.length < 4) return "";
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

// Validate DD/MM/YYYY
export function isValidDate(display) {
    if (!display || display.length < 10) return false;
    const [dd, mm, yyyy] = display.split("/");
    if (!dd || !mm || !yyyy || yyyy.length < 4) return false;
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    return !isNaN(d.getTime());
}

// YYYY-MM-DD → DD Mon YYYY
export function isoToReadable(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/reports/summary?period=month|3months|year
// Returns: split block (spending + friends) and/or freelance block (income)
// ──────────────────────────────────────────────────────────────────────────────
export async function fetchReportSummary(period = "month") {
    return apiCall(`/api/reports/summary?period=${period}`, { auth: true });
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/reports/spending?period=...
// Returns: totalSpent, byCategory (all 16), topCategories (top 4), byMonth
// ──────────────────────────────────────────────────────────────────────────────
export async function fetchSpendingReport(period = "month") {
    return apiCall(`/api/reports/spending?period=${period}`, { auth: true });
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/reports/income?period=...
// Returns: totalIncome, totalDevPaid, netProfit, incomeByClient, projectIncomeList
// ──────────────────────────────────────────────────────────────────────────────
export async function fetchIncomeReport(period = "month") {
    return apiCall(`/api/reports/income?period=${period}`, { auth: true });
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/reports/friends
// Returns: owedToYou, youOwe, netBalance, friendCount, settledCount, topOwed
// ──────────────────────────────────────────────────────────────────────────────
export async function fetchFriendsReport() {
    return apiCall("/api/reports/friends", { auth: true });
}

const COLORS_CAT = [
    "#1a7a5e",
    "#6C3EF4",
    "#F59E0B",
    "#EF4444",
    "#3B82F6",
    "#10B981",
    "#F97316",
    "#8B5CF6",
];

// ─── Category display config (matches backend CATEGORY_META) ──────────────────
export const CATEGORY_META = {
    food: { icon: "🍕", label: "Food & Drinks", color: COLORS_CAT[0] },
    travel: { icon: "🚌", label: "Travel", color: COLORS_CAT[1] },
    bills: { icon: "⚡", label: "Bills & Utilities", color: COLORS_CAT[2] },
    entertainment: { icon: "🎬", label: "Entertainment", color: COLORS_CAT[3] },
    shopping: { icon: "🛒", label: "Shopping", color: COLORS_CAT[4] },
    health: { icon: "🏥", label: "Health & Medical", color: COLORS_CAT[5] },
    education: { icon: "📚", label: "Education", color: COLORS_CAT[6] },
    fashion: { icon: "👗", label: "Fashion & Clothing", color: COLORS_CAT[7] },
    rent: { icon: "🏠", label: "Rent", color: COLORS_CAT[0] },
    medical: { icon: "💊", label: "Medical", color: COLORS_CAT[1] },
    gifts: { icon: "🎁", label: "Gifts", color: COLORS_CAT[2] },
    drinks: { icon: "🍺", label: "Drinks", color: COLORS_CAT[3] },
    fuel: { icon: "⛽", label: "Fuel", color: COLORS_CAT[4] },
    recharge: { icon: "📱", label: "Recharge", color: COLORS_CAT[5] },
    trip: { icon: "✈️", label: "Trip", color: COLORS_CAT[6] },
    other: { icon: "➕", label: "Other", color: COLORS_CAT[7] },
};
