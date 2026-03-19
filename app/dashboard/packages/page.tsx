"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Gift,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import {
  ApiEmptyState,
  ApiErrorState,
  ApiSkeletonBlock,
} from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { SuccessToast } from "@/components/shared/SuccessToast";
import { getErrorMessage } from "@/lib/api";
import { dispatchAdminSidebarRefresh } from "@/lib/admin-sidebar-events";
import {
  createAdminPackage,
  deleteAdminPackage,
  getAdminPackages,
  getAdminServices,
  type AdminPackagePayload,
  type AdminPackageRow,
} from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";
import { updateAdminPackage } from "@/lib/dashboard-api";

type PackageFormState = {
  categoryId: string;
  title: string;
  summary: string;
  price: string;
  includesText: string;
};

const emptyForm: PackageFormState = {
  categoryId: "",
  title: "",
  summary: "",
  price: "",
  includesText: "",
};

const buildFormState = (item: AdminPackageRow): PackageFormState => ({
  categoryId: item.categoryId,
  title: item.title,
  summary: item.summary,
  price: item.price,
  includesText: item.includes.join("\n"),
});

const normalizeMultiline = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export default function DashboardPackagesPage() {
  const { locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState<PackageFormState>(emptyForm);
  const [editingPackage, setEditingPackage] = useState<AdminPackageRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPackageRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { data, isLoading, error, refresh, setData } = useApiQuery(
    () => getAdminPackages({ search: "", page: 1, limit: 100 }),
    [],
  );

  useEffect(() => {
    if (!actionSuccess) return;
    const timer = window.setTimeout(() => setActionSuccess(null), 2400);
    return () => window.clearTimeout(timer);
  }, [actionSuccess]);
  const { data: servicesData } = useApiQuery(
    () => getAdminServices({ search: "" }),
    [],
  );

  const categoryOptions = useMemo(
    () =>
      (servicesData?.rows ?? []).map((category) => ({
        id: category.id,
        label: locale === "en" ? category.nameEn : category.name,
      })),
    [servicesData, locale],
  );

  const filteredRows = useMemo(() => {
    if (!data) return [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return data.rows;

    return data.rows.filter((item) =>
      [
        item.title,
        item.titleEn,
        item.summary,
        item.summaryEn,
        item.price,
        item.categoryName,
        item.categoryNameEn,
        ...item.includes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [data, search]);

  const paginatedRows = useMemo(() => {
    const totalItems = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / 12));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * 12;

    return {
      rows: filteredRows.slice(start, start + 12),
      pagination: {
        page: safePage,
        pageSize: 12,
        totalItems,
        totalPages,
        hasPreviousPage: safePage > 1,
        hasNextPage: safePage < totalPages,
      },
    };
  }, [filteredRows, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const resetModal = () => {
    setEditingPackage(null);
    setFormState(emptyForm);
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setActionError(null);
    setActionSuccess(null);
    setEditingPackage(null);
    setFormState({
      ...emptyForm,
      categoryId: categoryOptions[0]?.id ?? "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminPackageRow) => {
    setActionError(null);
    setActionSuccess(null);
    setEditingPackage(item);
    setFormState(buildFormState(item));
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload: AdminPackagePayload = {
      categoryId: formState.categoryId,
      title: formState.title.trim(),
      summary: formState.summary.trim(),
      price: formState.price.trim(),
      includes: normalizeMultiline(formState.includesText),
    };

    setIsSaving(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const response = editingPackage
        ? await updateAdminPackage(editingPackage._id, payload)
        : await createAdminPackage(payload);
      const saved = response.data as AdminPackageRow;
      const nextRow = {
        ...saved,
        categoryName: servicesData?.rows.find((row) => row.id === saved.categoryId)?.name ?? saved.title,
        categoryNameEn:
          servicesData?.rows.find((row) => row.id === saved.categoryId)?.nameEn ?? saved.titleEn,
      };

      setData((current) => {
        if (!current) return current;
        const rows = editingPackage
          ? current.rows.map((item) => (item._id === editingPackage._id ? nextRow : item))
          : [nextRow, ...current.rows];
        return {
          rows,
          counts: {
            totalPackages: rows.length,
          },
          pagination: current.pagination,
        };
      });

      resetModal();
      setActionSuccess(
        locale === "en"
          ? editingPackage
            ? "Package updated successfully."
            : "Package created successfully."
          : editingPackage
            ? "প্যাকেজ সফলভাবে আপডেট হয়েছে।"
            : "প্যাকেজ সফলভাবে তৈরি হয়েছে।",
      );
      dispatchAdminSidebarRefresh();
      void refresh();
    } catch (nextError) {
      setActionError(getErrorMessage(nextError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await deleteAdminPackage(deleteTarget._id);
      setData((current) => {
        if (!current) return current;
        const rows = current.rows.filter((item) => item._id !== deleteTarget._id);
        return {
          rows,
          counts: {
            totalPackages: rows.length,
          },
          pagination: current.pagination,
        };
      });
      setDeleteTarget(null);
      setActionSuccess(
        locale === "en" ? "Package deleted successfully." : "প্যাকেজ সফলভাবে ডিলিট হয়েছে।",
      );
      dispatchAdminSidebarRefresh();
    } catch (nextError) {
      setActionError(getErrorMessage(nextError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminSurface>
      <SuccessToast message={actionSuccess} />
      <AdminPageHeader titleBn="কম্বো প্যাকেজ" titleEn="Combo Packages" />

      {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
      {!isLoading && error ? (
        <ApiErrorState
          title={locale === "en" ? "Packages failed to load" : "প্যাকেজ লোড হয়নি"}
          description={error}
          onRetry={() => void refresh()}
        />
      ) : null}

      {!isLoading && !error && data ? (
        <div className="space-y-5">
          <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <label className="flex w-full items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9] xl:max-w-[360px]">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    locale === "en"
                      ? "Search packages instantly"
                      : "প্যাকেজ সাথে সাথে সার্চ করুন"
                  }
                  className="w-full bg-transparent outline-none placeholder:text-[#8a96ad] dark:placeholder:text-[#70809c]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-4 py-2 text-sm font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                  <Gift size={14} />
                  {locale === "en" ? "Packages" : "প্যাকেজ"}: {filteredRows.length}
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#2160ba] px-4 py-2 text-sm font-semibold text-white"
                >
                  <Plus size={16} />
                  {locale === "en" ? "Add Package" : "প্যাকেজ যোগ করুন"}
                </button>
              </div>
            </div>

            {actionError ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {actionError}
              </p>
            ) : null}
          </div>

          {filteredRows.length === 0 ? (
            <ApiEmptyState
              title={locale === "en" ? "No packages found" : "কোনো প্যাকেজ পাওয়া যায়নি"}
              description={
                locale === "en"
                  ? "Create a combo package and it will appear on the landing page."
                  : "একটি কম্বো প্যাকেজ তৈরি করুন, এটি ল্যান্ডিং পেজে দেখাবে।"
              }
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {paginatedRows.rows.map((item) => (
                <div
                  key={item._id}
                  className="h-full overflow-hidden rounded-[24px] border border-[#e8edf7] bg-white shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
                >
                  <div className="h-1.5 bg-linear-to-r from-[#2160ba] via-[#5d7cff] to-[#ecaa81]" />
                  <div className="flex h-full flex-col p-4">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#2160ba] dark:bg-white/8 dark:text-[#aab5ff]">
                            <Gift size={17} />
                          </span>
                          <div className="min-w-0">
                            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#f3f6fd] px-2.5 py-1 text-[10px] font-semibold text-[#2160ba] dark:bg-white/8 dark:text-[#aab5ff]">
                              <Tag size={11} />
                              <span className="truncate">
                                {locale === "en" ? item.categoryNameEn : item.categoryName}
                              </span>
                            </div>
                            <h3 className="mt-2 line-clamp-1 text-base font-bold leading-5 text-[#1f2638] dark:text-white">
                              {locale === "en" ? item.titleEn : item.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-2xl bg-[#ecaa81] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-[0_14px_30px_-18px_rgba(236,170,129,0.9)]">
                        {item.price}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#60708d] dark:text-[#a7b3c9]">
                      {locale === "en" ? item.summaryEn : item.summary}
                    </p>

                    <div className="mt-3 rounded-[20px] bg-[#f8fbff] p-3 dark:bg-[#11192c]">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b8aa8] dark:text-[#8fa0bf]">
                          {locale === "en" ? "Included Services" : "যা থাকবে"}
                        </p>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#2160ba] dark:bg-white/8 dark:text-[#aab5ff]">
                          {(locale === "en" ? item.includesEn : item.includes).length}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {(locale === "en" ? item.includesEn : item.includes).slice(0, 3).map((entry) => (
                          <div
                            key={entry}
                            className="flex items-start gap-2 text-xs leading-5 text-[#60708d] dark:text-[#a7b3c9]"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5d7cff]" />
                            <span className="line-clamp-1">{entry}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-2.5 text-sm font-semibold text-[#2160ba] dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                      >
                        <Pencil size={14} />
                        {locale === "en" ? "Edit" : "এডিট"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        <Trash2 size={14} />
                        {locale === "en" ? "Delete" : "ডিলিট"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PaginationControls pagination={paginatedRows.pagination} onPageChange={setPage} />
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1f2638] dark:text-white">
                  {locale === "en"
                    ? editingPackage
                      ? "Edit Package"
                      : "Add Package"
                    : editingPackage
                      ? "প্যাকেজ এডিট করুন"
                      : "প্যাকেজ যোগ করুন"}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#60708d] dark:bg-white/8 dark:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Category" : "ক্যাটাগরি"}</span>
                <select
                  value={formState.categoryId}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, categoryId: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                >
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Price" : "দাম"}</span>
                <input
                  value={formState.price}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, price: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4">
              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Title" : "টাইটেল"}</span>
                <input
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, title: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Summary" : "সামারি"}</span>
                <textarea
                  value={formState.summary}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, summary: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Includes" : "যা থাকবে"}</span>
                <textarea
                  value={formState.includesText}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, includesText: event.target.value }))
                  }
                  rows={5}
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={resetModal}
                className="rounded-2xl border border-[#d7e1f0] px-5 py-3 text-sm font-semibold text-[#60708d] dark:border-white/10 dark:text-[#a7b3c9]"
              >
                {locale === "en" ? "Cancel" : "বাতিল"}
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2160ba] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}
                {editingPackage
                  ? locale === "en"
                    ? "Save Package"
                    : "প্যাকেজ সেভ করুন"
                  : locale === "en"
                    ? "Create Package"
                    : "প্যাকেজ তৈরি করুন"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl dark:bg-[#161f36]">
            <h3 className="text-xl font-bold text-[#1f2638] dark:text-white">
              {locale === "en" ? "Delete this package?" : "এই প্যাকেজ ডিলিট করবেন?"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#60708d] dark:text-[#a7b3c9]">
              {locale === "en"
                ? "This package will disappear from the landing page immediately."
                : "এই প্যাকেজটি ল্যান্ডিং পেজ থেকে সঙ্গে সঙ্গে চলে যাবে।"}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-2xl border border-[#d7e1f0] px-5 py-3 text-sm font-semibold text-[#60708d] dark:border-white/10 dark:text-[#a7b3c9]"
              >
                {locale === "en" ? "Cancel" : "বাতিল"}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {locale === "en" ? "Delete" : "ডিলিট"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminSurface>
  );
}
