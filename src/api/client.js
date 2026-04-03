import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, REQUEST_TIMEOUT } from "./config";

// ─── Storage keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
    ACCESS_TOKEN: "hisaab_access_token",
    REFRESH_TOKEN: "hisaab_refresh_token",
    USER: "hisaab_user",
    USER_ID: "hisaab_user_id",
};

// ─── Save tokens after login / signup ────────────────────────────────────────
export async function saveSession(data) {
    const { accessToken, refreshToken, user } = data;
    const ops = [];
    if (accessToken)
        ops.push(AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken));
    if (refreshToken)
        ops.push(
            AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        );
    if (user)
        ops.push(AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)));
    if (user?.id) ops.push(AsyncStorage.setItem(STORAGE_KEYS.USER_ID, user.id));
    await Promise.all(ops);
}

// ─── Clear session on logout ──────────────────────────────────────────────────
export async function clearSession() {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}

// ─── Load persisted session ───────────────────────────────────────────────────
export async function loadSession() {
    const [token, refresh, userStr, userId] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.USER_ID),
    ]);
    return {
        accessToken: token,
        refreshToken: refresh,
        user: userStr ? JSON.parse(userStr) : null,
        userId,
    };
}

// ─── Save userId mid-signup (before tokens exist) ─────────────────────────────
export async function savePendingUserId(userId) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
}

export async function getPendingUserId() {
    return AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
}

// ─── Core fetch with timeout ──────────────────────────────────────────────────
async function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        return response;
    } finally {
        clearTimeout(timer);
    }
}

// ─── Main API caller ──────────────────────────────────────────────────────────
// Returns: { ok: true, data: {...} } | { ok: false, message: string, code: string }
export async function apiCall(
    endpoint,
    {
        method = "GET",
        body = null,
        auth = false, // attach Bearer token?
        rawResponse = false, // return raw json without unwrapping?
    } = {},
) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetchWithTimeout(url, options);
        const json = await response.json();

        if (rawResponse) return json;

        // Backend always returns { response: { response_code, response_message }, data }
        const code = json?.response?.response_code;
        const message =
            json?.response?.response_message || "Something went wrong.";
        const data = json?.data;

        if (code === "200" || code === "201") {
            return { ok: true, data, message };
        }

        // Error codes from backend
        return { ok: false, message, code };
    } catch (err) {
        if (err.name === "AbortError") {
            return {
                ok: false,
                message: "Request timed out. Please check your connection.",
                code: "TIMEOUT",
            };
        }
        if (
            err.message?.includes("Network request failed") ||
            err.message?.includes("fetch")
        ) {
            return {
                ok: false,
                message:
                    "Cannot connect to server. Make sure the backend is running on localhost:5000.",
                code: "NETWORK",
            };
        }
        return {
            ok: false,
            message: err.message || "Unexpected error.",
            code: "UNKNOWN",
        };
    }
}
