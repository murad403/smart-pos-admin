"use client";

import React from "react";
import { X, User, Mail, ChevronDown, Key, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AdminFormValues, adminSchema } from "@/validation/auth.validation";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddAdminModal: React.FC<Props> = ({ open, onClose }) => {
  const t = useTranslations("Profile");
  const tm = useTranslations("Menu");
  const tv = useTranslations("Validation");
  
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [showPass, setShowPass] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema(tv)),
    defaultValues: {
      role: "Admin",
    },
  });

  React.useEffect(() => {
    if (!open) {
      reset();
      setImagePreview(null);
    }
  }, [open, reset]);

  if (!open) return null;

  const onSubmit = (data: AdminFormValues) => {
    console.log("Adding admin/staff:", data);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[480px] rounded-[32px] bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Key size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t("addAdminStaff")}</h2>
            <p className="text-[15px] text-slate-500">
              {t("registerNewProfileFor") || "Register new Profile for"} <span className="font-bold text-blue-600">{t("adminStaff") || "Admin/Staff"}</span>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-[1.35rem] font-bold text-slate-900">{tm("register")}</h3>
          <p className="text-[14px] text-slate-500">{tm("createNewDreamsposAccount") || "Create New Dreamspos Account"}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center py-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex size-32 cursor-pointer flex-col items-center justify-center rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 transition-all hover:bg-slate-100"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <span className="text-[14px] font-medium text-slate-400">{t("uploadPhoto") || "Upload photo"}</span>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-bold text-slate-700">{t("name") || "Name"} <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                {...register("name")}
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500/50"
              />
              <User className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-bold text-slate-700">{t("emailAddress") || "Email Address"} <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                {...register("email")}
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500/50"
              />
              <Mail className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-slate-700">{t("password") || "Password"} <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password")}
                  className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-bold text-slate-700">{t("role") || "Role"}</label>
              <div className="relative">
                <select
                  {...register("role")}
                  className="w-full appearance-none rounded-xl border border-slate-100 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500/50"
                >
                  <option value="Admin">{t("admin")}</option>
                  <option value="Staff">{t("staff")}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-bold text-slate-700">{t("confirmPassword") || "Confirm Password"} <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500/50"
              />
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

          <Button
            type="submit"
            className="mt-4 h-12 w-full rounded-xl bg-[#3B82F6] text-[15px] font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600"
          >
            {t("addAdminStaff")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;