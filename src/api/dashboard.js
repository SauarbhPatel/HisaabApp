import { apiCall } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
//  HOME DASHBOARD  —  GET /api/dashboard/summary
//
//  Returns a single object covering all use-cases:
//  {
//    useCase,           // 'split' | 'freelance' | 'both'
//    personal: {
//      totalSpent,      // current month total expenses
//      monthLabel,      // "March 2026"
//      vsLastMonth,     // percentage change vs previous month
//    },
//    friends: {
//      owedToYou,       // total owed to user
//      youOwe,          // total user owes
//      pendingCount,    // number of unsettled friends
//    },
//    groups: {
//      activeCount,
//      totalExpenses,
//    },
//    projects: {
//      totalReceived,   // income this month
//      totalPending,    // client payments due
//      activeCount,
//      devPaymentsDue,  // total due to developers
//    },
//    recentActivity: [  // last 8-10 transactions/events across all sections
//      { id, icon, iconBg, title, subtitle, amount, type: 'income'|'expense'|'project'|'friend', navigate }
//    ],
//    urgentAlerts: [    // items needing immediate attention
//      { id, message, type: 'client'|'dev'|'friend', navigate }
//    ]
//  }
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchDashboard() {
    return apiCall("/api/dashboard", { auth: true });
}

// ─────────────────────────────────────────────────────────────────────────────
//  REPORTS  —  GET /api/reports/summary?period=month|quarter|year&date=YYYY-MM
//
//  Returns:
//  {
//    period,            // 'month' | 'quarter' | 'year'
//    label,             // "March 2026" / "Q1 2026" / "2026"
//    expenses: {
//      total,
//      byCategory: [{ id, label, icon, total, count, percent }],
//      monthlyTrend: [{ month, label, total }],  // last 6 months
//    },
//    projects: {
//      totalIncome,
//      totalDevPaid,
//      netProfit,
//      byClient: [{ clientId, name, received, pending }],
//    },
//    friends: {
//      owedToYou,
//      youOwe,
//      netBalance,
//    }
//  }
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchReportSummary({ period = "month", date } = {}) {
    const p = new URLSearchParams();
    p.append("period", period);
    if (date) p.append("date", date);
    return apiCall(`/api/reports/summary?${p}`, { auth: true });
}

// ─────────────────────────────────────────────────────────────────────────────
//  REPORTS  —  GET /api/reports/expenses?months=6
//  Monthly expense breakdown for bar/line chart
//  Returns: { months: [{ key, label, total, byCategory }] }
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchExpenseReport({ months = 6 } = {}) {
    return apiCall(`/api/reports/expenses?months=${months}`, { auth: true });
}

// ─────────────────────────────────────────────────────────────────────────────
//  REPORTS  —  GET /api/reports/projects?year=2026
//  Project income / profit breakdown for a year
//  Returns: { year, totalIncome, totalDevPaid, netProfit, byMonth, byClient }
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchProjectReport({ year } = {}) {
    const y = year || new Date().getFullYear();
    return apiCall(`/api/reports/projects?year=${y}`, { auth: true });
}

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers for period labels
// ─────────────────────────────────────────────────────────────────────────────
export function toMonthKey(date = new Date()) {
    const d = typeof date === "string" ? new Date(date) : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthKeyToLabel(key) {
    if (!key) return "";
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

export function getLastNMonthKeys(n = 6) {
    const keys = [];
    const now = new Date();
    for (let i = 0; i < n; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        keys.push(toMonthKey(d));
    }
    return keys;
}

export const PERIOD_OPTIONS = [
    { id: "month", label: "This Month" },
    { id: "quarter", label: "Last 3 Months" },
    { id: "year", label: "This Year" },
];
