"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BadgePlus,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  FileText,
  ListChecks,
  LoaderCircle,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  Wrench,
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
import {
  createAdminCategory,
  deleteAdminCategory,
  deleteAdminService,
  getAdminServices,
  updateAdminCategory,
  updateAdminService,
  type AdminServiceCategoryCreateInput,
  type AdminServiceCategoryUpdateInput,
  type AdminServiceCategoryRow,
  type AdminServiceRow,
  type AdminServiceUpdateInput,
} from "@/lib/dashboard-api";
import { getErrorMessage } from "@/lib/api";
import { dispatchAdminSidebarRefresh } from "@/lib/admin-sidebar-events";
import { useApiQuery } from "@/hooks/use-api-query";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import { useLanguage } from "@/lib/i18n";

type EditFormState = {
  categoryId: string;
  title: string;
  summary: string;
  price: string;
  images: string[];
  processText: string;
};

type CategoryFormState = {
  name: string;
  description: string;
  image: string;
};

const CLOUDINARY_CLOUD_NAME = "dj5olrziv";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

const buildEditState = (service: AdminServiceRow): EditFormState => ({
  categoryId: service.categoryId,
  title: service.title,
  summary: service.summary,
  price: service.price,
  images: service.images,
  processText: service.process.join("\n"),
});

const normalizeMultiline = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export default function DashboardServicesPage() {
  const { locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminServiceCategoryRow | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [categoryState, setCategoryState] = useState<CategoryFormState>({
    name: "",
    description: "",
    image: "",
  });
  const [categoryDeleteTarget, setCategoryDeleteTarget] =
    useState<AdminServiceCategoryRow | null>(null);
  const [editingService, setEditingService] = useState<AdminServiceRow | null>(null);
  const [editState, setEditState] = useState<EditFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminServiceRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [isCategoryDeleting, setIsCategoryDeleting] = useState(false);
  const [isUploadingCategoryImage, setIsUploadingCategoryImage] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { data, isLoading, error, refresh, setData } = useApiQuery(
    () => getAdminServices({ page: 1, limit: 100 }),
    [],
  );

  useEffect(() => {
    if (!actionSuccess) return;
    const timer = window.setTimeout(() => setActionSuccess(null), 2400);
    return () => window.clearTimeout(timer);
  }, [actionSuccess]);

  useEffect(() => {
    if (!data?.rows.length) return;
    setOpenCategories((current) => {
      if (current.length) return current;
      return [data.rows[0].id];
    });
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredData = useMemo(() => {
    if (!data) return null;

    const keyword = search.trim().toLowerCase();
    if (!keyword) return data;

    const rows = data.rows
      .map((category) => {
        const categoryMatch = [
          category.name,
          category.nameEn,
          category.description,
        ].some((value) => value.toLowerCase().includes(keyword));

        if (categoryMatch) {
          return category;
        }

        const services = category.services.filter((service) =>
          [
            service.title,
            service.titleEn,
            service.summary,
            service.summaryEn,
            service.price,
            service.slug,
          ].some((value) => value.toLowerCase().includes(keyword)),
        );

        return {
          ...category,
          services,
        };
      })
      .filter((category) => category.services.length > 0);

    return {
      rows,
      counts: {
        totalCategories: rows.length,
        totalServices: rows.reduce((sum, category) => sum + category.services.length, 0),
      },
    };
  }, [data, search]);

  const categoryOptions = useMemo(
    () =>
      (data?.rows ?? []).map((category) => ({
        id: category.id,
        label: locale === "en" ? category.nameEn : category.name,
      })),
    [data, locale],
  );

  const paginatedRows = useMemo(() => {
    const rows = filteredData?.rows ?? [];
    const totalItems = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / 12));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * 12;

    return {
      rows: rows.slice(start, start + 12),
      pagination: {
        page: safePage,
        pageSize: 12,
        totalItems,
        totalPages,
        hasPreviousPage: safePage > 1,
        hasNextPage: safePage < totalPages,
      },
    };
  }, [filteredData, page]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((current) =>
      current.includes(categoryId)
        ? []
        : [categoryId],
    );
  };

  const openImagePreview = (src: string, alt: string) => {
    setPreviewImage({ src, alt });
  };

  const openEditModal = (service: AdminServiceRow) => {
    setActionError(null);
    setActionSuccess(null);
    setEditingService(service);
    setEditState(buildEditState(service));
  };

  const closeEditModal = () => {
    if (isSaving) return;
    setEditingService(null);
    setEditState(null);
  };

  const closeCategoryModal = () => {
    if (isCategorySaving || isUploadingCategoryImage) return;
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryState({
      name: "",
      description: "",
      image: "",
    });
  };

  const openCategoryModal = (category?: AdminServiceCategoryRow) => {
    setActionError(null);
    setActionSuccess(null);
    setEditingCategory(category ?? null);
    setCategoryState(
      category
        ? {
            name: category.name,
            description: category.description,
            image: category.image,
          }
        : {
            name: "",
            description: "",
            image: "",
          },
    );
    setIsCategoryModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingService || !editState) return;

    const payload: AdminServiceUpdateInput = {
      categoryId: editState.categoryId,
      title: editState.title.trim(),
      summary: editState.summary.trim(),
      price: editState.price.trim(),
      images: editState.images,
      process: normalizeMultiline(editState.processText),
    };

    setIsSaving(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const response = await updateAdminService(editingService._id, payload);
      const updatedService = response.data as AdminServiceRow;

      setData((current) => {
        if (!current) return current;

        const nextRows = current.rows
          .map((category) => ({
            ...category,
            services: category.services.filter((service) => service._id !== editingService._id),
          }))
          .map((category) =>
            category.id === updatedService.categoryId
              ? { ...category, services: [...category.services, updatedService] }
              : category,
          )
          .map((category) => ({
            ...category,
            services: [...category.services].sort((a, b) => a.title.localeCompare(b.title)),
          }));

        return {
          ...current,
          rows: nextRows,
          pagination: current.pagination,
        };
      });

      setActionSuccess(
        locale === "en" ? "Service updated successfully." : "সার্ভিস সফলভাবে আপডেট হয়েছে।",
      );
      dispatchAdminSidebarRefresh();
      setEditingService(null);
      setEditState(null);
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
      await deleteAdminService(deleteTarget._id);
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          rows: current.rows.map((category) => ({
            ...category,
            services: category.services.filter((service) => service._id !== deleteTarget._id),
          })),
          counts: {
            ...current.counts,
            totalServices: Math.max(current.counts.totalServices - 1, 0),
          },
          pagination: current.pagination,
        };
      });
      setDeleteTarget(null);
      setActionSuccess(
        locale === "en" ? "Service deleted successfully." : "সার্ভিস সফলভাবে ডিলিট হয়েছে।",
      );
      dispatchAdminSidebarRefresh();
    } catch (nextError) {
      setActionError(getErrorMessage(nextError));
    } finally {
      setIsDeleting(false);
    }
  };

  const uploadCloudinaryImages = async (files: FileList | null) => {
    if (!files?.length) return [];

    return Promise.all(
      Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = (await response.json()) as { secure_url?: string };
        if (!response.ok || !data.secure_url) {
          throw new Error("Image upload failed");
        }

        return data.secure_url;
      }),
    );
  };

  const handleSaveCategory = async () => {
    const payload: AdminServiceCategoryCreateInput | AdminServiceCategoryUpdateInput = {
      name: categoryState.name.trim(),
      description: categoryState.description.trim(),
      image: categoryState.image.trim(),
    };

    setIsCategorySaving(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      if (editingCategory) {
        const response = await updateAdminCategory(editingCategory.id, payload);
        const updatedCategory = response.data as AdminServiceCategoryRow;

        setData((current) => {
          if (!current) return current;
          return {
            ...current,
            rows: current.rows.map((category) =>
              category.id === editingCategory.id
                ? { ...category, ...updatedCategory, services: category.services }
                : category,
            ),
            pagination: current.pagination,
          };
        });
        setOpenCategories([editingCategory.id]);
      } else {
        const response = await createAdminCategory(payload);
        const createdCategory = response.data as AdminServiceCategoryRow;

        setData((current) => {
          if (!current) return current;
          return {
            ...current,
            rows: [...current.rows, createdCategory],
            counts: {
              ...current.counts,
              totalCategories: current.counts.totalCategories + 1,
            },
            pagination: current.pagination,
          };
        });
        setOpenCategories([createdCategory.id]);
      }
      closeCategoryModal();
      setActionSuccess(
        editingCategory
          ? locale === "en"
            ? "Category updated successfully."
            : "ক্যাটাগরি সফলভাবে আপডেট হয়েছে।"
          : locale === "en"
            ? "Category created successfully."
            : "ক্যাটাগরি সফলভাবে তৈরি হয়েছে।",
      );
      dispatchAdminSidebarRefresh();
    } catch (nextError) {
      setActionError(getErrorMessage(nextError));
    } finally {
      setIsCategorySaving(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length || !editState) return;

    setIsUploadingImages(true);
    setActionError(null);

    try {
      const uploadedUrls = await uploadCloudinaryImages(files);

      setEditState((current) =>
        current
          ? {
              ...current,
              images: [...current.images, ...uploadedUrls],
            }
          : current,
      );
    } catch (nextError) {
      setActionError(getErrorMessage(nextError));
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleCategoryImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    setIsUploadingCategoryImage(true);
    setActionError(null);

    try {
      const [uploadedUrl] = await uploadCloudinaryImages(files);
      if (!uploadedUrl) return;
      setCategoryState((current) => ({
        ...current,
        image: uploadedUrl,
      }));
    } catch (nextError) {
      setActionError(getErrorMessage(nextError));
    } finally {
      setIsUploadingCategoryImage(false);
    }
  };

  const removeImage = (imageUrl: string) => {
    setEditState((current) =>
      current
        ? {
            ...current,
            images: current.images.filter((item) => item !== imageUrl),
          }
        : current,
    );
  };

  const handleDeleteCategory = async () => {
    if (!categoryDeleteTarget) return;

    setIsCategoryDeleting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const deletedServices = categoryDeleteTarget.services.length;
      await deleteAdminCategory(categoryDeleteTarget.id);
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          rows: current.rows.filter((category) => category.id !== categoryDeleteTarget.id),
          counts: {
            totalCategories: Math.max(current.counts.totalCategories - 1, 0),
            totalServices: Math.max(current.counts.totalServices - deletedServices, 0),
          },
          pagination: current.pagination,
        };
      });
      setOpenCategories((current) =>
        current.filter((categoryId) => categoryId !== categoryDeleteTarget.id),
      );
      setCategoryDeleteTarget(null);
      setActionSuccess(
        locale === "en"
          ? "Category deleted successfully."
          : "ক্যাটাগরি সফলভাবে ডিলিট হয়েছে।",
      );
      dispatchAdminSidebarRefresh();
    } catch (nextError) {
      setActionError(getErrorMessage(nextError));
    } finally {
      setIsCategoryDeleting(false);
    }
  };

  return (
    <AdminSurface>
      <SuccessToast message={actionSuccess} />
      <AdminPageHeader titleBn="মোট সার্ভিস" titleEn="Total Services" />

      {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
      {!isLoading && error ? (
        <ApiErrorState
          title={locale === "en" ? "Services failed to load" : "সার্ভিস ডেটা লোড হয়নি"}
          description={error}
          onRetry={() => void refresh()}
        />
      ) : null}

      {!isLoading && !error && filteredData ? (
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
                      ? "Search instantly by category, title, summary, price or slug"
                      : "ক্যাটাগরি, টাইটেল, সামারি, দাম বা স্লাগ দিয়ে সাথে সাথে সার্চ করুন"
                  }
                  className="w-full bg-transparent outline-none placeholder:text-[#8a96ad] dark:placeholder:text-[#70809c]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-4 py-2 text-sm font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                  <Wrench size={14} />
                  {locale === "en" ? "Services" : "সার্ভিস"}: {filteredData.counts.totalServices}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-4 py-2 text-sm font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                  <BadgePlus size={14} />
                  {locale === "en" ? "Categories" : "ক্যাটাগরি"}: {filteredData.counts.totalCategories}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setActionSuccess(null);
                    openCategoryModal();
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#2160ba] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Plus size={16} />
                  {locale === "en" ? "Add Category" : "ক্যাটাগরি যোগ করুন"}
                </button>
              </div>
            </div>

            {actionError ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {actionError}
              </p>
            ) : null}
          </div>

          {filteredData.rows.length === 0 ? (
            <ApiEmptyState
              title={
                locale === "en" ? "No services found" : "কোনো সার্ভিস পাওয়া যায়নি"
              }
              description={
                locale === "en"
                  ? "Create a category or change the search keyword to load services."
                  : "ক্যাটাগরি তৈরি করুন বা সার্চ পরিবর্তন করে সার্ভিস লোড করুন।"
              }
            />
          ) : (
            <div className="space-y-3">
              {paginatedRows.rows.map((category: AdminServiceCategoryRow) => {
                const isOpen = openCategories.includes(category.id);
                return (
                  <div
                    key={category.id}
                    className="rounded-[24px] border border-[#e8edf7] bg-white shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
                  >
                    <div className="flex items-center gap-4 p-5">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="flex min-w-0 flex-1 items-center gap-4 text-left"
                      >
                        <div
                          className="relative h-18 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#edf3ff]"
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            openImagePreview(category.image, locale === "en" ? category.nameEn : category.name);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              openImagePreview(
                                category.image,
                                locale === "en" ? category.nameEn : category.name,
                              );
                            }
                          }}
                        >
                          <Image
                            src={getOptimizedCloudinaryUrl(category.image, {
                              width: 192,
                              height: 144,
                              crop: "fill",
                            })}
                            alt={locale === "en" ? category.nameEn : category.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                            {locale === "en" ? category.nameEn : category.name}
                          </p>
                          <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                            {category.description}
                          </p>
                        </div>
                      </button>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-[#4f6bff] dark:text-[#aab5ff]">
                          {category.services.length} {locale === "en" ? "services" : "সার্ভিস"}
                        </p>
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openCategoryModal(category)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#2160ba] dark:bg-white/8 dark:text-[#aab5ff]"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryDeleteTarget(category)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
                            aria-label={
                              locale === "en"
                                ? isOpen
                                  ? "Collapse category"
                                  : "Expand category"
                                : isOpen
                                  ? "ক্যাটাগরি বন্ধ করুন"
                                  : "ক্যাটাগরি খুলুন"
                            }
                          >
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isOpen ? (
                      <div className="border-t border-[#edf1f7] px-5 pb-5 pt-4 dark:border-white/10">
                        <div className="grid gap-3 md:grid-cols-2">
                          {category.services.map((service) => (
                            <div
                              key={service._id}
                              className="overflow-hidden rounded-[22px] border border-[#edf1f7] bg-[#fbfdff] dark:border-white/10 dark:bg-[#11192c]"
                            >
                              <div className="relative h-72 w-full overflow-hidden bg-[#edf3ff] dark:bg-[#0f172a]">
                                {service.images[0] ? (
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(service)}
                                    className="group relative block h-full w-full text-left"
                                  >
                                    <Image
                                      src={getOptimizedCloudinaryUrl(service.images[0], {
                                        width: 720,
                                        height: 420,
                                        crop: "fill",
                                      })}
                                      alt={locale === "en" ? service.titleEn : service.title}
                                      fill
                                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/55 via-[#0f172a]/15 to-transparent" />
                                    <span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-[#2160ba] shadow-sm transition group-hover:bg-white">
                                      <Pencil size={13} />
                                      {locale === "en" ? "Edit" : "এডিট"}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(service)}
                                    className="flex h-full w-full items-center justify-center gap-2 bg-[#edf3ff] text-sm font-semibold text-[#2160ba] dark:bg-[#11192c] dark:text-[#aab5ff]"
                                  >
                                    <Pencil size={16} />
                                    {locale === "en" ? "Edit image and details" : "ইমেজ ও ডিটেইলস এডিট করুন"}
                                  </button>
                                )}
                              </div>

                              <div className="p-4">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#2160ba] dark:bg-white/8 dark:text-[#aab5ff]">
                                      <Wrench size={15} />
                                    </div>
                                    <p className="text-base font-bold text-[#1f2638] dark:text-white">
                                      {locale === "en" ? service.titleEn : service.title}
                                    </p>
                                  </div>
                                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#2160ba] dark:bg-white/8 dark:text-[#aab5ff]">
                                    <ReceiptText size={14} />
                                    <span>{service.price}</span>
                                  </div>
                                  <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#60708d] dark:text-[#a7b3c9]">
                                    <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#f3f6fd] text-[#60708d] dark:bg-white/8 dark:text-[#a7b3c9]">
                                      <FileText size={14} />
                                    </div>
                                    <p>
                                      {locale === "en" ? service.summaryEn : service.summary}
                                    </p>
                                  </div>
                                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8aa8] dark:text-[#8fa0bf]">
                                    <ListChecks size={14} />
                                    <span>{locale === "en" ? "Process" : "প্রসেস"}</span>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {service.process.map((step) => (
                                      <span
                                        key={step}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f6fd] px-3 py-1 text-xs font-medium text-[#60708d] dark:bg-white/8 dark:text-[#a7b3c9]"
                                      >
                                        <CircleDashed size={12} />
                                        <span>{step}</span>
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setDeleteTarget(service)}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                                  >
                                    <Trash2 size={15} />
                                    {locale === "en" ? "Delete" : "ডিলিট"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          <PaginationControls pagination={paginatedRows.pagination} onPageChange={setPage} />
        </div>
      ) : null}

      {editingService && editState ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Edit Service" : "সার্ভিস এডিট করুন"}
                </h3>
                <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                  {editingService.slug}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#60708d] dark:bg-white/8 dark:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Category" : "ক্যাটাগরি"}</span>
                <select
                  value={editState.categoryId}
                  onChange={(event) =>
                    setEditState((current) =>
                      current ? { ...current, categoryId: event.target.value } : current,
                    )
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
                  value={editState.price}
                  onChange={(event) =>
                    setEditState((current) =>
                      current ? { ...current, price: event.target.value } : current,
                    )
                  }
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Title" : "টাইটেল"}</span>
                <input
                  value={editState.title}
                  onChange={(event) =>
                    setEditState((current) =>
                      current ? { ...current, title: event.target.value } : current,
                    )
                  }
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Summary" : "সামারি"}</span>
                <textarea
                  value={editState.summary}
                  onChange={(event) =>
                    setEditState((current) =>
                      current ? { ...current, summary: event.target.value } : current,
                    )
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Service Images" : "সার্ভিস ইমেজ"}</span>
                <div className="rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-[#11192c]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {editState.images.map((imageUrl) => (
                      <div
                        key={imageUrl}
                        className="overflow-hidden rounded-2xl border border-[#d7e1f0] bg-white dark:border-white/10 dark:bg-[#161f36]"
                      >
                        <div
                          className="relative h-32 w-full cursor-zoom-in"
                          role="button"
                          tabIndex={0}
                          onClick={() => openImagePreview(imageUrl, "Service image")}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openImagePreview(imageUrl, "Service image");
                            }
                          }}
                        >
                          <Image
                            src={imageUrl}
                            alt="Service image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 180px"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-2">
                          <span className="truncate text-xs text-[#60708d] dark:text-[#a7b3c9]">
                            {locale === "en" ? "Uploaded image" : "আপলোড করা ইমেজ"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage(imageUrl)}
                            className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
                          >
                            <X size={12} />
                            {locale === "en" ? "Remove" : "মুছুন"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#d7e1f0] bg-white px-4 py-3 text-sm font-semibold text-[#2160ba] dark:border-white/10 dark:bg-[#161f36] dark:text-white">
                    {isUploadingImages ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    {isUploadingImages
                      ? locale === "en"
                        ? "Uploading..."
                        : "আপলোড হচ্ছে..."
                      : locale === "en"
                        ? "Upload images"
                        : "ইমেজ আপলোড করুন"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => void handleImageUpload(event.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Process Steps" : "প্রসেস স্টেপ"}</span>
                <textarea
                  value={editState.processText}
                  onChange={(event) =>
                    setEditState((current) =>
                      current ? { ...current, processText: event.target.value } : current,
                    )
                  }
                  rows={5}
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
                <p className="text-xs text-[#7f8ba3]">
                  {locale === "en"
                    ? "One process step per line"
                    : "প্রতি লাইনে একটি প্রসেস স্টেপ দিন"}
                </p>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-2xl border border-[#d7e1f0] px-5 py-3 text-sm font-semibold text-[#60708d] dark:border-white/10 dark:text-[#a7b3c9]"
              >
                {locale === "en" ? "Cancel" : "বাতিল"}
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="rounded-2xl bg-[#2160ba] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving
                  ? locale === "en"
                    ? "Saving..."
                    : "সেভ হচ্ছে..."
                  : locale === "en"
                    ? "Save Changes"
                    : "পরিবর্তন সেভ করুন"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isCategoryModalOpen ? (
        <div className="fixed inset-0 z-[92] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1f2638] dark:text-white">
                  {editingCategory
                    ? locale === "en"
                      ? "Edit Category"
                      : "ক্যাটাগরি এডিট করুন"
                    : locale === "en"
                      ? "Add Category"
                      : "ক্যাটাগরি যোগ করুন"}
                </h3>
                <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                  {locale === "en"
                    ? "Admin enters Bangla fields only. Other locale fallback is managed automatically."
                    : "অ্যাডমিন শুধু বাংলা ফিল্ড দেবেন। অন্য ল্যাঙ্গুয়েজ ফ্যালব্যাক অটোমেটিক ম্যানেজ হবে।"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCategoryModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#60708d] dark:bg-white/8 dark:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Category Title" : "ক্যাটাগরির নাম"}</span>
                <input
                  value={categoryState.name}
                  onChange={(event) =>
                    setCategoryState((current) => ({ ...current, name: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Category Description" : "ক্যাটাগরির বর্ণনা"}</span>
                <textarea
                  value={categoryState.description}
                  onChange={(event) =>
                    setCategoryState((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <div className="space-y-2 text-sm font-medium text-[#33415c] dark:text-[#d8e1f1]">
                <span>{locale === "en" ? "Category Image" : "ক্যাটাগরি ইমেজ"}</span>
                <div className="rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-[#11192c]">
                  {categoryState.image ? (
                    <div className="overflow-hidden rounded-2xl border border-[#d7e1f0] bg-white dark:border-white/10 dark:bg-[#161f36]">
                      <div
                        className="relative h-44 w-full cursor-zoom-in"
                        role="button"
                        tabIndex={0}
                        onClick={() => openImagePreview(categoryState.image, "Category image")}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openImagePreview(categoryState.image, "Category image");
                          }
                        }}
                      >
                        <Image
                          src={getOptimizedCloudinaryUrl(categoryState.image, {
                            width: 1280,
                            height: 880,
                            crop: "fill",
                          })}
                          alt="Category image"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 640px"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#d7e1f0] bg-white px-4 py-3 text-sm font-semibold text-[#2160ba] dark:border-white/10 dark:bg-[#161f36] dark:text-white">
                      {isUploadingCategoryImage ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Plus size={16} />
                      )}
                      {isUploadingCategoryImage
                        ? locale === "en"
                          ? "Uploading..."
                          : "আপলোড হচ্ছে..."
                        : locale === "en"
                          ? "Upload category image"
                          : "ক্যাটাগরি ইমেজ আপলোড করুন"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => void handleCategoryImageUpload(event.target.files)}
                        className="hidden"
                      />
                    </label>

                    {categoryState.image ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryState((current) => ({
                            ...current,
                            image: "",
                          }))
                        }
                        className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                      >
                        <Trash2 size={15} />
                        {locale === "en" ? "Remove image" : "ইমেজ মুছুন"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeCategoryModal}
                className="rounded-2xl border border-[#d7e1f0] px-5 py-3 text-sm font-semibold text-[#60708d] dark:border-white/10 dark:text-[#a7b3c9]"
              >
                {locale === "en" ? "Cancel" : "বাতিল"}
              </button>
              <button
                type="button"
                onClick={() => void handleSaveCategory()}
                disabled={isCategorySaving || isUploadingCategoryImage}
                className="rounded-2xl bg-[#2160ba] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCategorySaving
                  ? locale === "en"
                    ? "Saving..."
                    : "সেভ হচ্ছে..."
                  : editingCategory
                    ? locale === "en"
                      ? "Save Category"
                      : "ক্যাটাগরি সেভ করুন"
                    : locale === "en"
                      ? "Create Category"
                      : "ক্যাটাগরি তৈরি করুন"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewImage ? (
        <div className="fixed inset-0 z-[98] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl rounded-[28px] bg-white p-4 shadow-2xl dark:bg-[#161f36]">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#60708d] dark:bg-white/8 dark:text-white"
            >
              <X size={18} />
            </button>
            <div className="relative h-[72vh] w-full overflow-hidden rounded-[22px] bg-[#f8fbff] dark:bg-[#11192c]">
              <Image
                src={getOptimizedCloudinaryUrl(previewImage.src, {
                  width: 1800,
                  height: 1800,
                  crop: "fit",
                })}
                alt={previewImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl dark:bg-[#161f36]">
            <h3 className="text-xl font-bold text-[#1f2638] dark:text-white">
              {locale === "en" ? "Delete Service" : "সার্ভিস ডিলিট করুন"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#60708d] dark:text-[#a7b3c9]">
              {locale === "en"
                ? `Delete ${deleteTarget.titleEn}? This removes it from the service catalog.`
                : `${deleteTarget.title} ডিলিট করলে এটি সার্ভিস ক্যাটালগ থেকে মুছে যাবে।`}
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
                className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting
                  ? locale === "en"
                    ? "Deleting..."
                    : "ডিলিট হচ্ছে..."
                  : locale === "en"
                    ? "Delete"
                    : "ডিলিট"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {categoryDeleteTarget ? (
        <div className="fixed inset-0 z-[96] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl dark:bg-[#161f36]">
            <h3 className="text-xl font-bold text-[#1f2638] dark:text-white">
              {locale === "en" ? "Delete Category" : "ক্যাটাগরি ডিলিট করুন"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#60708d] dark:text-[#a7b3c9]">
              {locale === "en"
                ? `This will delete the category and its ${categoryDeleteTarget.services.length} linked services.`
                : `এটি ক্যাটাগরি এবং এর ${categoryDeleteTarget.services.length}টি যুক্ত সার্ভিস ডিলিট করবে।`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCategoryDeleteTarget(null)}
                className="rounded-2xl border border-[#d7e1f0] px-5 py-3 text-sm font-semibold text-[#60708d] dark:border-white/10 dark:text-[#a7b3c9]"
              >
                {locale === "en" ? "Cancel" : "বাতিল"}
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteCategory()}
                disabled={isCategoryDeleting}
                className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCategoryDeleting
                  ? locale === "en"
                    ? "Deleting..."
                    : "ডিলিট হচ্ছে..."
                  : locale === "en"
                    ? "Delete Category"
                    : "ক্যাটাগরি ডিলিট করুন"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminSurface>
  );
}
