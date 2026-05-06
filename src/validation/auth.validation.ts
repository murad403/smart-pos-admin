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