
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F8F6] px-5 py-10 text-[#292820]">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#EDEAE1] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#E9E8E1] blur-3xl" />

      <div className="relative w-full max-w-[420px]">

        {/* Back to store */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#77766E] transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to store
        </Link>

        <div className="rounded-[28px] border border-[#EAE9E3] bg-white px-7 py-10 shadow-[0_15px_60px_rgba(40,38,30,0.07)] sm:px-10">

          {/* Brand */}
          <div className="mb-10 text-center">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-[#99958A]">
              KANDID LUXURY
            </p>

            <h1 className="font-serif text-3xl tracking-tight">
              Welcome back
            </h1>

            <p className="mx-auto mt-3 max-w-[270px] text-sm leading-6 text-[#85847D]">
              Sign in to your account to manage your orders and saved addresses.
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-[#DADCE0] bg-white px-5 py-4 text-sm font-medium text-[#3C4043] shadow-sm transition hover:bg-[#F8F9FA] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#4285F4] border-t-transparent" />
            ) : (
              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.97 46.98 31.81 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
                />
              </svg>
            )}

            {loading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 border-t border-[#EEEDE8] pt-6">
            <p className="text-center text-xs leading-6 text-[#99988F]">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-[#45443D] underline underline-offset-2">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#45443D] underline underline-offset-2">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-[#A09F98]">
          © {new Date().getFullYear()} Kandid Luxury
        </p>
      </div>
    </main>
  );
}
