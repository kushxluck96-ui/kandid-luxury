
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (session?.user) {
        setUser(session.user);
        setLoading(false);
        setError("");
      } else {
        setUser(null);
      }
    });

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.session?.user) {
        setUser(data.session.user);
        setLoading(false);
        return;
      }

      // Allow the initial auth event to arrive before redirecting.
      window.setTimeout(async () => {
        if (!active) return;

        const { data: latest } = await supabase.auth.getSession();

        if (!active) return;

        if (latest.session?.user) {
          setUser(latest.session.user);
        } else {
          router.replace("/account/login");
        }

        setLoading(false);
      }, 1200);
    }

    checkSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function signOut() {
    setSigningOut(true);
    setError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setSigningOut(false);
      return;
    }

    router.replace("/account/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8F6]">
        <p className="text-sm text-neutral-600">
          Checking your account...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8F6] px-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="font-serif text-2xl">Your account</h1>
          <p className="mt-3 text-sm text-neutral-600">
            {error || "Please sign in to access your account."}
          </p>
          <Link
            href="/account/login"
            className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm text-white"
          >
            Continue with Google
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F6] px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.25em] text-neutral-500"
        >
          KANDID LUXURY
        </Link>

        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-7 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            My Account
          </p>

          <h1 className="mt-3 font-serif text-3xl text-neutral-900">
            Welcome
          </h1>

          <p className="mt-3 break-words text-sm text-neutral-600">
            {user.email || "Signed in with Google"}
          </p>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 rounded-2xl bg-[#F8F8F6] p-5">
            <h2 className="font-serif text-xl">My Orders</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Your order history and delivery tracking will appear here once
              your purchases are securely linked to your account.
            </p>

            <button
              type="button"
              onClick={() => router.push("/account/orders")}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm text-white"
            >
              View My Orders
            </button>
          </div>

          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="mt-6 text-sm text-neutral-500 underline disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </main>
  );
}
