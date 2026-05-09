"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const PasswordChangePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormValues) => {
    console.log("Password change data:", data);
    reset();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Security Settings</h1>
          <p className="mt-1 text-slate-500">Manage your business brand identity and operational settings.</p>
        </div>
        <div className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-600">
          OWNER VERIFIED
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
        <h2 className="mb-6 text-[17px] font-bold text-slate-900">Security</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Current Password</label>
            <input
              type="password"
              {...register("currentPassword")}
              placeholder="Enter current password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">New Password</label>
            <input
              type="password"
              {...register("newPassword")}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button
              type="submit"
              className="h-11 rounded-lg bg-[#1A56DB] px-6 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              Update Password
            </Button>
            <button
              type="button"
              onClick={() => reset()}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Global Save Changes Button */}
      <Button
        type="button"
        className="h-14 w-full rounded-xl bg-[#3B82F6] text-lg font-semibold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default PasswordChangePage;