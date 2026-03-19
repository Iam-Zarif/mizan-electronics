import axios from "axios";

const normalizeApiBaseUrl = (value?: string) => {
  const fallback = "https://mizan-electronics-backend.vercel.app/api";
  if (!value) return fallback;

  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const getRuntimeApiBaseUrl = () => {
  const normalized = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

  if (typeof window === "undefined") {
    return normalized;
  }

  try {
    const apiUrl = new URL(normalized);
    const currentHost = window.location.hostname;
    const isLocalApiHost =
      apiUrl.hostname === "localhost" || apiUrl.hostname === "127.0.0.1";
    const isDifferentClientHost =
      currentHost !== "localhost" &&
      currentHost !== "127.0.0.1" &&
      currentHost !== apiUrl.hostname;

    if (isLocalApiHost && isDifferentClientHost) {
      apiUrl.hostname = currentHost;
      return apiUrl.toString().replace(/\/+$/, "");
    }
  } catch {
    return normalized;
  }

  return normalized;
};

export const API_BASE_URL = getRuntimeApiBaseUrl();

export const WS_BASE_URL = API_BASE_URL.replace(/\/api$/, "").replace(/^http/, "ws");

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message
    );
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong";
};
