import { useEffect } from "react";
import "@/styles/globals.css";
import "@/styles/navbar.css";
import "@/styles/article.css";
import "@/styles/buttons.css";
import type { AppProps } from "next/app";
import { supabase } from "@/lib/supabase";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <Component {...pageProps} />;
}
