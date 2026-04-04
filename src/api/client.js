import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, REQUEST_TIMEOUT_MS } from "./config";

// ─── AsyncStorage keys ────────────────────────────────────────────────────────
export const STORAGE = {
    ACCESS_TOKEN: "@hisaab/access_token",
    REFRESH_TOKEN: "@hisaab/refresh_token",
    USER: "@hisaab/user",
    PENDING_UID: "@hisaab/pending_uid", // userId mid-signup
};

// ─── Persist session after successful login / signup complete ─────────────────
export async function saveSession({ accessToken, refreshToken, user }) {
    const writes = [];
    if (accessToken) writes.push([STORAGE.ACCESS_TOKEN, accessToken]);
    if (refreshToken) writes.push([STORAGE.REFRESH_TOKEN, refreshToken]);
    if (user) writes.push([STORAGE.USER, JSON.stringify(user)]);
    if (writes.length) await AsyncStorage.multiSet(writes);
}

// ─── Clear everything on logout / account delete ──────────────────────────────
export async function clearSession() {
    await AsyncStorage.multiRemove(Object.values(STORAGE));
}

// ─── Restore session on app launch ───────────────────────────────────────────
export async function loadSession() {
    const [[, token], [, refresh], [, userStr]] = await AsyncStorage.multiGet([
        STORAGE.ACCESS_TOKEN,
        STORAGE.REFRESH_TOKEN,
        STORAGE.USER,
    ]);
    return {
        accessToken: token || null,
        refreshToken: refresh || null,
        user: userStr ? JSON.parse(userStr) : null,
    };
}

// ─── Pending userId helpers (mid-signup, before tokens exist) ─────────────────
export async function savePendingUid(uid) {
    if (uid) await AsyncStorage.setItem(STORAGE.PENDING_UID, uid);
}
export async function getPendingUid() {
    return AsyncStorage.getItem(STORAGE.PENDING_UID);
}
export async function clearPendingUid() {
    await AsyncStorage.removeItem(STORAGE.PENDING_UID);
}

// ─── Core API call ────────────────────────────────────────────────────────────
//
// Returns one of:
//   { ok: true,  data, message }
//   { ok: false, message, code,
//     incompleteSignup?: true, userId?: string, nextStep?: string }
//
export async function apiCall(
    endpoint,
    {
        method = "GET",
        body = null,
        auth = false, // attach Bearer accessToken?
    } = {},
) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = await AsyncStorage.getItem(STORAGE.ACCESS_TOKEN);
        console.log(`Bearer ${token}`);
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    // Timeout via AbortController
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        const json = await response.json();

        const code = json?.response?.response_code;
        const message =
            json?.response?.response_message || "Something went wrong.";
        const data = json?.data ?? null;

        // ── Success ───────────────────────────────────────────────────────────────
        if (code === "200" || code === "201") {
            return { ok: true, data, message };
        }

        // ── Incomplete signup (code 403 with incompleteSignup flag in data) ────────
        // Backend returns this from loginWithPassword and loginOTPVerify when the
        // user started signup but never finished all steps.
        if (code === "403" && data?.incompleteSignup) {
            return {
                ok: false,
                message: data.message || message,
                code: "403",
                incompleteSignup: true,
                userId: data.userId,
                nextStep: data.nextStep, // 'verify-otp' | 'set-password' | 'complete-profile'
            };
        }

        // ── Other API errors ──────────────────────────────────────────────────────
        return { ok: false, message, code: code || String(response.status) };
    } catch (err) {
        if (err.name === "AbortError") {
            return {
                ok: false,
                message:
                    "Request timed out. The server may be waking up — try again in a moment.",
                code: "TIMEOUT",
            };
        }
        // Network unreachable
        return {
            ok: false,
            message: "Cannot reach the server. Check your internet connection.",
            code: "NETWORK",
        };
    } finally {
        clearTimeout(timer);
    }
}
