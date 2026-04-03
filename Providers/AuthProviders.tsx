"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, getErrorMessage } from "@/lib/api";
import { signInWithPopup } from "firebase/auth";
import { loginWithFacebookPopup } from "@/lib/facebook";
import {
  normalizeUser,
  type Address,
  type AddressFormInput,
  type AuthUser,
  type ProfileFormInput,
} from "@/lib/auth";
import { getFirebaseAuth, getGoogleAuthProvider } from "@/lib/firebase";

type AuthContextType = {
  user: AuthUser | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  themePreference: "light" | "dark";
  languagePreference: "bn" | "en";
  setThemePreference: (themePreference: "light" | "dark") => Promise<void>;
  setLanguagePreference: (languagePreference: "bn" | "en") => Promise<void>;
  register: (
    f_name: string,
    phone: string,
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<AuthUser>;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<AuthUser>;
  loginWithGoogle: (rememberMe: boolean) => Promise<AuthUser>;
  loginWithFacebook: (rememberMe: boolean) => Promise<AuthUser>;
  sendVerificationOtp: () => Promise<string>;
  verifyEmail: (otp: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AuthUser | null>;
  updateProfile: (input: ProfileFormInput) => Promise<AuthUser>;
  uploadAvatar: (file: File) => Promise<AuthUser>;
  addAddress: (input: AddressFormInput) => Promise<Address[]>;
  updateAddress: (id: string, input: AddressFormInput) => Promise<Address[]>;
  deleteAddress: (id: string) => Promise<Address[]>;
};

const CLOUDINARY_CLOUD_NAME = "dj5olrziv";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [themePreferenceState, setThemePreferenceState] = useState<"light" | "dark">("light");
  const [languagePreferenceState, setLanguagePreferenceState] = useState<"bn" | "en">("bn");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setThemePreferenceState(
      window.localStorage.getItem("mizan-theme") === "dark" ? "dark" : "light",
    );
    setLanguagePreferenceState(
      window.localStorage.getItem("mizan-lang") === "en" ? "en" : "bn",
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themePreferenceState === "dark");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mizan-theme", themePreferenceState);
    }
  }, [themePreferenceState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mizan-lang", languagePreferenceState);
    }
  }, [languagePreferenceState]);

  const applyProfile = (profile: AuthUser | null) => {
    setUser(profile);
    if (!profile) {
      return null;
    }

    setThemePreferenceState(profile.themePreference ?? "light");
    setLanguagePreferenceState(profile.languagePreference ?? "bn");
    return profile;
  };

  const refreshProfile = async () => {
    try {
      const { data } = await api.get("/profile/me");
      const normalized = normalizeUser(data as Record<string, unknown>);
      return applyProfile(normalized);
    } catch {
      return applyProfile(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const initializeAuth = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/session");
      const session = data as {
        authenticated?: boolean;
        user?: Record<string, unknown> | null;
      };

      if (!session.authenticated || !session.user) {
        applyProfile(null);
        return null;
      }

      const normalized = normalizeUser(session.user);
      return applyProfile(normalized);
    } catch {
      return applyProfile(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  const register = async (
    f_name: string,
    phone: string,
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        f_name,
        phone,
        email,
        password,
        rememberMe,
      });

      const normalized = normalizeUser(data.user as Record<string, unknown>);
      setUser(normalized);

      const profile = await refreshProfile();
      return profile ?? normalized;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      const profile = await refreshProfile();
      if (!profile) throw new Error("Failed to load profile");
      return profile;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const loginWithGoogle = async (rememberMe: boolean) => {
    try {
      const firebaseAuth = getFirebaseAuth();
      const googleAuthProvider = getGoogleAuthProvider();

      if (!firebaseAuth) {
        throw new Error("Google login is not configured");
      }

      const credential = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const idToken = await credential.user.getIdToken();

      await api.post("/auth/google", {
        idToken,
        rememberMe,
      });

      const profile = await refreshProfile();
      if (!profile) throw new Error("Failed to load profile");
      return profile;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const loginWithFacebook = async (rememberMe: boolean) => {
    try {
      const credential = await loginWithFacebookPopup();

      await api.post("/auth/facebook", {
        accessToken: credential.accessToken,
        userId: credential.userId,
        rememberMe,
      });

      const profile = await refreshProfile();
      if (!profile) throw new Error("Failed to load profile");
      return profile;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  const setThemePreference = async (themePreference: "light" | "dark") => {
    setThemePreferenceState(themePreference);

    if (!user) return;

    try {
      const { data } = await api.put("/profile/theme", { themePreference });
      const nextThemePreference = data.themePreference === "dark" ? "dark" : "light";
      setThemePreferenceState(nextThemePreference);
      setUser((current) =>
        current ? { ...current, themePreference: nextThemePreference } : current,
      );
    } catch (error) {
      setThemePreferenceState(user.themePreference === "dark" ? "dark" : "light");
      throw new Error(getErrorMessage(error));
    }
  };

  const setLanguagePreference = async (languagePreference: "bn" | "en") => {
    setLanguagePreferenceState(languagePreference);

    if (!user) return;

    try {
      const { data } = await api.put("/profile/language", { languagePreference });
      const nextLanguagePreference = data.languagePreference === "en" ? "en" : "bn";
      setLanguagePreferenceState(nextLanguagePreference);
      setUser((current) =>
        current ? { ...current, languagePreference: nextLanguagePreference } : current,
      );
    } catch (error) {
      setLanguagePreferenceState(user.languagePreference === "en" ? "en" : "bn");
      throw new Error(getErrorMessage(error));
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const { data } = await api.post("/auth/send-verification-otp");
      return typeof data.expiresAt === "string" ? data.expiresAt : "";
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const verifyEmail = async (otp: string) => {
    try {
      const { data } = await api.post("/auth/verify-email", { otp });
      const normalized = normalizeUser(data.user as Record<string, unknown>);
      setUser(normalized);
      return normalized;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const updateProfile = async (input: ProfileFormInput) => {
    try {
      const { data } = await api.put("/profile/me", input);
      const normalized = normalizeUser(data.user as Record<string, unknown>);
      setUser(normalized);
      return normalized;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const addAddress = async (input: AddressFormInput) => {
    try {
      const { data } = await api.post("/profile/address", input);
      const addresses = Array.isArray(data.addresses)
        ? normalizeUser({ addresses: data.addresses }).addresses
        : [];
      setUser((current) => (current ? { ...current, addresses } : current));
      return addresses;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const updateAddress = async (id: string, input: AddressFormInput) => {
    try {
      await api.put(`/profile/address/${id}`, input);
      const profile = await refreshProfile();
      return profile?.addresses ?? [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await api.delete(`/profile/address/${id}`);
      const profile = await refreshProfile();
      return profile?.addresses ?? [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = (await uploadResponse.json()) as {
        secure_url?: string;
        public_id?: string;
      };

      if (!uploadResponse.ok || !uploadData.secure_url || !uploadData.public_id) {
        throw new Error("Avatar upload failed");
      }

      const { data } = await api.put("/profile/avatar", {
        url: uploadData.secure_url,
        publicId: uploadData.public_id,
      });

      setUser((current) =>
        current
          ? {
              ...current,
              avatar: {
                url:
                  typeof data.avatar?.url === "string"
                    ? data.avatar.url
                    : uploadData.secure_url,
                publicId:
                  typeof data.avatar?.publicId === "string"
                    ? data.avatar.publicId
                    : uploadData.public_id,
              },
            }
          : current,
      );

      const profile = await refreshProfile();
      if (!profile) throw new Error("Failed to refresh profile");
      return profile;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        isAuthenticated: Boolean(user),
        themePreference: themePreferenceState,
        languagePreference: languagePreferenceState,
        setThemePreference,
        setLanguagePreference,
        register,
        login,
        loginWithGoogle,
        loginWithFacebook,
        sendVerificationOtp,
        verifyEmail,
        logout,
        refreshProfile,
        updateProfile,
        uploadAvatar,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useProvider = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useProvider must be used within AuthProvider");
  return context;
};
