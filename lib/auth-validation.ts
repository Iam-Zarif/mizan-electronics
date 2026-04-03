import { z } from "zod";

const validBangladeshPrefixes = new Set([
  "013",
  "014",
  "015",
  "016",
  "017",
  "018",
  "019",
]);

export const normalizeBangladeshPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("8801")) {
    return `0${digits.slice(3)}`;
  }

  if (digits.startsWith("01")) {
    return digits;
  }

  return digits;
};

export const bangladeshPhoneSchema = z.string().superRefine((value, ctx) => {
  const normalized = normalizeBangladeshPhone(value);

  if (!normalized) {
    ctx.addIssue({
      code: "custom",
      message: "ফোন নম্বর দিতে হবে",
    });
    return;
  }

  if (!/^01\d{9}$/.test(normalized)) {
    ctx.addIssue({
      code: "custom",
      message: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন",
    });
    return;
  }

  if (!validBangladeshPrefixes.has(normalized.slice(0, 3))) {
    ctx.addIssue({
      code: "custom",
      message: "এই বাংলাদেশি অপারেটর কোড সমর্থিত নয়",
    });
  }
});

const providerDomains = new Map<string, string[]>([
  ["gmail", ["gmail.com"]],
  ["icloud", ["icloud.com", "me.com"]],
  ["apple", ["icloud.com", "me.com"]],
  ["outlook", ["outlook.com", "hotmail.com", "live.com"]],
  ["hotmail", ["hotmail.com", "outlook.com", "live.com"]],
  ["yahoo", ["yahoo.com"]],
  ["webmail", ["webmail.com"]],
]);

export const emailSchema = z
  .string()
  .trim()
  .min(1, "ইমেইল ঠিকানা দিতে হবে")
  .superRefine((value, ctx) => {
    const normalized = value.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      ctx.addIssue({
        code: "custom",
        message: "সঠিক ইমেইল ঠিকানা দিন",
      });
      return;
    }

    const [, domain = ""] = normalized.split("@");
    const segments = domain.split(".");

    if (segments.length < 2 || segments.some((segment) => !segment.trim())) {
      ctx.addIssue({
        code: "custom",
        message: "সঠিক ইমেইল ঠিকানা দিন",
      });
      return;
    }

    const tld = segments.at(-1) ?? "";
    if (!/^[a-z]{2,24}$/.test(tld)) {
      ctx.addIssue({
        code: "custom",
        message: "সঠিক ইমেইল ঠিকানা দিন",
      });
      return;
    }

    const providerKey = segments[0];
    const allowedDomains = providerDomains.get(providerKey);

    if (allowedDomains && !allowedDomains.includes(domain)) {
      ctx.addIssue({
        code: "custom",
        message: `সঠিক ${providerKey} ডোমেইন ব্যবহার করুন`,
      });
      return;
    }

    if (!allowedDomains && domain.length < 4) {
      ctx.addIssue({
        code: "custom",
        message: "সঠিক ইমেইল ঠিকানা দিন",
      });
    }
  });

export const passwordSchema = z
  .string()
  .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে")
  .regex(/[A-Z]/, "পাসওয়ার্ডে অন্তত একটি বড় হাতের অক্ষর থাকতে হবে")
  .regex(/[a-z]/, "পাসওয়ার্ডে অন্তত একটি ছোট হাতের অক্ষর থাকতে হবে")
  .regex(/\d/, "পাসওয়ার্ডে অন্তত একটি সংখ্যা থাকতে হবে")
  .regex(/[^A-Za-z0-9]/, "পাসওয়ার্ডে অন্তত একটি বিশেষ চিহ্ন থাকতে হবে");

export const nameSchema = z.string().trim().min(2, "পূর্ণ নাম দিতে হবে");

export const getFieldError = <T>(
  schema: z.ZodType<T>,
  value: unknown,
) => {
  const parsed = schema.safeParse(value);
  return parsed.success ? "" : parsed.error.issues[0]?.message ?? "সঠিক মান দিন";
};

export const registerSchema = z
  .object({
    f_name: nameSchema,
    phone: bangladeshPhoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
    rememberMe: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "দুইটি পাসওয়ার্ড মিলছে না",
      });
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "পাসওয়ার্ড দিতে হবে"),
});

export const getPasswordChecks = (value: string) => [
  { key: "length", label: "কমপক্ষে ৮ অক্ষর", valid: value.length >= 8 },
  { key: "upper", label: "একটি বড় হাতের অক্ষর", valid: /[A-Z]/.test(value) },
  { key: "lower", label: "একটি ছোট হাতের অক্ষর", valid: /[a-z]/.test(value) },
  { key: "number", label: "একটি সংখ্যা", valid: /\d/.test(value) },
  {
    key: "special",
    label: "একটি বিশেষ চিহ্ন",
    valid: /[^A-Za-z0-9]/.test(value),
  },
] as const;

const authErrorTranslations: Array<[string, string]> = [
  ["Password is required", "পাসওয়ার্ড দিতে হবে"],
  ["Please confirm your password", "পাসওয়ার্ড নিশ্চিত করুন"],
  ["Passwords do not match", "দুইটি পাসওয়ার্ড মিলছে না"],
  ["Please check your input", "ইনপুট ঠিক আছে কি না যাচাই করুন"],
  ["Please check your email", "ইমেইল ঠিক আছে কি না যাচাই করুন"],
  ["Login failed", "লগইন ব্যর্থ হয়েছে"],
  ["Registration failed", "রেজিস্ট্রেশন ব্যর্থ হয়েছে"],
  ["Google login failed", "গুগল লগইন ব্যর্থ হয়েছে"],
  ["Facebook login failed", "ফেসবুক লগইন ব্যর্থ হয়েছে"],
  ["Facebook login is not configured", "ফেসবুক লগইন এখনো কনফিগার করা হয়নি"],
  ["Facebook access token is required", "ফেসবুক টোকেন পাওয়া যায়নি"],
  ["Facebook login was cancelled", "ফেসবুক লগইন বাতিল করা হয়েছে"],
  ["Failed to load Facebook SDK", "ফেসবুক SDK লোড করা যায়নি"],
  ["Facebook token", "ফেসবুক টোকেন যাচাই করা যায়নি"],
  ["Facebook profile", "ফেসবুক প্রোফাইল আনা যায়নি"],
  ["Facebook account email not found", "ফেসবুক অ্যাকাউন্টে ইমেইল পাওয়া যায়নি"],
  ["OTP must be 6 digits", "OTP অবশ্যই ৬ সংখ্যার হতে হবে"],
  ["Password must be at least 6 characters", "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"],
  ["Invalid credentials", "ইমেইল বা পাসওয়ার্ড সঠিক নয়"],
  ["User already exists", "এই তথ্য দিয়ে আগে থেকেই একটি অ্যাকাউন্ট রয়েছে"],
  ["OTP sent to your email", "আপনার ইমেইলে OTP পাঠানো হয়েছে"],
  ["Invalid OTP", "OTP সঠিক নয়"],
  ["OTP expired", "OTP এর সময়সীমা শেষ হয়েছে"],
  ["User not found", "কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি"],
  ["Too many requests", "খুব বেশি অনুরোধ করা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন"],
];

export const translateAuthError = (message: string) => {
  for (const [source, target] of authErrorTranslations) {
    if (message.includes(source)) {
      return target;
    }
  }

  return message;
};
