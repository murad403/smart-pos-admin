"use client";
import React from "react";
import { Key, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { ResetFormValues, resetSchema } from "@/validation/auth.validation";
import { useTranslations } from "next-intl";

type Props = {
    open: boolean;
    onClose: () => void;
    user: { name: string; email: string } | null;
};

const UserResetPasswordModal: React.FC<Props> = ({ open, onClose, user }) => {
    const t = useTranslations("Profile");
    const tv = useTranslations("Validation");
    const [showNew, setShowNew] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema(tv)),
    });

    React.useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    if (!open) return null;

    const onSubmit = (data: ResetFormValues) => {
        console.log("Resetting password for:", user?.name, data);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
            <div className="relative w-full max-w-[440px] rounded-[32px] bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Key size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{t("securityReset") || "Security Reset"}</h2>
                        <p className="text-[15px] text-slate-500">
                            {t("setNewPasswordFor") || "Set new password for"} <span className="font-bold text-blue-600">{user?.name || "User"}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{t("name") || "NAME"}</label>
                        <input
                            type="text"
                            value={user?.name || ""}
                            readOnly
                            className="w-full rounded-2xl border-none bg-slate-50 px-4 py-3 text-[15px] text-slate-400 outline-none cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{t("email") || "EMAIL"}</label>
                        <input
                            type="text"
                            value={user?.email || ""}
                            readOnly
                            className="w-full rounded-2xl border-none bg-slate-50 px-4 py-3 text-[15px] text-slate-400 outline-none cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{t("newPassword") || "NEW PASSWORD"}</label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                {...register("newPassword")}
                                placeholder={t("passwordPlaceholder") || "Min. 8 characters"}
                                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-11 py-3 text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{t("confirmPassword") || "CONFIRM PASSWORD"}</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder={t("passwordPlaceholder") || "Min. 8 characters"}
                                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-11 py-3  text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                            <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="rounded-2xl bg-orange-50/80 p-4 border border-orange-100">
                        <p className="text-[13px] leading-relaxed text-orange-800">
                            <span className="font-bold">*</span> {t("resetWarning") || "By resetting, the user will be forced to use this new credential for their next login. This action is recorded in audit logs."}
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-700"
                        >
                            {t("cancel") || "CANCEL"}
                        </button>
                        <Button
                            type="submit"
                            className="h-12 rounded-2xl bg-[#93b4ff] px-10 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
                        >
                            {t("confirmReset") || "Confirm Reset"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserResetPasswordModal;