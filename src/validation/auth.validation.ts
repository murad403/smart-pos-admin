import z from "zod";

export const signInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean(),
});
export type SignInFormValues = z.infer<typeof signInSchema>;


export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(1, "New password is required")
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email address is required")
        .email("Please enter a valid email address"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetSchema = (t: any) => z.object({
  newPassword: z.string().min(8, t("passwordMin") || "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, t("confirmRequired") || "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t("passwordsMatch") || "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetFormValues = z.infer<ReturnType<typeof resetSchema>>;

export const adminSchema = (t: any) => z.object({
    name: z.string().min(1, t("nameRequired") || "Name is required"),
    email: z.string().email(t("invalidEmail") || "Invalid email address"),
    password: z.string().min(8, t("passwordMin") || "Password must be at least 8 characters"),
    role: z.enum(["Admin", "Staff"]),
    confirmPassword: z.string().min(1, t("confirmRequired") || "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: t("passwordsMatch") || "Passwords don't match",
    path: ["confirmPassword"],
});

export type AdminFormValues = z.infer<ReturnType<typeof adminSchema>>;
export const staffSchema = adminSchema;
export type StaffFormValues = z.infer<ReturnType<typeof staffSchema>>;
