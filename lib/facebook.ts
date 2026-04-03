"use client";

declare global {
  interface Window {
    FB?: {
      init: (options: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          status?: string;
          authResponse?: {
            accessToken?: string;
            userID?: string;
          };
        }) => void,
        options?: {
          scope?: string;
        },
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_SDK_SRC = "https://connect.facebook.net/en_US/sdk.js";
const FACEBOOK_API_VERSION =
  process.env.NEXT_PUBLIC_FACEBOOK_GRAPH_API_VERSION ?? "v25.0";

let facebookSdkPromise: Promise<void> | null = null;

const getFacebookAppId = () => {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();

  if (!appId) {
    throw new Error("Facebook login is not configured");
  }

  return appId;
};

export const loadFacebookSdk = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Facebook SDK is only available in the browser"));
  }

  if (window.FB) {
    return Promise.resolve();
  }

  if (facebookSdkPromise) {
    return facebookSdkPromise;
  }

  facebookSdkPromise = new Promise<void>((resolve, reject) => {
    const appId = getFacebookAppId();

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId,
        cookie: false,
        xfbml: false,
        version: FACEBOOK_API_VERSION,
      });
      resolve();
    };

    const existingScript = document.getElementById(FACEBOOK_SDK_ID);
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.id = FACEBOOK_SDK_ID;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = FACEBOOK_SDK_SRC;
    script.onerror = () => {
      facebookSdkPromise = null;
      reject(new Error("Failed to load Facebook SDK"));
    };

    document.body.appendChild(script);
  });

  return facebookSdkPromise;
};

export const loginWithFacebookPopup = async () => {
  await loadFacebookSdk();

  return new Promise<{ accessToken: string; userId: string }>((resolve, reject) => {
    window.FB?.login(
      (response) => {
        if (response.status !== "connected" || !response.authResponse?.accessToken) {
          reject(new Error("Facebook login was cancelled"));
          return;
        }

        resolve({
          accessToken: response.authResponse.accessToken,
          userId: response.authResponse.userID ?? "",
        });
      },
      {
        scope: "public_profile,email",
      },
    );
  });
};
