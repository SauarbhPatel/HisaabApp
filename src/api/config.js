// ─────────────────────────────────────────────────────────────────────────────
// BASE URL — change this one constant to switch between local and production
// ─────────────────────────────────────────────────────────────────────────────
export const BASE_URL = "https://hisabbackend-qmty.onrender.com";

// When running locally: export const BASE_URL = 'http://localhost:5000';

export const REQUEST_TIMEOUT_MS = 20000; // 20s — Render cold starts can be slow

// ─── All endpoints ────────────────────────────────────────────────────────────
export const ENDPOINTS = {
    // Signup
    SIGNUP_STEP1: "/api/auth/signup/step1",
    SIGNUP_VERIFY_OTP: "/api/auth/signup/verify-otp",
    SIGNUP_RESEND_OTP: "/api/auth/signup/resend-otp",
    SIGNUP_SET_PASSWORD: "/api/auth/signup/set-password",
    SIGNUP_COMPLETE: "/api/auth/signup/complete-profile",

    // Login
    LOGIN_PASSWORD: "/api/auth/login/password",
    LOGIN_OTP_REQUEST: "/api/auth/login/otp/request",
    LOGIN_OTP_VERIFY: "/api/auth/login/otp/verify",

    // Password
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",

    // Session
    REFRESH_TOKEN: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",

    // Profile
    ME: "/api/auth/me",
};

// ─── Expense endpoints ────────────────────────────────────────────────────────
export const EXPENSE_ENDPOINTS = {
    LIST: "/api/expenses",
    MONTHLY_REPORT: "/api/expenses/report/monthly",
    BY_CATEGORY: (cat) => `/api/expenses/category/${cat}`,
    BY_ID: (id) => `/api/expenses/${id}`,
};
