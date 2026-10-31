
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  UserRound,
  Package,
} from "lucide-react";

type Address = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

const emptyAddress = {
  label: "Home",
  recipient_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  landmark: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);
  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setAddresses([]);
        if (!loading) {
          router.replace("/account/login");
        }
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

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user?.id]);

  async function loadAddresses() {
    setAddressesLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("customer_addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAddresses((data || []) as Address[]);
    }

    setAddressesLoading(false);
  }

  function openNewAddress() {
    setEditingId(null);
    setForm({
      ...emptyAddress,
      recipient_name:
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        "",
      is_default: addresses.length === 0,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditAddress(address: Address) {
    setEditingId(address.id);
    setForm({
      label: address.label,
      recipient_name: address.recipient_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function updateField(
    field: keyof typeof emptyAddress,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const shouldBeDefault =
      form.is_default || addresses.length === 0;

    // Clear the old default before setting a new one.
    if (shouldBeDefault) {
      const { error: defaultError } = await supabase
        .from("customer_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (defaultError) {
        setError(defaultError.message);
        setSaving(false);
        return;
      }
    }

    const payload = {
      ...form,
      is_default: shouldBeDefault,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    const result = editingId
      ? await supabase
          .from("customer_addresses")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", user.id)
      : await supabase
          .from("customer_addresses")
          .insert(payload);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyAddress);
    setSuccess("Your delivery address has been saved.");

    await loadAddresses();
    setSaving(false);
  }

  async function deleteAddress(id: string) {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const addressToDelete = addresses.find((item) => item.id === id);

    const { error } = await supabase
      .from("customer_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    // If the default address was deleted, choose another one.
    if (addressToDelete?.is_default) {
      const nextAddress = addresses.find((item) => item.id !== id);

      if (nextAddress) {
        const { error: defaultError } = await supabase
          .from("customer_addresses")
          .update({ is_default: true })
          .eq("id", nextAddress.id)
          .eq("user_id", user.id);

        if (defaultError) {
          setError(defaultError.message);
        }
      }
    }

    setSuccess("Address deleted.");
    await loadAddresses();
  }

  async function setDefaultAddress(id: string) {
    if (!user) return;

    setError("");
    setSuccess("");

    const { error: clearError } = await supabase
      .from("customer_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    if (clearError) {
      setError(clearError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from("customer_addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Default delivery address updated.");
    await loadAddresses();
  }

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

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Customer";

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
    <main className="min-h-screen bg-[#F8F8F6] px-4 py-7 text-[#29271F] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500"
        >
          <ArrowLeft size={14} />
          MiniMagic by Kandid Luxury
        </Link>

        <div className="mt-7 rounded-3xl border border-[#E8E5DE] bg-white p-5 shadow-sm sm:mt-10 sm:p-9">

          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F1EEE7]">
              <UserRound size={22} className="text-[#85765F]" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#9B896B]">
                MY ACCOUNT
              </p>
              <h1 className="mt-1 truncate font-serif text-2xl sm:text-3xl">
                Hello, {displayName}
              </h1>
              <p className="mt-1 break-all text-xs text-neutral-500">
                {user.email}
              </p>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          {/* Saved addresses */}
          <section className="mt-9 border-t border-[#EAE7E0] pt-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#8B806D]" />
                  <h2 className="font-serif text-xl sm:text-2xl">
                    Delivery Addresses
                  </h2>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Manage your saved delivery details.
                </p>
              </div>

              {!showForm && (
                <button
                  type="button"
                  onClick={openNewAddress}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#29271F] px-3 py-2.5 text-[9px] font-medium uppercase tracking-wider text-white transition hover:bg-[#494437] sm:px-4"
                >
                  <Plus size={14} />
                  Add
                </button>
              )}
            </div>

            {showForm && (
              <form
                onSubmit={saveAddress}
                className="mt-6 rounded-2xl border border-[#E8E5DE] bg-[#FCFBF8] p-4 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {editingId ? "Edit address" : "New delivery address"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
                    aria-label="Close address form"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-xs text-neutral-600">
                    Address label
                    <select
                      value={form.label}
                      onChange={(e) => updateField("label", e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    >
                      <option>Home</option>
                      <option>Work</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className="text-xs text-neutral-600">
                    Recipient name *
                    <input
                      required
                      value={form.recipient_name}
                      onChange={(e) => updateField("recipient_name", e.target.value)}
                      placeholder="Full name"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600 sm:col-span-2">
                    Mobile number *
                    <input
                      required
                      type="tel"
                      maxLength={15}
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="10-digit mobile number"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600 sm:col-span-2">
                    House / Flat / Building / Street *
                    <input
                      required
                      value={form.address_line1}
                      onChange={(e) => updateField("address_line1", e.target.value)}
                      placeholder="House number, building, street"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600 sm:col-span-2">
                    Apartment, area or locality
                    <input
                      value={form.address_line2}
                      onChange={(e) => updateField("address_line2", e.target.value)}
                      placeholder="Apartment, sector, locality"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600 sm:col-span-2">
                    Landmark
                    <input
                      value={form.landmark}
                      onChange={(e) => updateField("landmark", e.target.value)}
                      placeholder="Nearby landmark (optional)"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600">
                    City *
                    <input
                      required
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600">
                    State *
                    <input
                      required
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      placeholder="State"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600">
                    PIN code *
                    <input
                      required
                      inputMode="numeric"
                      maxLength={10}
                      value={form.postal_code}
                      onChange={(e) => updateField("postal_code", e.target.value)}
                      placeholder="PIN code"
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>

                  <label className="text-xs text-neutral-600">
                    Country *
                    <input
                      required
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#DEDAD1] bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#9B896B]"
                    />
                  </label>
                </div>

                <label className="mt-5 flex items-center gap-2 text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) => updateField("is_default", e.target.checked)}
                    className="h-4 w-4 accent-[#85765F]"
                  />
                  Set as my default delivery address
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#29271F] px-5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#494437] disabled:opacity-50"
                >
                  <Check size={15} />
                  {saving ? "Saving..." : "Save Address"}
                </button>
              </form>
            )}

            {addressesLoading ? (
              <p className="py-8 text-center text-sm text-neutral-500">
                Loading your addresses...
              </p>
            ) : addresses.length === 0 && !showForm ? (
              <div className="mt-5 rounded-2xl bg-[#F8F8F6] px-5 py-8 text-center">
                <MapPin size={24} className="mx-auto text-[#A69B88]" />
                <p className="mt-3 text-sm font-medium">
                  No saved addresses yet
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Add your delivery address to make checkout faster.
                </p>
                <button
                  type="button"
                  onClick={openNewAddress}
                  className="mt-5 rounded-full bg-[#29271F] px-5 py-3 text-[10px] uppercase tracking-wider text-white"
                >
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-2xl border border-[#E8E5DE] p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">
                            {address.label}
                          </span>
                          {address.is_default && (
                            <span className="rounded-full bg-[#F1EEE7] px-2.5 py-1 text-[8px] font-medium uppercase tracking-wider text-[#85765F]">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm font-medium">
                          {address.recipient_name}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {address.phone}
                        </p>
                        <p className="mt-2 text-xs leading-6 text-neutral-600">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                          {address.landmark && `, ${address.landmark}`}
                          {`, ${address.city}, ${address.state} - ${address.postal_code}, ${address.country}`}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => openEditAddress(address)}
                          aria-label="Edit address"
                          className="rounded-full p-2.5 text-neutral-500 transition hover:bg-[#F5F3EE]"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAddress(address.id)}
                          aria-label="Delete address"
                          className="rounded-full p-2.5 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {!address.is_default && (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(address.id)}
                        className="mt-4 text-[9px] font-medium uppercase tracking-[0.15em] text-[#85765F] underline underline-offset-4"
                      >
                        Make default address
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Orders */}
          <section className="mt-9 border-t border-[#EAE7E0] pt-7">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-[#8B806D]" />
              <h2 className="font-serif text-xl sm:text-2xl">
                My Orders
              </h2>
            </div>
            <p className="mt-2 text-xs leading-6 text-neutral-500">
              View your previous purchases and track your deliveries.
            </p>
            <button
              type="button"
              onClick={() => router.push("/account/orders")}
              className="mt-5 min-h-11 rounded-full bg-[#29271F] px-6 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#494437]"
            >
              View My Orders
            </button>
          </section>

          {/* Sign out */}
          <div className="mt-9 border-t border-[#EAE7E0] pt-6">
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="text-xs text-neutral-500 underline underline-offset-4 disabled:opacity-50"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[9px] uppercase tracking-[0.25em] text-[#A69B88]">
          MINIMAGIC SKINCARE · BY KANDID LUXURY
        </p>
      </div>
    </main>
  );
}
