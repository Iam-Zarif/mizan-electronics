import { api } from "@/lib/api";

export type DashboardOverview = {
  topCards: {
    earnings: number;
    bookings: number;
    completedServices: number;
    users: number;
  };
  quickAlerts: {
    invoiceLinksReady: number;
    expiresIn24h: number;
  };
  terminateUsers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    joinedAt: string;
  }>;
  overviewMetrics: {
    verifiedUsers: string;
    pendingBookings: number;
    collectionRate: string;
  };
  charts: {
    monthlyRevenue: number[];
    weeklyProfit: number[];
  };
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  joinedAt: string;
  primaryAddress: string;
  completedServices: number;
  totalSpent: number;
};

export type AdminUsersResponse = {
  rows: AdminUserRow[];
  counts: {
    total: number;
    verified: number;
    unverified: number;
  };
  pagination: PaginationMeta;
};

export type AdminBookingRow = {
  _id: string;
  requestCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceSlug: string;
  serviceTitleBn: string;
  serviceTitleEn: string;
  categoryId: string;
  channel: "website" | "whatsapp" | "messenger" | "phone";
  status: "pending" | "ongoing" | "work_done" | "cancelled";
  paymentStatus: "paid" | "partial" | "unpaid";
  subtotal: number;
  amountPaid: number;
  due: number;
  completedServiceId?: string | null;
  invoiceNo?: string;
  requestedAt: string;
  addressBn: string;
  addressEn: string;
  noteBn: string;
  noteEn: string;
};

export type AdminBookingsResponse = {
  rows: AdminBookingRow[];
  pagination: PaginationMeta;
};

