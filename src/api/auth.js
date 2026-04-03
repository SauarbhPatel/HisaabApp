import { apiCall, saveSession, savePendingUserId } from "./client";
import { ENDPOINTS } from "./config";

// ═══════════════════════════════════════════════════════════════════════════════
//  SIGNUP FLOW
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Step 1 — Save basic info + send OTP to phone
 * Body: { name, phone?, email? }
 * Success data: { userId, nextStep }
 */
export async function signupStep1({ name, phone, email }) {
    const body = { name: name.trim() };
    if (phone?.trim()) body.phone = phone.trim();
    if (email?.trim()) body.email = email.trim().toLowerCase();

    const result = await apiCall(ENDPOINTS.SIGNUP_STEP1, {
        method: "POST",
        body,
    });
    console.log(result);

    // Persist userId so next steps can use it
    if (result.ok && result.data?.userId) {
        await savePendingUserId(result.data.userId);
    }

    return result;
}

/**
 * Step 2a — Verify OTP sent to phone
 * Body: { userId, otp }
 * Success data: { userId, nextStep: 'set-password' }
 */
export async function signupVerifyOTP({ userId, otp }) {
    return apiCall(ENDPOINTS.SIGNUP_VERIFY_OTP, {
        method: "POST",
        body: { userId, otp: otp.trim() },
    });
}

/**
 * Step 2a — Resend OTP
 * Body: { userId }
 */
export async function signupResendOTP({ userId }) {
    return apiCall(ENDPOINTS.SIGNUP_RESEND_OTP, {
        method: "POST",
        body: { userId },
    });
}

/**
 * Step 2b — Set password after OTP verified
 * Body: { userId, password, confirmPassword }
 * Success data: { userId, nextStep: 'complete-profile' }
 */
export async function signupSetPassword({ userId, password, confirmPassword }) {
    return apiCall(ENDPOINTS.SIGNUP_SET_PASSWORD, {
        method: "POST",
        body: { userId, password, confirmPassword },
    });
}

/**
 * Step 3 — Complete profile → returns tokens
 * Body: { userId, avatar?, useCase }
 * Success data: { accessToken, refreshToken, user }
 */
export async function signupCompleteProfile({ userId, avatar, useCase }) {
    const body = { userId, useCase };
    if (avatar) body.avatar = avatar;

    const result = await apiCall(ENDPOINTS.SIGNUP_COMPLETE, {
        method: "POST",
        body,
    });

    // Save session on success
    if (result.ok && result.data) {
        await saveSession(result.data);
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Login with phone/email + password
 * Body: { identifier, password }
 * Success data: { accessToken, refreshToken, user }
 */
export async function loginWithPassword({ identifier, password }) {
    const result = await apiCall(ENDPOINTS.LOGIN_PASSWORD, {
        method: "POST",
        body: { identifier: identifier.trim(), password },
    });

    if (result.ok && result.data) {
        await saveSession(result.data);
    }

    return result;
}

/**
 * Request OTP for phone login
 * Body: { phone }
 * Success data: { userId }
 */
export async function loginOTPRequest({ phone }) {
    const result = await apiCall(ENDPOINTS.LOGIN_OTP_REQUEST, {
        method: "POST",
        body: { phone: phone.trim() },
    });

    if (result.ok && result.data?.userId) {
        await savePendingUserId(result.data.userId);
    }

    return result;
}

/**
 * Verify OTP for phone login → returns tokens
 * Body: { userId, otp }
 * Success data: { accessToken, refreshToken, user }
 */
export async function loginOTPVerify({ userId, otp }) {
    const result = await apiCall(ENDPOINTS.LOGIN_OTP_VERIFY, {
        method: "POST",
        body: { userId, otp: otp.trim() },
    });

    if (result.ok && result.data) {
        await saveSession(result.data);
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FORGOT / RESET PASSWORD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Send reset OTP to phone or email
 * Body: { identifier }
 */
export async function forgotPassword({ identifier }) {
    return apiCall(ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        body: { identifier: identifier.trim() },
    });
}

/**
 * Reset password with OTP
 * Body: { userId, otp, newPassword, confirmPassword }
 */
export async function resetPassword({
    userId,
    otp,
    newPassword,
    confirmPassword,
}) {
    const result = await apiCall(ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        body: { userId, otp: otp.trim(), newPassword, confirmPassword },
    });

    if (result.ok && result.data) {
        await saveSession(result.data);
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SESSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Refresh access token using refresh token
 * Body: { userId, refreshToken }
 */
export async function refreshAccessToken({ userId, refreshToken }) {
    return apiCall(ENDPOINTS.REFRESH_TOKEN, {
        method: "POST",
        body: { userId, refreshToken },
    });
}

/**
 * Logout — invalidates tokens on server
 * Requires auth header
 */
export async function logoutFromServer() {
    return apiCall(ENDPOINTS.LOGOUT, { method: "POST", auth: true });
}

/**
 * Get current user profile
 * Requires auth header
 */
export async function getMe() {
    return apiCall(ENDPOINTS.ME, { method: "GET", auth: true });
}
