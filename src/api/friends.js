import { apiCall } from "./client";

const BASE = "/api/friends";

// ─── Avatar color pool ────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    "#1a7a5e",
    "#378add",
    "#d4537e",
    "#534ab7",
    "#ba7517",
    "#d85a30",
    "#2563eb",
    "#7c3aed",
];
export function getFriendColor(name = "") {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
export function getFriendInitials(name = "") {
    return (
        name
            .split(" ")
            .filter(Boolean)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "FR"
    );
}

// ─── Balance helpers ──────────────────────────────────────────────────────────
// balance > 0  → friend owes you
// balance < 0  → you owe friend
// balance = 0  → settled
export function getBalanceConfig(balance) {
    if (balance > 0)
        return {
            color: "#1a7a5e",
            prefix: "+",
            label: "Owes you",
            isPositive: true,
        };
    if (balance < 0)
        return {
            color: "#EF4444",
            prefix: "−",
            label: "You owe",
            isPositive: false,
        };
    return { color: "#6B7280", prefix: "", label: "Settled", isPositive: null };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/friends?filter=all|owe|owed|settled&search=
//  Returns: { count, stats: { owedToYou, youOwe, friendCount }, friends }
//  Each friend: { _id, name, phone, email, initials, avatarColor, balance,
//                 transactionCount, lastActivity }
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchFriends({ filter, search } = {}) {
    const p = new URLSearchParams();
    if (filter && filter !== "All") p.append("filter", filter.toLowerCase());
    if (search?.trim()) p.append("search", search.trim());
    const q = p.toString() ? `?${p}` : "";
    return apiCall(`${BASE}${q}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/friends/:id
//  Returns: { friend, transactions, stats }
//  transactions: [{ _id, type:'gave'|'received', label, date, method, amount, note }]
// ═══════════════════════════════════════════════════════════════════════════════
export async function fetchFriend(id) {
    return apiCall(`${BASE}/${id}`, { auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/friends
//  Body: { name, phone?, email?, nickName?, avatarColor? }
//  Returns: { friend }
// ═══════════════════════════════════════════════════════════════════════════════
export async function addFriend({ name, phone, email, nickName, avatarColor }) {
    return apiCall(BASE, {
        method: "POST",
        auth: true,
        body: {
            friendName: name.trim(),
            friendPhone: phone?.trim() || undefined,
            friendEmail: email?.trim() || undefined,
            nickName: nickName?.trim() || undefined,
            avatarColor: avatarColor || getFriendColor(name),
        },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/friends/:id
//  Body: any subset of { name, phone, email, nickName, avatarColor }
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateFriend(id, fields) {
    return apiCall(`${BASE}/${id}`, {
        method: "PATCH",
        auth: true,
        body: fields,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/friends/:id
// ═══════════════════════════════════════════════════════════════════════════════
export async function removeFriend(id) {
    return apiCall(`${BASE}/${id}`, { method: "DELETE", auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/friends/:id/transactions   (record gave / received)
//  Body: { type:'gave'|'received', label, amount, date, method, note? }
//  Returns: { transaction, friend }   (friend has updated balance)
// ═══════════════════════════════════════════════════════════════════════════════
export async function addTransaction(
    friendId,
    { direction, label, amount, date, method, note },
) {
    return apiCall(`${BASE}/${friendId}/transactions`, {
        method: "POST",
        auth: true,
        body: {
            direction,
            amount: Number(amount),
            date: date || new Date().toISOString(),
            method: method || "cash",
            note: label?.trim() || undefined,
        },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/friends/:id/settle   (mark all as settled / record settlement)
//  Body: { amount, method, note? }
//  Returns: { friend }
// ═══════════════════════════════════════════════════════════════════════════════
export async function settleFriend(friendId, { amount, method, note }) {
    return apiCall(`${BASE}/${friendId}/settle`, {
        method: "POST",
        auth: true,
        body: {
            amount: Number(amount),
            method: method || "upi",
            note: note?.trim() || undefined,
        },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/friends/:friendId/transactions/:txId
// ═══════════════════════════════════════════════════════════════════════════════
export async function deleteTransaction(friendId, txId) {
    return apiCall(`${BASE}/${friendId}/transactions/${txId}`, {
        method: "DELETE",
        auth: true,
    });
}