export type AdminInvoiceRow = {
  _id: string;
  invoiceNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressBn: string;
  addressEn: string;
  serviceTitleBn: string;
  serviceTitleEn: string;
  subtotal: number;
  amountPaid: number;
  due: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  completedAt: string;
  dueDate: string | null;
  noteBn: string;
  noteEn: string;
  items: Array<{
    descriptionBn: string;
    descriptionEn: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
};

export type AdminInvoicesResponse = {
  rows: AdminInvoiceRow[];
  stats: {
    totalInvoices: number;
    totalBilling: number;
    totalCollected: number;
    outstanding: number;
  };
  paymentSplit: {
    paid: { count: number; percent: number };
    partial: { count: number; percent: number };
    unpaid: { count: number; percent: number };
  };
  pagination: PaginationMeta;
};

export type CustomerPurchase = {
  invoiceNo: string;
  serviceTitleBn: string;
  serviceTitleEn: string;
  paymentStatus: "paid" | "partial" | "unpaid";
  amountPaid: number;
  subtotal: number;
  due: number;
  completedAt: string;
  items: Array<{
    descriptionBn: string;
    descriptionEn: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
};

export type AdminCustomerRow = {
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  addressBn: string;
  addressEn: string;
  purchases: CustomerPurchase[];
};

export type AdminCustomersResponse = {
  rows: AdminCustomerRow[];
  pagination: PaginationMeta;
};

export type AdminCompletedServiceCreateInput = {
  requestId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceItems: Array<{
    serviceSlug: string;
    qty: number;
  }>;
  invoiceNo: string;
  paymentStatus: "paid" | "partial" | "unpaid";
  amountPaid?: number;
  note?: string;
};

export type AdminNotificationRow = {
  _id: string;
  audience: "admin" | "user";
  type: string;
  tone: "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet" | "slate";
  sectionBn: string;
  sectionEn: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  actionBn: string;
  actionEn: string;
  actionHref: string;
  unread: boolean;
  archived: boolean;
  createdAtLabel: string;
  createdAt: string;
};

export type AdminNotificationsResponse = {
  rows: AdminNotificationRow[];
  counts: {
    total: number;
    unread: number;
  };
  pagination: PaginationMeta;
};

export type AdminAlertRow = {
  _id: string;
  level: "critical" | "high" | "medium" | "low";
  type: "database" | "github" | "website" | "security" | "system";
  tone: "red" | "amber" | "violet" | "sky" | "slate";
  titleBn: string;
  titleEn: string;
  sourceBn: string;
  sourceEn: string;
  summaryBn: string;
  summaryEn: string;
  actions: Array<"secure" | "block" | "logs" | "review" | "quarantine">;
  resolved: boolean;
  createdAtLabelBn: string;
  createdAtLabelEn: string;
  occurredAt: string;
};

export type AdminAlertsResponse = {
  rows: AdminAlertRow[];
  counts: {
    total: number;
    active: number;
    critical: number;
    github: number;
    website: number;
  };
  pagination: PaginationMeta;
};

export type AdminContactClickRow = {
  _id: string;
  source: "floating";
  channel: "phone" | "whatsapp" | "messenger";
  targetValue: string;
  pagePath: string;
  referrer: string;
  actorName: string;
  actorEmail: string;
  actorPhone: string;
  actorAddressLabel: string;
  actorAddress: string;
  actorArea: string;
  actorDistrict: string;
  actorDivision: string;
  latitude: number | null;
  longitude: number | null;
  ipAddress: string;
  userAgent: string;
  clickedAt: string;
};

export type AdminContactClicksResponse = {
  rows: AdminContactClickRow[];
  pagination: PaginationMeta;
};

export type AdminSettingsResponse = {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
  };
  businessContact: {
    supportPhone: string;
    supportAddress: string;
    savedProfileAddress: string;
  };
  billing: {
    billingEmail: string;
    bkashNumber: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
  };
  security: {
    emailVerified: boolean;
    provider: "local" | "google" | "facebook";
    role: "admin" | "user";
    activeDevices: number;
    savedAddresses: number;
    recentAccess: Array<{
      id: string;
      title: string;
      provider: "local" | "google" | "facebook";
      ipAddress: string;
      createdAt: string;
      isLatest: boolean;
    }>;
  };
};

export type ProfileService = {
  _id: string;
  invoiceNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressBn: string;
  addressEn: string;
  serviceSlug: string;
  serviceTitleBn: string;
  serviceTitleEn: string;
  status: "completed" | "upcoming" | "pending";
  paymentStatus: "paid" | "partial" | "unpaid";
  subtotal: number;
  amountPaid: number;
  due: number;
  dueDate: string;
  completedAt: string;
  noteBn: string;
  noteEn: string;
  items: Array<{
    descriptionBn: string;
    descriptionEn: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
};

export type ProfileServicesResponse = {
  rows: ProfileService[];
};

export type ProfileNotification = {
  _id: string;
  type: "service" | "billing" | "verification" | "security" | "booking" | "invoice" | "message" | "system";
  tone: "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet" | "slate";
  sectionBn: string;
  sectionEn: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  actionBn: string;
  actionEn: string;
  actionHref: string;
  unread: boolean;
  createdAtLabel: string;
  createdAt: string;
};

export type ProfileNotificationsResponse = {
  rows: ProfileNotification[];
};

export type PendingProfileReview = {
  completedServiceId: string;
  invoiceNo: string;
  serviceSlug: string;
  serviceTitleBn: string;
  serviceTitleEn: string;
  completedAt: string;
  amountPaid: number;
  subtotal: number;
};

export type PendingProfileReviewResponse = {
  row: PendingProfileReview | null;
};

export type ProfileReviewCreateInput = {
  completedServiceId: string;
  rating: number;
  message?: string;
};

export type PublicReviewRow = {
  _id: string;
  customerName: string;
  avatarUrl: string;
  customerLocationBn: string;
  customerLocationEn: string;
  serviceTitleBn: string;
  serviceTitleEn: string;
  rating: number;
  messageBn: string;
  messageEn: string;
  createdAt: string;
};

export type PublicReviewsResponse = {
  rows: PublicReviewRow[];
};

export type ProfileBookingCreateInput = {
  serviceSlug: string;
  addressId?: string;
  note?: string;
  channel?: "website" | "whatsapp" | "messenger" | "phone";
};

export type ProfilePackageBookingCreateInput = {
  packageId: string;
  note?: string;
  channel?: "whatsapp" | "messenger" | "phone" | "website";
};

export type AdminServiceRow = {
  _id: string;
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  price: string;
  images: string[];
  process: string[];
  updatedAt: string;
};

export type AdminServiceCategoryRow = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  services: AdminServiceRow[];
};

export type AdminServiceCategoryCreateInput = {
  name: string;
  description: string;
  image: string;
};

export type AdminServiceCategoryUpdateInput = AdminServiceCategoryCreateInput;

export type AdminPackageRow = {
  _id: string;
  categoryId: string;
  categoryName: string;
  categoryNameEn: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  price: string;
  includes: string[];
  includesEn: string[];
  updatedAt: string;
};

export type PublicPackagesResponse = {
  rows: AdminPackageRow[];
};

export type AdminPackagesResponse = {
  rows: AdminPackageRow[];
  counts: {
    totalPackages: number;
  };
  pagination: PaginationMeta;
};

export type AdminPackagePayload = {
  categoryId: string;
  title: string;
  summary: string;
  price: string;
  includes: string[];
};

export type AdminServicesResponse = {
  rows: AdminServiceCategoryRow[];
  counts: {
    totalCategories: number;
    totalServices: number;
  };
  pagination: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type AdminServiceUpdateInput = {
  categoryId: string;
  title: string;
  summary: string;
  price: string;
  images: string[];
  process: string[];
};

export type PublicServiceCategory = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
};

export type PublicServiceItem = {
  _id: string;
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  price: string;
  images: string[];
  process: string[];
};

export type PublicServiceCatalogResponse = {
  categories: PublicServiceCategory[];
  services: PublicServiceItem[];
};

const unwrap = async <T>(promise: Promise<{ data: { success?: boolean; data: T } }>) => {
  const { data } = await promise;
  return data.data;
};

export const getAdminOverview = () =>
  unwrap<DashboardOverview>(api.get("/admin/overview"));

export const getAdminSettings = () =>
  unwrap<AdminSettingsResponse>(api.get("/admin/settings"));

export const updateAdminSettings = async (payload: {
  supportPhone: string;
  supportAddress: string;
  billingEmail: string;
  bkashNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}) => {
  const { data } = await api.put("/admin/settings", payload);
  return data.data as AdminSettingsResponse;
};

export const getAdminUsers = (params: {
  search?: string;
  verification?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => unwrap<AdminUsersResponse>(api.get("/admin/users", { params }));

export const getAdminBookings = (params: {
  search?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => unwrap<AdminBookingsResponse>(api.get("/admin/bookings", { params }));

export const updateAdminBookingStatus = async (
  bookingId: string,
  payload: {
    status: "pending" | "ongoing" | "work_done" | "cancelled";
    paymentStatus?: "paid" | "partial" | "unpaid";
    subtotal?: number;
    amountPaid?: number;
  },
) => {
  const { data } = await api.patch(`/admin/bookings/${bookingId}/status`, payload);
  return data;
};

export const getAdminInvoices = (params?: {
  search?: string;
  paymentStatus?: "all" | "paid" | "partial" | "unpaid";
  sort?: string;
  page?: number;
  limit?: number;
}) => unwrap<AdminInvoicesResponse>(api.get("/admin/invoices", { params }));

export const getAdminCustomers = (params?: {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => unwrap<AdminCustomersResponse>(api.get("/admin/customers", { params }));

export const createAdminCompletedService = async (
  payload: AdminCompletedServiceCreateInput,
) => {
  const { data } = await api.post("/admin/customers", payload);
  return data;
};

export const getAdminNotifications = (params: {
  filter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => unwrap<AdminNotificationsResponse>(api.get("/admin/notifications", { params }));

export const getAdminContactClicks = (params?: {
  search?: string;
  channel?: "all" | "phone" | "whatsapp" | "messenger";
  sort?: "latest" | "oldest";
  page?: number;
  limit?: number;
}) => unwrap<AdminContactClicksResponse>(api.get("/admin/contact-clicks", { params }));

export const markAdminNotificationRead = async (notificationId: string) => {
  const { data } = await api.patch(`/admin/notifications/${notificationId}/read`);
  return data;
};

export const markAllAdminNotificationsRead = async () => {
  const { data } = await api.patch("/admin/notifications/read-all");
  return data;
};

export const deleteAdminNotification = async (notificationId: string) => {
  const { data } = await api.delete(`/admin/notifications/${notificationId}`);
  return data;
};

export const getAdminAlerts = (params?: {
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => unwrap<AdminAlertsResponse>(api.get("/admin/alerts", { params }));

export const getAdminServices = (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) =>
  unwrap<AdminServicesResponse>(api.get("/services/admin", { params }));

export const getPublicServiceCatalog = () =>
  unwrap<PublicServiceCatalogResponse>(api.get("/services/catalog"));

export const getLandingPackages = () =>
  unwrap<PublicPackagesResponse>(api.get("/services/packages"));

export const getPublicReviews = () =>
  unwrap<PublicReviewsResponse>(api.get("/services/reviews"));

export const getAdminPackages = (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) =>
  unwrap<AdminPackagesResponse>(api.get("/services/packages/admin", { params }));

export const createAdminCategory = async (payload: AdminServiceCategoryCreateInput) => {
  const { data } = await api.post("/services/categories", payload);
  return data;
};

export const updateAdminCategory = async (
  categoryId: string,
  payload: AdminServiceCategoryUpdateInput,
) => {
  const { data } = await api.patch(`/services/categories/${categoryId}`, payload);
  return data;
};

export const deleteAdminCategory = async (categoryId: string) => {
  const { data } = await api.delete(`/services/categories/${categoryId}`);
  return data;
};

export const updateAdminService = async (
  serviceId: string,
  payload: AdminServiceUpdateInput,
) => {
  const { data } = await api.patch(`/services/${serviceId}`, payload);
  return data;
};

export const deleteAdminService = async (serviceId: string) => {
  const { data } = await api.delete(`/services/${serviceId}`);
  return data;
};

export const createAdminPackage = async (payload: AdminPackagePayload) => {
  const { data } = await api.post("/services/packages", payload);
  return data;
};

export const updateAdminPackage = async (packageId: string, payload: AdminPackagePayload) => {
  const { data } = await api.patch(`/services/packages/${packageId}`, payload);
  return data;
};

export const deleteAdminPackage = async (packageId: string) => {
  const { data } = await api.delete(`/services/packages/${packageId}`);
  return data;
};

export const getProfileServices = () =>
  unwrap<ProfileServicesResponse>(api.get("/profile/services"));

export const getProfileNotifications = () =>
  unwrap<ProfileNotificationsResponse>(api.get("/profile/notifications"));

export const getPendingProfileReview = (completedServiceId?: string) =>
  unwrap<PendingProfileReviewResponse>(
    api.get("/profile/reviews/pending", {
      params: completedServiceId ? { completedServiceId } : undefined,
    }),
  );

export const dismissPendingProfileReview = async (completedServiceId: string) => {
  const { data } = await api.post("/profile/reviews/dismiss", { completedServiceId });
  return data;
};

export const submitProfileReview = async (payload: ProfileReviewCreateInput) => {
  const { data } = await api.post("/profile/reviews", payload);
  return data;
};

export const markProfileNotificationRead = async (notificationId: string) => {
  const { data } = await api.patch(`/profile/notifications/${notificationId}/read`);
  return data;
};

export const markAllProfileNotificationsRead = async () => {
  const { data } = await api.patch("/profile/notifications/read-all");
  return data;
};

export const deleteProfileNotification = async (notificationId: string) => {
  const { data } = await api.delete(`/profile/notifications/${notificationId}`);
  return data;
};

export const createProfileBooking = async (payload: ProfileBookingCreateInput) => {
  const { data } = await api.post("/profile/bookings", payload);
  return data;
};

export const createProfilePackageBooking = async (
  payload: ProfilePackageBookingCreateInput,
) => {
  const { data } = await api.post("/profile/package-bookings", payload);
  return data;
};
