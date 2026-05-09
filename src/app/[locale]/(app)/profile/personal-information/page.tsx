"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomSwitch from "@/components/shared/CustomeSwitch";

const profileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  enableInventoryReport: z.boolean(),
  adminOnlyPaymentProof: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;



const ProfileInformationPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: "SmartPOS Bistro",
      address: "Jl. Sudirman No. 123, Jakarta Pusat",
      contactNumber: "+62 812-3456-7890",
      email: "admin@smartpos.com",
      facebook: "facebook.com/smartposbistro",
      instagram: "@smartpos.bistro",
      enableInventoryReport: true,
      adminOnlyPaymentProof: true,
    },
  });

  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form data:", { ...data, logo: imagePreview });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const enableInventoryReport = watch("enableInventoryReport");
  const adminOnlyPaymentProof = watch("adminOnlyPaymentProof");

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Owner Profile</h1>
          <p className="mt-1 text-slate-500">Manage your business brand identity and operational settings.</p>
        </div>
        <div className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-600">
          OWNER VERIFIED
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Name & Address */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-4">
              <div
                onClick={triggerFileInput}
                className="group relative flex size-36 cursor-pointer items-center justify-center overflow-hidden rounded-[28px] bg-[#F1F5F9] transition-all hover:bg-slate-200"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upload Logo</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Change</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Business Name & Address</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Business Name</label>
                  <input
                    {...register("businessName")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Address</label>
                  <input
                    {...register("address")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
          <p className="mb-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Contact Details</p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Contact Number</label>
              <input
                {...register("contactNumber")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
              {errors.contactNumber && <p className="text-xs text-red-500">{errors.contactNumber.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                {...register("email")}
                readOnly
                className="w-full rounded-xl border border-transparent bg-[#F1F5F9] px-4 py-3 text-[15px] text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
          <p className="mb-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Social Media</p>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Facebook</label>
              <input
                {...register("facebook")}
                className="w-full rounded-xl border-transparent bg-[#F8FAFC] px-4 py-3 text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Instagram</label>
              <input
                {...register("instagram")}
                className="w-full rounded-xl border-transparent bg-[#F8FAFC] px-4 py-3 text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* Feature Controls */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Feature Controls</p>
          <div className="divide-y divide-slate-50">
            <CustomSwitch
              label="Enable Inventory Report"
              checked={enableInventoryReport}
              onChange={(v) => setValue("enableInventoryReport", v)}
            />
            <CustomSwitch
              label="Admin-Only Payment Proof"
              checked={adminOnlyPaymentProof}
              onChange={(v) => setValue("adminOnlyPaymentProof", v)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-14 w-full rounded-xl bg-[#3B82F6] text-lg font-semibold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfileInformationPage;
