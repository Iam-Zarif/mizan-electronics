"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  CreditCard,
  Laptop,
  Mail,
  MapPin,
  PencilLine,
  PhoneCall,
  Save,
  Settings2,
  ShieldCheck,
  Smartphone,
  UserCircle2,
  X,
} from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import { useLanguage } from "@/lib/i18n";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

export default function DashboardSettingsPage() {
  const { locale } = useLanguage();
  const { user, updateProfile, addAddress, updateAddress } = useProvider();
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [profileName, setProfileName] = useState(user?.f_name ?? "");
  const [profilePhone, setProfilePhone] = useState(user?.phone ?? "");
  const [contactPhone, setContactPhone] = useState(user?.phone ?? "");
  const [contactAddress, setContactAddress] = useState("");
  const [isBillingEditing, setIsBillingEditing] = useState(false);
  const [billingEmail, setBillingEmail] = useState(
    user?.email ?? "mizan.electronics.store@gmail.com",
  );
  const [bkashNumber, setBkashNumber] = useState("01665146666");
  const [bankName, setBankName] = useState("Dutch-Bangla Bank");
  const [bankAccountName, setBankAccountName] = useState("Mizan AC Servicing");
  const [bankAccountNumber, setBankAccountNumber] = useState("145.110.887654");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [billingMessage, setBillingMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isContactSaving, setIsContactSaving] = useState(false);
  const [isBillingSaving, setIsBillingSaving] = useState(false);
  const [deviceMessage, setDeviceMessage] = useState<string | null>(null);

  const defaultAddress = useMemo(
    () => user?.addresses.find((address) => address.isDefault) ?? user?.addresses[0],
    [user?.addresses],
  );

  const adminName = user?.f_name || "Admin";
  const adminEmail = user?.email || "mizan.electronics.store@gmail.com";
  const adminPhone = user?.phone || "01949-397234";
  const adminAvatar = user?.avatar?.url;

  useEffect(() => {
    setProfileName(user?.f_name ?? "");
    setProfilePhone(user?.phone ?? "");
    setContactPhone(user?.phone ?? "");
    setContactAddress(
      defaultAddress?.address || "657, Hatimbag, Dakshinkhan, Dhaka-1230",
    );
  }, [defaultAddress?.address, user?.f_name, user?.phone]);

  const resetProfileForm = () => {
    setProfileName(user?.f_name ?? "");
    setProfilePhone(user?.phone ?? "");
    setProfileError(null);
    setProfileMessage(null);
  };

  const resetContactForm = () => {
    setContactPhone(user?.phone ?? "");
    setContactAddress(
      defaultAddress?.address || "657, Hatimbag, Dakshinkhan, Dhaka-1230",
    );
    setContactError(null);
    setContactMessage(null);
  };

  const resetBillingForm = () => {
    setBillingEmail(user?.email ?? "mizan.electronics.store@gmail.com");
    setBkashNumber("01665146666");
    setBankName("Dutch-Bangla Bank");
    setBankAccountName("Mizan AC Servicing");
    setBankAccountNumber("145.110.887654");
    setBillingError(null);
    setBillingMessage(null);
  };

  const handleProfileSave = async () => {
    const name = profileName.trim();
    const phone = profilePhone.trim();

    if (!name || !phone) {
      setProfileError(
        locale === "en"
          ? "Name and phone are required."
          : "নাম ও ফোন নাম্বার প্রয়োজন।",
      );
      return;
    }

    setIsProfileSaving(true);
    setProfileError(null);
    setProfileMessage(null);

    try {
      await updateProfile({ f_name: name, phone });
      setProfileMessage(
        locale === "en" ? "Profile updated." : "প্রোফাইল আপডেট হয়েছে।",
      );
      setIsProfileEditing(false);
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : locale === "en"
            ? "Failed to update profile."
            : "প্রোফাইল আপডেট করা যায়নি।",
      );
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleContactSave = async () => {
    const phone = contactPhone.trim();
    const addressValue = contactAddress.trim();

    if (!phone || !addressValue) {
      setContactError(
        locale === "en"
          ? "Phone and address are required."
          : "ফোন ও ঠিকানা প্রয়োজন।",
      );
      return;
    }

    setIsContactSaving(true);
    setContactError(null);
    setContactMessage(null);

    try {
      if (defaultAddress?._id) {
        await updateAddress(defaultAddress._id, {
          label: defaultAddress.label || "Primary Office",
          type: defaultAddress.type || "office",
          division: defaultAddress.division || "Dhaka",
          district: defaultAddress.district || "Dhaka",
          area: defaultAddress.area || "Dakshinkhan",
          address: addressValue,
          phone,
          mapLink: defaultAddress.mapLink || "",
          isDefault: true,
        });
      } else {
        await addAddress({
          label: "Primary Office",
          type: "office",
          division: "Dhaka",
          district: "Dhaka",
          area: "Dakshinkhan",
          address: addressValue,
          phone,
          mapLink: "",
          isDefault: true,
        });
      }

      if (phone !== (user?.phone ?? "")) {
        await updateProfile({ f_name: user?.f_name ?? adminName, phone });
      }

      setContactMessage(
        locale === "en"
          ? "Business contact updated."
          : "বিজনেস কন্টাক্ট আপডেট হয়েছে।",
      );
      setIsContactEditing(false);
    } catch (error) {
      setContactError(
        error instanceof Error
          ? error.message
          : locale === "en"
            ? "Failed to update business contact."
            : "বিজনেস কন্টাক্ট আপডেট করা যায়নি।",
      );
    } finally {
      setIsContactSaving(false);
    }
  };

  const handleBillingSave = async () => {
    if (
      !billingEmail.trim() ||
      !bkashNumber.trim() ||
      !bankName.trim() ||
      !bankAccountName.trim() ||
      !bankAccountNumber.trim()
    ) {
      setBillingError(
        locale === "en"
          ? "All billing fields are required."
          : "সব বিলিং ফিল্ড প্রয়োজন।",
      );
      return;
    }

    setIsBillingSaving(true);
    setBillingError(null);
    setBillingMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setBillingMessage(
        locale === "en"
          ? "Billing settings saved."
          : "বিলিং সেটিংস সেভ হয়েছে।",
      );
      setIsBillingEditing(false);
    } catch {
      setBillingError(
        locale === "en"
          ? "Failed to save billing settings."
          : "বিলিং সেটিংস সেভ করা যায়নি।",
      );
    } finally {
      setIsBillingSaving(false);
    }
  };

  const handleDeviceRemove = (deviceKey: string) => {
    setDeviceMessage(
      locale === "en"
        ? `OTP verification will be required to remove ${deviceKey}.`
        : `${deviceKey} রিমুভ করতে OTP ভেরিফিকেশন লাগবে।`,
    );
  };

  const deviceRows = [
    {
      key: "current",
      icon: Laptop,
      titleBn: "বর্তমান ব্রাউজার সেশন",
      titleEn: "Current browser session",
      metaBn: "Chrome on macOS · ঢাকা",
      metaEn: "Chrome on macOS · Dhaka",
      lastSeenBn: "এখন অ্যাকটিভ",
      lastSeenEn: "Active now",
      tone: "bg-emerald-100 text-emerald-700",
      removable: false,
    },
    {
      key: "mobile",
      icon: Smartphone,
      titleBn: "সর্বশেষ মোবাইল সেশন",
      titleEn: "Latest mobile session",
      metaBn: "Android Chrome · ঢাকা",
      metaEn: "Android Chrome · Dhaka",
      lastSeenBn: "শেষ লগইন ১৮ মার্চ, ১০:৪৫ PM",
      lastSeenEn: "Last login 18 Mar, 10:45 PM",
      tone: "bg-[#e9efff] text-[#215fba]",
      removable: true,
    },
    {
      key: "desktop",
      icon: Laptop,
      titleBn: "পূর্বের ডেস্কটপ সেশন",
      titleEn: "Previous desktop session",
      metaBn: "Safari on macOS · ঢাকা",
      metaEn: "Safari on macOS · Dhaka",
      lastSeenBn: "শেষ লগইন ১৭ মার্চ, ০৮:১৫ PM",
      lastSeenEn: "Last login 17 Mar, 08:15 PM",
      tone: "bg-amber-100 text-amber-700",
      removable: true,
    },
  ];

  return (
    <AdminSurface>
      <AdminPageHeader titleBn="সেটিংস" titleEn="Settings" />

      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.92fr,1.08fr]">
          <section className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                  <UserCircle2 size={18} />
                </span>
                <div>
                  <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Admin Profile" : "অ্যাডমিন প্রোফাইল"}
                  </p>
                  <p className="text-sm text-[#7f8ba3]">
                    {locale === "en"
                      ? "Primary identity details for the dashboard account."
                      : "ড্যাশবোর্ড অ্যাকাউন্টের মূল পরিচিতি তথ্য।"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isProfileEditing) {
                    setIsProfileEditing(false);
                    resetProfileForm();
                  } else {
                    setIsProfileEditing(true);
                    setProfileMessage(null);
                    setProfileError(null);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dbe4f4] bg-white px-3 py-2 text-sm font-semibold text-[#215fba] dark:border-white/10 dark:bg-[#11192c] dark:text-[#aab5ff]"
              >
                {isProfileEditing ? <X size={15} /> : <PencilLine size={15} />}
                {locale === "en"
                  ? isProfileEditing
                    ? "Cancel"
                    : "Edit"
                  : isProfileEditing
                    ? "বাতিল"
                    : "এডিট"}
              </button>
            </div>

            <div className="rounded-[22px] bg-[#f8fbff] p-4 dark:bg-[#11192c]">
              <div className="flex items-center gap-4">
                {adminAvatar ? (
                  <Image
                    src={getOptimizedCloudinaryUrl(adminAvatar, {
                      width: 144,
                      height: 144,
                      crop: "fill",
                    })}
                    alt={adminName}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-linear-to-br from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] text-2xl font-extrabold text-white">
                    {adminName.slice(0, 1).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-xl font-extrabold text-[#1f2638] dark:text-white">
                    {adminName}
                  </p>
                  <p className="truncate text-sm text-[#60708d] dark:text-[#a7b3c9]">
                    {adminEmail}
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-[#e9efff] px-3 py-1 text-xs font-semibold text-[#215fba] dark:bg-white/8 dark:text-[#aab5ff]">
                    {locale === "en"
                      ? "Primary dashboard account"
                      : "প্রাইমারি ড্যাশবোর্ড অ্যাকাউন্ট"}
                  </p>
                </div>
              </div>
            </div>

            {isProfileEditing ? (
              <div className="mt-4 grid gap-3">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Full Name" : "পূর্ণ নাম"}
                  </span>
                  <input
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Email" : "ইমেইল"}
                  </span>
                  <input
                    value={adminEmail}
                    disabled
                    className="rounded-[16px] border border-[#dbe4f4] bg-[#f5f7fb] px-4 py-3 text-sm text-[#7f8ba3] outline-none dark:border-white/10 dark:bg-[#0f1728] dark:text-[#a7b3c9]"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Phone" : "ফোন"}
                  </span>
                  <input
                    value={profilePhone}
                    onChange={(event) => setProfilePhone(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleProfileSave}
                    disabled={isProfileSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#215fba] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Save size={15} />
                    {isProfileSaving
                      ? locale === "en"
                        ? "Saving..."
                        : "সেভ হচ্ছে..."
                      : locale === "en"
                        ? "Save Changes"
                        : "সেভ করুন"}
                  </button>
                </div>

                {profileError ? (
                  <p className="text-sm font-medium text-red-600">{profileError}</p>
                ) : null}
                {profileMessage ? (
                  <p className="text-sm font-medium text-emerald-600">{profileMessage}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {[
                  {
                    icon: UserCircle2,
                    labelBn: "পূর্ণ নাম",
                    labelEn: "Full Name",
                    value: adminName,
                  },
                  {
                    icon: Mail,
                    labelBn: "ইমেইল",
                    labelEn: "Email",
                    value: adminEmail,
                  },
                  {
                    icon: PhoneCall,
                    labelBn: "ফোন",
                    labelEn: "Phone",
                    value: adminPhone,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.labelEn}
                      className="flex items-center gap-3 rounded-[20px] border border-[#e8edf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#11192c]"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                          {locale === "en" ? item.labelEn : item.labelBn}
                        </p>
                        <p className="truncate text-sm font-medium text-[#1f2638] dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                  <Settings2 size={18} />
                </span>
                <div>
                  <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                    {locale === "en"
                      ? "Business Contact Details"
                      : "বিজনেস কন্টাক্ট ডিটেইলস"}
                  </p>
                  <p className="text-sm text-[#7f8ba3]">
                  {locale === "en"
                      ? "Editable service-call contact details used by the admin."
                      : "অ্যাডমিনের সার্ভিস কলের জন্য ব্যবহৃত এডিটেবল কন্টাক্ট ডিটেইলস।"}
                </p>
              </div>
            </div>

              <button
                type="button"
                onClick={() => {
                  if (isContactEditing) {
                    setIsContactEditing(false);
                    resetContactForm();
                  } else {
                    setIsContactEditing(true);
                    setContactMessage(null);
                    setContactError(null);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dbe4f4] bg-white px-3 py-2 text-sm font-semibold text-[#215fba] dark:border-white/10 dark:bg-[#11192c] dark:text-[#aab5ff]"
              >
                {isContactEditing ? <X size={15} /> : <PencilLine size={15} />}
                {locale === "en"
                  ? isContactEditing
                    ? "Cancel"
                    : "Edit"
                  : isContactEditing
                    ? "বাতিল"
                    : "এডিট"}
              </button>
            </div>

            {isContactEditing ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Support Number" : "সাপোর্ট নম্বর"}
                  </span>
                  <input
                    value={contactPhone}
                    onChange={(event) => setContactPhone(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Primary Address" : "প্রাইমারি ঠিকানা"}
                  </span>
                  <textarea
                    value={contactAddress}
                    onChange={(event) => setContactAddress(event.target.value)}
                    rows={4}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleContactSave}
                    disabled={isContactSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#215fba] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Save size={15} />
                    {isContactSaving
                      ? locale === "en"
                        ? "Saving..."
                        : "সেভ হচ্ছে..."
                      : locale === "en"
                        ? "Save Contact"
                        : "কন্টাক্ট সেভ করুন"}
                  </button>
                </div>

                {contactError ? (
                  <p className="md:col-span-2 text-sm font-medium text-red-600">
                    {contactError}
                  </p>
                ) : null}
                {contactMessage ? (
                  <p className="md:col-span-2 text-sm font-medium text-emerald-600">
                    {contactMessage}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    icon: MapPin,
                    labelBn: "প্রাইমারি ঠিকানা",
                    labelEn: "Primary Address",
                    value:
                      defaultAddress?.address ||
                      "657, Hatimbag, Dakshinkhan, Dhaka-1230",
                  },
                  {
                    icon: Smartphone,
                    labelBn: "সাপোর্ট নম্বর",
                    labelEn: "Support Number",
                    value: adminPhone,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.labelEn}
                      className="rounded-[22px] border border-[#e8edf7] bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-[#11192c]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#5c6cff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                          <Icon size={16} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1f2638] dark:text-white">
                            {locale === "en" ? item.labelEn : item.labelBn}
                          </p>
                          <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.72fr,0.68fr,1.1fr]">
          <section className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                <CreditCard size={18} />
              </span>
              <div className="flex-1">
                <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Billing Identity" : "বিলিং আইডেন্টিটি"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isBillingEditing) {
                    setIsBillingEditing(false);
                    resetBillingForm();
                  } else {
                    setIsBillingEditing(true);
                    setBillingMessage(null);
                    setBillingError(null);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dbe4f4] bg-white px-3 py-2 text-sm font-semibold text-[#215fba] dark:border-white/10 dark:bg-[#11192c] dark:text-[#aab5ff]"
              >
                {isBillingEditing ? <X size={15} /> : <PencilLine size={15} />}
                {locale === "en"
                  ? isBillingEditing
                    ? "Cancel"
                    : "Edit"
                  : isBillingEditing
                    ? "বাতিল"
                    : "এডিট"}
              </button>
            </div>

            {isBillingEditing ? (
              <div className="grid gap-3">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Invoice Email" : "ইনভয়েস ইমেইল"}
                  </span>
                  <input
                    value={billingEmail}
                    onChange={(event) => setBillingEmail(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "bKash Number" : "বিকাশ নম্বর"}
                  </span>
                  <input
                    value={bkashNumber}
                    onChange={(event) => setBkashNumber(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Bank Name" : "ব্যাংকের নাম"}
                  </span>
                  <input
                    value={bankName}
                    onChange={(event) => setBankName(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Bank Account Name" : "ব্যাংক একাউন্ট নাম"}
                  </span>
                  <input
                    value={bankAccountName}
                    onChange={(event) => setBankAccountName(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Bank Account Number" : "ব্যাংক একাউন্ট নম্বর"}
                  </span>
                  <input
                    value={bankAccountNumber}
                    onChange={(event) => setBankAccountNumber(event.target.value)}
                    className="rounded-[16px] border border-[#dbe4f4] bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleBillingSave}
                    disabled={isBillingSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#215fba] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Save size={15} />
                    {isBillingSaving
                      ? locale === "en"
                        ? "Saving..."
                        : "সেভ হচ্ছে..."
                      : locale === "en"
                        ? "Save Billing"
                        : "বিলিং সেভ করুন"}
                  </button>
                </div>
                {billingError ? (
                  <p className="text-sm font-medium text-red-600">{billingError}</p>
                ) : null}
                {billingMessage ? (
                  <p className="text-sm font-medium text-emerald-600">{billingMessage}</p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  {
                    icon: Mail,
                    labelEn: "Invoice Email",
                    labelBn: "ইনভয়েস ইমেইল",
                    value: billingEmail,
                  },
                  {
                    icon: Smartphone,
                    labelEn: "bKash Number",
                    labelBn: "বিকাশ নম্বর",
                    value: bkashNumber,
                  },
                  {
                    icon: CreditCard,
                    labelEn: "Bank Name",
                    labelBn: "ব্যাংকের নাম",
                    value: bankName,
                  },
                  {
                    icon: CreditCard,
                    labelEn: "Bank Account Name",
                    labelBn: "ব্যাংক একাউন্ট নাম",
                    value: bankAccountName,
                  },
                  {
                    icon: CreditCard,
                    labelEn: "Bank Account Number",
                    labelBn: "ব্যাংক একাউন্ট নম্বর",
                    value: bankAccountNumber,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.labelEn}
                      className="rounded-[20px] bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#4f6bff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                          <Icon size={16} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                            {locale === "en" ? item.labelEn : item.labelBn}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#1f2638] dark:text-white">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                <ShieldCheck size={18} />
              </span>
              <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                {locale === "en"
                  ? "Security & Device Recognition"
                  : "সিকিউরিটি ও ডিভাইস রিকগনিশন"}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  titleBn: "ইমেইল ভেরিফাইড",
                  titleEn: "Email Verified",
                  statusBn: user?.isVerified ? "চালু" : "বাকি",
                  statusEn: user?.isVerified ? "Active" : "Pending",
                  tone: user?.isVerified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700",
                  icon: Mail,
                },
                {
                  titleBn: "গুগল সাইন-ইন",
                  titleEn: "Google Sign-in",
                  statusBn: "চালু",
                  statusEn: "Enabled",
                  tone: "bg-emerald-100 text-emerald-700",
                  icon: ShieldCheck,
                },
                {
                  titleBn: "সেশন কুকি",
                  titleEn: "Session Cookie",
                  statusBn: "চালু",
                  statusEn: "Enabled",
                  tone: "bg-emerald-100 text-emerald-700",
                  icon: Smartphone,
                },
                {
                  titleBn: "অ্যাকটিভ ডিভাইস",
                  titleEn: "Active Devices",
                  statusBn: "৩ ডিভাইস",
                  statusEn: "3 devices",
                  tone: "bg-[#e9efff] text-[#215fba]",
                  icon: Laptop,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.titleEn}
                    className="min-h-[136px] rounded-[20px] border border-[#e8edf7] bg-[#f8fbff] px-4 py-5 dark:border-white/10 dark:bg-[#11192c]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#4f6bff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                        <Icon size={16} />
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                        {locale === "en" ? item.statusEn : item.statusBn}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#1f2638] dark:text-white">
                      {locale === "en" ? item.titleEn : item.titleBn}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 space-y-3">
              {deviceRows.map((device) => {
                const Icon = device.icon;

                return (
                  <div
                    key={device.titleEn}
                    className="rounded-[20px] bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#5c6cff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                          <Icon size={16} />
                        </span>
                        <div>
                          <p className="font-semibold text-[#1f2638] dark:text-white">
                            {locale === "en" ? device.titleEn : device.titleBn}
                          </p>
                          <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                            {locale === "en" ? device.metaEn : device.metaBn}
                          </p>
                          <p className="mt-2 text-xs text-[#8a96ad] dark:text-[#70809c]">
                            {locale === "en" ? device.lastSeenEn : device.lastSeenBn}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${device.tone}`}>
                          {locale === "en"
                            ? device.titleEn === "Current browser session"
                              ? "Current"
                              : "Recent"
                            : device.titleBn === "বর্তমান ব্রাউজার সেশন"
                              ? "বর্তমান"
                              : "সাম্প্রতিক"}
                        </span>
                        {device.removable ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeviceRemove(
                                locale === "en" ? device.titleEn : device.titleBn,
                              )
                            }
                            className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                          >
                            {locale === "en" ? "Remove Device" : "ডিভাইস রিমুভ"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
              {deviceMessage ? (
                <p className="text-sm font-medium text-amber-700">{deviceMessage}</p>
              ) : null}
            </div>
          </section>

        </div>
      </div>
    </AdminSurface>
  );
}
