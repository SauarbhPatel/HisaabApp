// ─── Base URL ─────────────────────────────────────────────────────────────────
// Change this one line when moving to production
export const BASE_URL = "https://hisabbackend-qmty.onrender.com";

// ─── API endpoints map ────────────────────────────────────────────────────────
export const ENDPOINTS = {
    // Auth — Signup
    SIGNUP_STEP1: "/api/auth/signup/step1",
    SIGNUP_VERIFY_OTP: "/api/auth/signup/verify-otp",
    SIGNUP_RESEND_OTP: "/api/auth/signup/resend-otp",
    SIGNUP_SET_PASSWORD: "/api/auth/signup/set-password",
    SIGNUP_COMPLETE: "/api/auth/signup/complete-profile",

    // Auth — Login
    LOGIN_PASSWORD: "/api/auth/login/password",
    LOGIN_OTP_REQUEST: "/api/auth/login/otp/request",
    LOGIN_OTP_VERIFY: "/api/auth/login/otp/verify",

    // Auth — Password
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",

    // Auth — Session
    REFRESH_TOKEN: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",

    // Auth — Profile
    ME: "/api/auth/me",
};

// ─── Timeout (ms) ─────────────────────────────────────────────────────────────
export const REQUEST_TIMEOUT = 15000;
