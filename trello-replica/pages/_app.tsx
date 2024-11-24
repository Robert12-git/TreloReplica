import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    persistence: "localStorage",
    person_profiles: "identified_only",
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const userId = localStorage.getItem("user_id") || "anonymous_user"; // Replace this with actual auth logic

    // Track user activity
    posthog.identify(userId, {
      name: "Anonymous User", // Replace with user details if available
      email: "anonymous@example.com", // Replace with actual user email if available
    });

    // Capture "user_active" event
    posthog.capture("user_active", {
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <CSPostHogProvider>
      <Component {...pageProps} />
    </CSPostHogProvider>
  );
}
