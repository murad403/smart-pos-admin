"use client";
import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import authIllustration from "@/assets/auth/signin.png";
import brandLogo from "@/assets/logo/logo.png";
import { SignInFormValues, signInSchema } from "@/validation/auth.validation";



const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        },
    });

    const onSubmit = async (values: SignInFormValues) => {
        console.log(values);
    };

    return (
        <section>
            <div className="mx-auto grid min-h-screen overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative flex flex-col overflow-hidden bg-white px-5 py-6 sm:px-8 sm:py-8 lg:px-14 lg:py-10">
                    <div className="flex flex-1 items-center justify-center pt-20 sm:pt-20 lg:pt-14">
                        <div className="w-full max-w-95">
                            <div className="mb-12 flex justify-center sm:mb-14 lg:mb-16">
                                <Image
                                    src={brandLogo}
                                    alt="Best Way Special"
                                    priority
                                    className="h-auto w-37.5 sm:w-45"
                                    sizes="180px"
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[30px]">
                                        Sign in
                                    </h1>
                                    <p className="text-sm leading-6 text-slate-500 sm:text-[15px]">
                                        Welcome back. Please sign in to continue.
                                    </p>
                                </div>

                                <form
                                    className="space-y-4"
                                    onSubmit={handleSubmit(onSubmit)}
                                    noValidate
                                >
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-slate-700">
                                            Email <span className="text-[#ef4444]">*</span>
                                        </span>

                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="email"
                                                autoComplete="email"
                                                placeholder="name@example.com"
                                                className={`h-11 w-full rounded-lg border bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#2f6de3] focus:ring-4 focus:ring-[#2f6de3]/10 ${errors.email ? "border-rose-400" : "border-slate-200"
                                                    }`}
                                                aria-invalid={Boolean(errors.email)}
                                                {...register("email")}
                                            />
                                        </div>

                                        <p className="mt-1.5 min-h-5 text-xs text-rose-500">
                                            {errors.email?.message}
                                        </p>
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-slate-700">
                                            Password <span className="text-[#ef4444]">*</span>
                                        </span>

                                        <div className="relative">
                                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className={`h-11 w-full rounded-lg border bg-white px-4 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#2f6de3] focus:ring-4 focus:ring-[#2f6de3]/10 ${errors.password
                                                    ? "border-rose-400"
                                                    : "border-slate-200"
                                                    }`}
                                                aria-invalid={Boolean(errors.password)}
                                                {...register("password")}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((value) => !value)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                                aria-label={
                                                    showPassword ? "Hide password" : "Show password"
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </button>
                                        </div>

                                        <p className="mt-1.5 min-h-5 text-xs text-rose-500">
                                            {errors.password?.message}
                                        </p>
                                    </label>

                                    <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                                        <label className="inline-flex items-center gap-2 text-slate-500">
                                            <input
                                                type="checkbox"
                                                className="size-4 rounded border-slate-300 text-[#2f6de3] focus:ring-[#2f6de3]"
                                                {...register("rememberMe")}
                                            />
                                            <span>Remember me</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3f82f6] px-4 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_rgba(63,130,246,0.9)] transition hover:-translate-y-0.5 hover:bg-[#3277ef] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        Sign in
                                        <ArrowRight className="size-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex min-h-90 items-center justify-center overflow-hidden bg-[#b7cdfa] px-6 py-10 sm:min-h-115 lg:min-h-0 lg:px-10 lg:py-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.34),transparent_32%),radial-gradient(circle_at_70%_72%,rgba(255,255,255,0.16),transparent_28%)]" />
                    <div className="absolute left-8 top-16 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute bottom-14 right-12 h-28 w-28 rounded-full bg-white/15 blur-3xl" />

                    <div className="relative w-full max-w-140 px-3 sm:px-6 lg:px-4">
                        <div className="mx-auto max-w-130">
                            <Image
                                src={authIllustration}
                                alt="Authentication illustration"
                                priority
                                className="h-auto w-full drop-shadow-[0_24px_50px_rgba(37,99,235,0.16)]"
                                sizes="(max-width: 1024px) 90vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignIn;