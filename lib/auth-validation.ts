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
      message: "Phone number is required",
    });
    return;
  }

  if (!/^01\d{9}$/.test(normalized)) {
    ctx.addIssue({
      code: "custom",
      message: "Use a valid Bangladesh mobile number",
    });
    return;
  }

  if (!validBangladeshPrefixes.has(normalized.slice(0, 3))) {
    ctx.addIssue({
      code: "custom",
      message: "Unsupported Bangladesh operator code",
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

export const emailSchema = z.string().trim().min(1, "Email is required").superRefine((value, ctx) => {
  const normalized = value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    ctx.addIssue({
      code: "custom",
      message: "Use a valid email address",
    });
    return;
  }

  const [, domain = ""] = normalized.split("@");
  const segments = domain.split(".");

  if (segments.length < 2 || segments.some((segment) => !segment.trim())) {
    ctx.addIssue({
      code: "custom",
      message: "Use a valid email address",
    });
    return;
  }

  const tld = segments.at(-1) ?? "";
  if (!/^[a-z]{2,24}$/.test(tld)) {
    ctx.addIssue({
      code: "custom",
      message: "Use a valid email address",
    });
    return;
  }

  const providerKey = segments[0];
  const allowedDomains = providerDomains.get(providerKey);

  if (allowedDomains && !allowedDomains.includes(domain)) {
    ctx.addIssue({
      code: "custom",
      message: `Use the correct ${providerKey} domain`,
    });
    return;
  }

  if (!allowedDomains && domain.length < 4) {
    ctx.addIssue({
      code: "custom",
      message: "Use a valid email address",
    });
  }
});

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/\d/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

export const nameSchema = z.string().trim().min(2, "Full name is required");

export const getFieldError = <T>(
  schema: z.ZodType<T>,
  value: unknown,
) => {
  const parsed = schema.safeParse(value);
  return parsed.success ? "" : parsed.error.issues[0]?.message ?? "Invalid value";
};

export const registerSchema = z
  .object({
    f_name: nameSchema,
    phone: bangladeshPhoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    rememberMe: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const getPasswordChecks = (value: string) => [
  { key: "length", label: "At least 8 characters", valid: value.length >= 8 },
  { key: "upper", label: "One uppercase letter", valid: /[A-Z]/.test(value) },
  { key: "lower", label: "One lowercase letter", valid: /[a-z]/.test(value) },
  { key: "number", label: "One number", valid: /\d/.test(value) },
  {
    key: "special",
    label: "One special character",
    valid: /[^A-Za-z0-9]/.test(value),
  },
] as const;
