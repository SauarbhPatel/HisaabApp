import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { loadSession, clearSession, saveSession, STORAGE } from "../api/client";
import { logoutFromServer } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext(null);

// ─── Map API user object → internal shape ─────────────────────────────────────
function buildUser(apiUser) {
    const name = apiUser?.name || "";
    const initials =
        name
            .split(" ")
            .filter(Boolean)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "HI";

    return {
        id: apiUser?.id || apiUser?._id || null,
        name,
        initials,
        email: apiUser?.email || "",
        phone: apiUser?.phone || "",
        avatar: apiUser?.avatar || "😎",
        avatarColor: apiUser?.avatarColor || "#1a7a5e",
        useCase: apiUser?.useCase || "both",
    };
}

export function AppProvider({ children }) {
    // ─── Core auth ────────────────────────────────────────────────────────────
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingSession, setIsLoadingSession] = useState(true);

    // ─── User ─────────────────────────────────────────────────────────────────
    const [user, setUser] = useState(buildUser(null));
    const useCase = user.useCase || "both";

    // ─── Incomplete signup resume state ───────────────────────────────────────
    // When a user who started-but-never-finished signup tries to login,
    // backend returns { incompleteSignup: true, userId, nextStep }.
    // We store this here so the navigator can route them to the right step.
    const [resumeSignup, setResumeSignup] = useState(null);
    // resumeSignup shape: { userId, nextStep: 'verify-otp' | 'set-password' | 'complete-profile' }

    // ─── Restore persisted session on app launch ──────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const session = await loadSession();
                if (session.accessToken && session.user) {
                    setUser(buildUser(session.user));
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.warn("[AppContext] session restore error:", e);
            } finally {
                setIsLoadingSession(false);
            }
        })();
    }, []);

    // ─── Called after any successful login or signup complete ─────────────────
    // data = { accessToken, refreshToken, user } from API
    const handleAuthSuccess = useCallback((data) => {
        setUser(buildUser(data.user));
        setIsAuthenticated(true);
        setResumeSignup(null); // clear any pending resume
    }, []);

    // ─── Called when login detects incomplete signup ──────────────────────────
    // Stores the resume info so the navigator shows Signup at the right step
    const handleIncompleteSignup = useCallback(({ userId, nextStep }) => {
        setResumeSignup({ userId, nextStep });
    }, []);

    // ─── Clear resume signup state (e.g. user cancels) ───────────────────────
    const clearResumeSignup = useCallback(() => {
        setResumeSignup(null);
    }, []);

    // ─── Logout ───────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await logoutFromServer();
        } catch (_) {}
        await clearSession();
        setIsAuthenticated(false);
        setUser(buildUser(null));
        setResumeSignup(null);
    }, []);

    // ─── Update useCase locally (e.g. after profile edit) ────────────────────
    const setUseCase = useCallback((newUseCase) => {
        setUser((prev) => {
            const updated = { ...prev, useCase: newUseCase };
            // Persist the change
            AsyncStorage.getItem(STORAGE.USER).then((raw) => {
                if (raw) {
                    const stored = JSON.parse(raw);
                    AsyncStorage.setItem(
                        STORAGE.USER,
                        JSON.stringify({ ...stored, useCase: newUseCase }),
                    );
                }
            });
            return updated;
        });
    }, []);

    // ─── Update any user fields locally ──────────────────────────────────────
    const updateUser = useCallback((fields) => {
        setUser((prev) => {
            const updated = { ...prev, ...fields };
            AsyncStorage.getItem(STORAGE.USER).then((raw) => {
                const stored = raw ? JSON.parse(raw) : {};
                AsyncStorage.setItem(
                    STORAGE.USER,
                    JSON.stringify({ ...stored, ...fields }),
                );
            });
            return updated;
        });
    }, []);

    return (
        <AppContext.Provider
            value={{
                // Auth state
                isAuthenticated,
                isLoadingSession,
                // User
                user,
                useCase,
                updateUser,
                setUseCase,
                // Auth actions
                handleAuthSuccess,
                logout,
                // Incomplete signup resume
                resumeSignup,
                handleIncompleteSignup,
                clearResumeSignup,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useAppContext must be inside AppProvider");
    return ctx;
}
