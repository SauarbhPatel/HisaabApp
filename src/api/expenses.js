import { apiCall } from "./client";
import { EXPENSE_ENDPOINTS } from "./config";

// ─── Category metadata — mirrors backend exactly ──────────────────────────────
// Backend valid values: food, travel, bills, entertainment, shopping, health,
// education, fashion, rent, medical, gifts, drinks, fuel, recharge, trip, other
export const CATEGORY_META = {
    food: { icon: "🍕", label: "Food & Drinks", iconBg: "#faece7" },
    travel: { icon: "🚌", label: "Travel", iconBg: "#e6f1fb" },
    bills: { icon: "⚡", label: "Bills & Utilities", iconBg: "#faeeda" },
    entertainment: {
        icon: "🎬",
        label: "Fun & Entertainment",
        iconBg: "#fbeaf0",
    },
    shopping: { icon: "🛒", label: "Shopping", iconBg: "#e1f5ee" },
    health: { icon: "🏥", label: "Health & Medical", iconBg: "#f0fdf4" },
    education: { icon: "📚", label: "Education", iconBg: "#ede9fe" },
    fashion: { icon: "👗", label: "Fashion & Clothing", iconBg: "#fbeaf0" },
    rent: { icon: "🏠", label: "Rent", iconBg: "#e6f1fb" },
    medical: { icon: "💊", label: "Medical", iconBg: "#fee2e2" },
    gifts: { icon: "🎁", label: "Gifts", iconBg: "#fef3c7" },
    drinks: { icon: "🍺", label: "Drinks", iconBg: "#faeeda" },
    fuel: { icon: "⛽", label: "Fuel", iconBg: "#faeeda" },
    recharge: { icon: "📱", label: "Recharge", iconBg: "#e6f1fb" },
    trip: { icon: "✈️", label: "Trip", iconBg: "#ede9fe" },
    other: { icon: "➕", label: "Other", iconBg: "#f3f4f6" },
};

export const CATEGORIES = Object.entries(CATEGORY_META).map(([id, meta]) => ({
    id,
    ...meta,
}));

// ─── Payment method display ───────────────────────────────────────────────────
export const METHOD_META = {
    upi: { icon: "📱", label: "UPI" },
    cash: { icon: "💵", label: "Cash" },
    card: { icon: "💳", label: "Card" },
    bank: { icon: "🏦", label: "Bank" },
    other: { icon: "💰", label: "Other" },
};

// ─── Format YYYY-MM from a Date or string ─────────────────────────────────────
export function toMonthKey(date = new Date()) {
    const d = typeof date === "string" ? new Date(date) : date;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
}

// ─── Format monthKey → display label ─────────────────────────────────────────
export function monthKeyToLabel(key) {
    const [y, m] = key.split("-");
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `${months[parseInt(m) - 1]} ${y}`;
}

// ─── Generate last N month keys ───────────────────────────────────────────────
export function getLastNMonthKeys(n = 6) {
    const keys = [];
    const now = new Date();
    for (let i = 0; i < n; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        keys.push(toMonthKey(d));
    }
    return keys;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/expenses?month=YYYY-MM
//  Returns: { monthKey, totalAmount, count, byCategory, expenses }
//  byCategory has ALL 16 categories, with 0 if no entries
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchExpenses({ month, category, splitType } = {}) {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (category) params.append("category", category);
    if (splitType) params.append("splitType", splitType);

    const query = params.toString() ? `?${params}` : "";
    return apiCall(`${EXPENSE_ENDPOINTS.LIST}${query}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/expenses/category/:category?month=YYYY-MM
//  Returns: { category, icon, label, monthKey, total, count, expenses }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchExpensesByCategory({ category, month } = {}) {
    const query = month ? `?month=${month}` : "";
    return apiCall(`${EXPENSE_ENDPOINTS.BY_CATEGORY(category)}${query}`, {
        auth: true,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/expenses/:id
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchExpenseById(id) {
    return apiCall(EXPENSE_ENDPOINTS.BY_ID(id), { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/expenses
//  Body: { amount, category, description, date, paidVia, splitType, note }
//  Returns: { expense }
// ═══════════════════════════════════════════════════════════════════════════════
export async function createExpense({
    amount,
    category,
    description,
    date,
    paidVia,
    splitType,
    note,
}) {
    return apiCall(EXPENSE_ENDPOINTS.LIST, {
        method: "POST",
        auth: true,
        body: {
            amount: Number(amount),
            category: category || "other",
            description: description?.trim() || undefined,
            date: date || new Date().toISOString(),
            paidVia: paidVia || "cash",
            splitType: splitType || "solo",
            note: note?.trim() || undefined,
        },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/expenses/:id
//  Body: any subset of { amount, category, description, date, paidVia, splitType, note }
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateExpense(id, fields) {
    return apiCall(EXPENSE_ENDPOINTS.BY_ID(id), {
        method: "PATCH",
        auth: true,
        body: fields,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/expenses/:id
// ═══════════════════════════════════════════════════════════════════════════════
export async function deleteExpense(id) {
    return apiCall(EXPENSE_ENDPOINTS.BY_ID(id), {
        method: "DELETE",
        auth: true,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/expenses/report/monthly?months=N
//  Returns: { months, monthKeys, report }
//  report[YYYY-MM] = { total, count, byCategory }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchMonthlyReport({ months = 6 } = {}) {
    return apiCall(`${EXPENSE_ENDPOINTS.MONTHLY_REPORT}?months=${months}`, {
        auth: true,
    });
}
