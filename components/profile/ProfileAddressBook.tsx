"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ExternalLink,
  Home,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useProvider } from "@/Providers/AuthProviders";
import { useLanguage } from "@/lib/i18n";
import {
  getDhakaAreas,
  getDhakaDistricts,
  getDhakaDivision,
  type LocationOption,
} from "@/lib/bangladesh-locations";
import type { Address, AddressFormInput } from "@/lib/auth";

const emptyForm: AddressFormInput = {
  label: "",
  type: "home",
  division: "",
  district: "",
  area: "",
  address: "",
  phone: "",
  mapLink: "",
  isDefault: false,
};

export function ProfileAddressBook() {
  const { t } = useLanguage();
  const { user, addAddress, updateAddress, deleteAddress } = useProvider();
  const [form, setForm] = useState<AddressFormInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [areas, setAreas] = useState<LocationOption[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const addresses = user?.addresses ?? [];

  useEffect(() => {
    const loadDhakaDistricts = async () => {
      try {
        const division = await getDhakaDivision();
        setForm((current) => ({
          ...current,
          division: division.bnName,
        }));
        setIsLoadingDistricts(true);
        setDistricts(await getDhakaDistricts());
      } catch {
        setError(t("profile.loadDhakaDistrictsFailed"));
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    void loadDhakaDistricts();
  }, [t]);

  const resetForm = () => {
    setForm((current) => ({
      ...emptyForm,
      division: current.division || "ঢাকা",
    }));
    setEditingId(null);
    setSelectedDistrictId("");
    setAreas([]);
    setError("");
    setSuccess("");
    setIsFormOpen(false);
  };

  const typeOptions = useMemo(
    () => [
      { value: "home", label: "Home" },
      { value: "office", label: "Office" },
      { value: "other", label: "Other" },
    ],
    [],
  );

  const onDistrictChange = async (districtId: string) => {
    setSelectedDistrictId(districtId);
    setAreas([]);

    const district = districts.find((item) => item.id === districtId);
    setForm((current) => ({
      ...current,
      district: district?.bnName ?? "",
      area: "",
    }));

    if (!districtId || !district) return;

    try {
      setIsLoadingAreas(true);
      setAreas(await getDhakaAreas(district.name));
    } catch {
      setError(t("profile.loadAreasFailed"));
    } finally {
      setIsLoadingAreas(false);
    }
  };

  const startEdit = async (address: Address) => {
    setError("");
    setSuccess("");
    setIsFormOpen(true);
    setEditingId(address._id);
    setForm({
      label: address.label,
      type: address.type,
      division: address.division,
      district: address.district,
      area: address.area,
      address: address.address,
      phone: address.phone,
      mapLink: address.mapLink,
      isDefault: address.isDefault,
    });

    try {
      const loadedDistricts = await getDhakaDistricts();
      setDistricts(loadedDistricts);

      const district = loadedDistricts.find(
        (item) =>
          item.bnName === address.district || item.name === address.district,
      );

      if (!district) {
        setSelectedDistrictId("");
        setAreas([]);
        return;
      }

      setSelectedDistrictId(district.id);
      setIsLoadingAreas(true);
      setAreas(await getDhakaAreas(district.name));
    } catch {
      setError(t("profile.loadAddressLocationFailed"));
    } finally {
      setIsLoadingAreas(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.label ||
      !form.division ||
      !form.district ||
      !form.area ||
      !form.address ||
      !form.phone
    ) {
      setError(t("profile.completeAddressFields"));
      return;
    }

    try {
      setIsSaving(true);
      const successMessage = editingId
        ? t("profile.addressUpdated")
        : t("profile.addressAdded");
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await addAddress(form);
      }
      resetForm();
      setSuccess(successMessage);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : t("profile.addressSaveFailed"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError("");
      setSuccess("");
      await deleteAddress(id);
      if (editingId === id) {
        resetForm();
      }
      setSuccess(t("profile.addressRemoved"));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : t("profile.addressDeleteFailed"),
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-4 shadow dark:bg-neutral-900 lg:p-6"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {t("profile.savedAddresses")}
            </h2>
            <p className="text-sm text-neutral-500">
              {t("profile.addressSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setIsFormOpen(true);
              setEditingId(null);
              setForm((current) => ({
                ...emptyForm,
                division: current.division || "ঢাকা",
              }));
              setSelectedDistrictId("");
              setAreas([]);
            }}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:w-auto"
          >
            <Plus size={16} />
            {t("profile.newAddress")}
          </button>
        </div>

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-700">
              {t("profile.noAddresses")}
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address._id}
                className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {address.type === "office" ? (
                          <Building2 size={14} />
                        ) : (
                          <Home size={14} />
                        )}
                        {address.label || t("profile.addressLabel")}
                      </span>
                      {address.isDefault ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {t("profile.default")}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {[
                        address.area,
                        address.district,
                        address.division,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {address.address}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <span className="inline-flex items-center gap-2">
                        <Phone size={14} />
                        {address.phone}
                      </span>
                      {address.mapLink ? (
                        <a
                          href={address.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
                        >
                          <ExternalLink size={14} />
                          {t("profile.openMap")}
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => void startEdit(address)}
                      className="w-full cursor-pointer rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:w-auto"
                    >
                      {t("profile.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(address._id)}
                      disabled={deletingId === address._id}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 sm:w-auto"
                    >
                      {deletingId === address._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      {t("profile.remove")}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {isFormOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <motion.form
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={handleSubmit}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl dark:bg-neutral-900 lg:p-6"
          >
            <button
              type="button"
              onClick={resetForm}
              className="absolute right-4 top-4 inline-flex cursor-pointer items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-500 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <X size={16} />
            </button>

            <div className="mb-5 pr-12">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {editingId ? t("profile.editAddress") : t("profile.addAddress")}
              </h2>
              <p className="text-sm text-neutral-500">
                {t("profile.addressHelper")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t("profile.addressLabel")}>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, label: e.target.value }))
                    }
                    placeholder={t("profile.addressLabelPlaceholder")}
                    className={inputClassName}
                  />
                </Field>

                <Field label={t("profile.addressType")}>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        type: e.target.value as AddressFormInput["type"],
                      }))
                    }
                    className={inputClassName}
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value === "home"
                          ? t("profile.home")
                          : option.value === "office"
                            ? t("profile.office")
                            : t("profile.other")}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t("profile.division")}>
                  <input
                    type="text"
                    value={form.division || "ঢাকা"}
                    readOnly
                    className={`${inputClassName} bg-neutral-50 dark:bg-neutral-800/50`}
                  />
                </Field>
                <Field label={t("profile.district")}>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => void onDistrictChange(e.target.value)}
                    className={inputClassName}
                    disabled={isLoadingDistricts}
                  >
                    <option value="">
                      {isLoadingDistricts
                        ? t("profile.loadingDistricts")
                        : t("profile.selectDistrict")}
                    </option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.bnName}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t("profile.area")}>
                  <select
                    value={
                      areas.find(
                        (item) =>
                          item.bnName === form.area || item.name === form.area,
                      )?.id ?? ""
                    }
                    onChange={(e) => {
                      const area = areas.find((item) => item.id === e.target.value);
                      setForm((current) => ({
                        ...current,
                        area: area?.bnName ?? area?.name ?? "",
                      }));
                    }}
                    className={inputClassName}
                    disabled={!selectedDistrictId || isLoadingAreas}
                  >
                    <option value="">
                      {isLoadingAreas
                        ? t("profile.loadingAreas")
                        : t("profile.selectArea")}
                    </option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.bnName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={t("profile.phoneNumber")}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, phone: e.target.value }))
                    }
                    placeholder="01XXXXXXXXX"
                    className={inputClassName}
                  />
                </Field>
              </div>

              <Field label={t("profile.detailedAddress")}>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, address: e.target.value }))
                  }
                  rows={3}
                  placeholder={t("profile.detailedAddressPlaceholder")}
                  className={`${inputClassName} resize-none py-3`}
                />
              </Field>

              <Field label={t("profile.mapLink")}>
                <input
                  type="url"
                  value={form.mapLink}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, mapLink: e.target.value }))
                  }
                  placeholder="https://maps.google.com/..."
                  className={inputClassName}
                />
              </Field>

              <label className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="accent-indigo-500"
                />
                {t("profile.setDefaultAddress")}
              </label>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {success ? <p className="text-sm text-green-600">{success}</p> : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow disabled:opacity-60 sm:w-auto"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {editingId
                    ? t("profile.updateAddress")
                    : t("profile.saveAddress")}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full cursor-pointer rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:w-auto"
                >
                  {t("profile.cancel")}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
      <span className="inline-flex items-center gap-2">
        <MapPin size={14} className="text-indigo-500" />
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10";
