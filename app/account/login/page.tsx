
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CustomerLoginPage() {
  const router = useRouter();
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
    <main className="min-h-screen flex items-center justify-center bg-[#F8F8F6] px-5">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
          KANDID LUXURY
        </p>

        <h1 className="mb-3 text-center font-serif text-3xl text-neutral-900">
          Your Account
        </h1>

        <p className="mb-8 text-center text-sm text-neutral-600">
          Sign in to view your orders and track your deliveries.
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full rounded-xl border border-neutral-300 px-5 py-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-neutral-500">
          Your account will let you access your orders securely.
        </p>
      </section>
    </main>
  );
}
