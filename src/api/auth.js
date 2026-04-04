import {
    apiCall,
    saveSession,
    savePendingUid,
    clearPendingUid,
} from "./client";
import { ENDPOINTS } from "./config";

// ═══════════════════════════════════════════════════════════════════════════════
//  SIGNUP — Step 1
//  POST /api/auth/signup/step1
//  Body:    { name, phone?, email? }
//  Returns: { userId, nextStep: 'verify-otp' | 'set-password' }
// ═══════════════════════════════════════════════════════════════════════════════
export async function signupStep1({ name, phone, email }) {
    const body = { name: name.trim() };
    if (phone?.trim()) body.phone = phone.trim();
    if (email?.trim()) body.email = email.trim().toLowerCase();

    const result = await apiCall(ENDPOINTS.SIGNUP_STEP1, {
        method: "POST",
        body,
    });

    if (result.ok && result.data?.userId) {
        await savePendingUid(result.data.userId);
    }
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SIGNUP — Verify OTP
//  POST /api/auth/signup/verify-otp
//  Body:    { userId, otp }
//  Returns: { userId, nextStep: 'set-password' }
// ═══════════════════════════════════════════════════════════════════════════════
export async function signupVerifyOTP({ userId, otp }) {
    return apiCall(ENDPOINTS.SIGNUP_VERIFY_OTP, {
        method: "POST",
        body: { userId, otp: otp.trim() },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SIGNUP — Resend OTP
//  POST /api/auth/signup/resend-otp
//  Body:    { userId }
// ═══════════════════════════════════════════════════════════════════════════════
export async function signupResendOTP({ userId }) {
    return apiCall(ENDPOINTS.SIGNUP_RESEND_OTP, {
        method: "POST",
        body: { userId },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SIGNUP — Set Password
//  POST /api/auth/signup/set-password
//  Body:    { userId, password, confirmPassword }
//  Returns: { userId, nextStep: 'complete-profile' }
// ═══════════════════════════════════════════════════════════════════════════════
export async function signupSetPassword({ userId, password, confirmPassword }) {
    return apiCall(ENDPOINTS.SIGNUP_SET_PASSWORD, {
        method: "POST",
        body: { userId, password, confirmPassword },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SIGNUP — Complete Profile (Step 3 — issues tokens)
//  POST /api/auth/signup/complete-profile
//  Body:    { userId, avatar?, avatarColor?, useCase }
//  Returns: { accessToken, refreshToken, expiresIn, user }
// ═══════════════════════════════════════════════════════════════════════════════
export async function signupCompleteProfile({ userId, avatar, useCase }) {
    const body = { userId, useCase };
    if (avatar) body.avatar = avatar;

    const result = await apiCall(ENDPOINTS.SIGNUP_COMPLETE, {
        method: "POST",
        body,
    });

    if (result.ok && result.data) {
        await saveSession(result.data);
        await clearPendingUid();
    }
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGIN — Password
//  POST /api/auth/login/password
//  Body:    { identifier, password }
//  Returns:
//    Success → { accessToken, refreshToken, expiresIn, user }
//    Incomplete signup → ok:false + incompleteSignup:true + userId + nextStep
// ═══════════════════════════════════════════════════════════════════════════════
export async function loginWithPassword({ identifier, password }) {
    const result = await apiCall(ENDPOINTS.LOGIN_PASSWORD, {
        method: "POST",
        body: { identifier: identifier.trim(), password },
    });

    if (result.ok && result.data) {
        await saveSession(result.data);
        await clearPendingUid();
    }

    // If incomplete signup — save userId so resume flow can use it
    if (!result.ok && result.incompleteSignup && result.userId) {
        await savePendingUid(result.userId);
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGIN — OTP Request
//  POST /api/auth/login/otp/request
//  Body:    { phone }
//  Returns: { userId }
// ═══════════════════════════════════════════════════════════════════════════════
export async function loginOTPRequest({ phone }) {
    const result = await apiCall(ENDPOINTS.LOGIN_OTP_REQUEST, {
        method: "POST",
        body: { phone: phone.trim() },
    });

    if (result.ok && result.data?.userId) {
        await savePendingUid(result.data.userId);
    }
    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGIN — OTP Verify
//  POST /api/auth/login/otp/verify
//  Body:    { userId, otp }
//  Returns:
//    Success → { accessToken, refreshToken, expiresIn, user }
//    Incomplete signup → ok:false + incompleteSignup:true + userId + nextStep
// ═══════════════════════════════════════════════════════════════════════════════
export async function loginOTPVerify({ userId, otp }) {
    const result = await apiCall(ENDPOINTS.LOGIN_OTP_VERIFY, {
        method: "POST",
        body: { userId, otp: otp.trim() },
    });

    if (result.ok && result.data) {
        await saveSession(result.data);
        await clearPendingUid();
    }

    if (!result.ok && result.incompleteSignup && result.userId) {
        await savePendingUid(result.userId);
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FORGOT PASSWORD
//  POST /api/auth/forgot-password
//  Body: { identifier }  — phone or email
//  Always returns 200 (prevents user enumeration)
// ═══════════════════════════════════════════════════════════════════════════════
export async function forgotPassword({ identifier }) {
    return apiCall(ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        body: { identifier: identifier.trim() },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  RESET PASSWORD
//  POST /api/auth/reset-password
//  Body: { userId, otp, newPassword, confirmPassword }
// ═══════════════════════════════════════════════════════════════════════════════
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
//  REFRESH TOKEN
//  POST /api/auth/refresh
//  Body: { userId, refreshToken }
// ═══════════════════════════════════════════════════════════════════════════════
export async function refreshAccessToken({ userId, refreshToken }) {
    return apiCall(ENDPOINTS.REFRESH_TOKEN, {
        method: "POST",
        body: { userId, refreshToken },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGOUT
//  POST /api/auth/logout  (requires auth header)
// ═══════════════════════════════════════════════════════════════════════════════
export async function logoutFromServer() {
    return apiCall(ENDPOINTS.LOGOUT, { method: "POST", auth: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET PROFILE
//  GET /api/auth/me  (requires auth header)
// ═══════════════════════════════════════════════════════════════════════════════
export async function getMe() {
    return apiCall(ENDPOINTS.ME, { method: "GET", auth: true });
}
