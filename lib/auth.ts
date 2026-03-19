export type Avatar = {
  url: string | null;
  publicId: string | null;
};

export type Address = {
  _id: string;
  label: string;
  type: "home" | "office" | "other";
  division: string;
  district: string;
  area: string;
  address: string;
  phone: string;
  mapLink: string;
  payments: string[];
  isDefault: boolean;
};

export type AddressFormInput = {
  label: string;
  type: "home" | "office" | "other";
  division: string;
  district: string;
  area: string;
  address: string;
  phone: string;
  mapLink: string;
  isDefault: boolean;
};

export type AuthUser = {
  id: string;
  f_name: string;
  email: string;
  phone: string | null;
  avatar: Avatar | null;
  addresses: Address[];
  isVerified?: boolean;
  themePreference?: "light" | "dark";
  languagePreference?: "bn" | "en";
};

export type ProfileFormInput = {
  f_name: string;
  phone: string;
};

export const ADMIN_EMAIL = "mizan.electronics.store@gmail.com";

export const isAdminUser = (
  user: Pick<AuthUser, "email" | "isVerified"> | null | undefined,
) =>
  Boolean(
    user?.isVerified &&
      user.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase(),
  );

export const normalizeUser = (input: Record<string, unknown>): AuthUser => ({
  id: String(input.id ?? input._id ?? ""),
  f_name: String(input.f_name ?? ""),
  email: String(input.email ?? ""),
  phone: typeof input.phone === "string" ? input.phone : null,
  avatar:
    input.avatar && typeof input.avatar === "object"
      ? {
          url:
            typeof (input.avatar as Avatar).url === "string"
              ? (input.avatar as Avatar).url
              : null,
          publicId:
            typeof (input.avatar as Avatar).publicId === "string"
              ? (input.avatar as Avatar).publicId
              : null,
        }
      : null,
  addresses: Array.isArray(input.addresses)
    ? (input.addresses as Address[]).map((address) => ({
        _id: String(address._id ?? ""),
        label: String(address.label ?? ""),
        type:
          address.type === "office" || address.type === "other"
            ? address.type
            : "home",
        division: String(address.division ?? ""),
        district: String(address.district ?? ""),
        area: String(address.area ?? ""),
        address: String(address.address ?? ""),
        phone: String(address.phone ?? ""),
        mapLink: String(address.mapLink ?? ""),
        payments: Array.isArray(address.payments) ? address.payments : [],
        isDefault: Boolean(address.isDefault),
      }))
    : [],
  isVerified: Boolean(input.isVerified),
  themePreference:
    input.themePreference === "dark" ? "dark" : "light",
  languagePreference:
    input.languagePreference === "en" ? "en" : "bn",
});
