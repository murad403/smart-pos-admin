"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CustomSwitch from "@/components/shared/CustomeSwitch";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useGetOperatingHoursQuery, useUpdateOperatingHoursMutation } from "@/redux/features/dashboard/dashboard.api";
import type { OperatingHoursData, UpdateOperatingHoursBody } from "@/redux/features/dashboard/dashboard.type";
import { cn } from "@/lib/utils";

type DayConfig = {
  key: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
};

const normalizeTimeValue = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  const directMatch = trimmedValue.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);
  if (directMatch) {
    return `${directMatch[1].padStart(2, "0")}:${directMatch[2]}`;
  }

  const amPmMatch = trimmedValue.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*([AaPp][Mm])$/);
  if (!amPmMatch) return trimmedValue;

  let hour = Number(amPmMatch[1]);
  const minute = amPmMatch[2];
  const meridiem = amPmMatch[3].toLowerCase();

  if (meridiem === "pm" && hour !== 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
};

const DAY_FIELD_MAP = {
  monday: { start: "mondayStart", end: "mondayEnd" },
  tuesday: { start: "tuesdayStart", end: "tuesdayEnd" },
  wednesday: { start: "wednesdayStart", end: "wednesdayEnd" },
  thursday: { start: "thursdayStart", end: "thursdayEnd" },
  friday: { start: "fridayStart", end: "fridayEnd" },
  saturday: { start: "saturdayStart", end: "saturdayEnd" },
  sunday: { start: "sundayStart", end: "sundayEnd" },
} as const;

const createEmptyDays = (): DayConfig[] => [
  { key: "monday", isOpen: false, startTime: "", endTime: "" },
  { key: "tuesday", isOpen: false, startTime: "", endTime: "" },
  { key: "wednesday", isOpen: false, startTime: "", endTime: "" },
  { key: "thursday", isOpen: false, startTime: "", endTime: "" },
  { key: "friday", isOpen: false, startTime: "", endTime: "" },
  { key: "saturday", isOpen: false, startTime: "", endTime: "" },
  { key: "sunday", isOpen: false, startTime: "", endTime: "" },
];

const mapApiToDays = (data: OperatingHoursData): DayConfig[] => [
  { key: "monday", isOpen: Boolean(data.mondayStart && data.mondayEnd), startTime: normalizeTimeValue(data.mondayStart), endTime: normalizeTimeValue(data.mondayEnd) },
  { key: "tuesday", isOpen: Boolean(data.tuesdayStart && data.tuesdayEnd), startTime: normalizeTimeValue(data.tuesdayStart), endTime: normalizeTimeValue(data.tuesdayEnd) },
  { key: "wednesday", isOpen: Boolean(data.wednesdayStart && data.wednesdayEnd), startTime: normalizeTimeValue(data.wednesdayStart), endTime: normalizeTimeValue(data.wednesdayEnd) },
  { key: "thursday", isOpen: Boolean(data.thursdayStart && data.thursdayEnd), startTime: normalizeTimeValue(data.thursdayStart), endTime: normalizeTimeValue(data.thursdayEnd) },
  { key: "friday", isOpen: Boolean(data.fridayStart && data.fridayEnd), startTime: normalizeTimeValue(data.fridayStart), endTime: normalizeTimeValue(data.fridayEnd) },
  { key: "saturday", isOpen: Boolean(data.saturdayStart && data.saturdayEnd), startTime: normalizeTimeValue(data.saturdayStart), endTime: normalizeTimeValue(data.saturdayEnd) },
  { key: "sunday", isOpen: Boolean(data.sundayStart && data.sundayEnd), startTime: normalizeTimeValue(data.sundayStart), endTime: normalizeTimeValue(data.sundayEnd) },
];

const mapDaysToPayload = (days: DayConfig[]): UpdateOperatingHoursBody => {
  const payload = {
    mondayStart: "",
    mondayEnd: "",
    tuesdayStart: "",
    tuesdayEnd: "",
    wednesdayStart: "",
    wednesdayEnd: "",
    thursdayStart: "",
    thursdayEnd: "",
    fridayStart: "",
    fridayEnd: "",
    saturdayStart: "",
    saturdayEnd: "",
    sundayStart: "",
    sundayEnd: "",
  };

  days.forEach((day) => {
    const mapping = DAY_FIELD_MAP[day.key as keyof typeof DAY_FIELD_MAP];
    payload[mapping.start] = day.isOpen ? normalizeTimeValue(day.startTime) : "";
    payload[mapping.end] = day.isOpen ? normalizeTimeValue(day.endTime) : "";
  });

  return payload;
};

const OperatingHoursPage = ({ params }: { params?: Promise<{ locale: string }> }) => {
  if (params) React.use(params);
  const t = useTranslations("Profile");
  const td = useTranslations("Days");
  const { data: operatingHoursRes, isLoading } = useGetOperatingHoursQuery();
  const [updateOperatingHours, { isLoading: isSaving }] = useUpdateOperatingHoursMutation();
  const [draftDays, setDraftDays] = React.useState<DayConfig[] | null>(null);

  const serverDays = operatingHoursRes?.data ? mapApiToDays(operatingHoursRes.data) : createEmptyDays();

  const days = draftDays ?? serverDays;

  const toggleDay = (index: number) => {
    setDraftDays((curr) => {
      const base = curr ?? serverDays;
      return base.map((d, i) => (i === index ? { ...d, isOpen: !d.isOpen } : d));
    });
  };

  const updateTime = (index: number, type: "startTime" | "endTime", value: string) => {
    setDraftDays((curr) => {
      const base = curr ?? serverDays;
      return base.map((d, i) => (i === index ? { ...d, [type]: value } : d));
    });
  };

  const handleSave = async () => {
    try {
      const payload = mapDaysToPayload(days);
      const result = await updateOperatingHours(payload).unwrap();
      toast.success(result.message || "Operating hours updated successfully");
      setDraftDays(null);
    } catch (error: unknown) {
      const message = error && typeof error === "object" && "data" in error
        ? (error as { data?: { message?: string } }).data?.message
        : undefined;
      const fallbackMessage = error instanceof Error ? error.message : undefined;
      toast.error(message || fallbackMessage || "Failed to update operating hours");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t("operatingHoursSettings")}</h1>
          <p className="mt-1 text-slate-600 text-sm">{t("subtitle")}</p>
        </div>
        <div className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-600">
          {t("verified")}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">{t("operatingHours")}</h2>
            <p className="mt-2 text-[14px] text-slate-500">{t("hoursDescription")}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
            <div className="size-2 rounded-full bg-orange-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">{t("securityEnforcementActive") || "SECURITY ENFORCEMENT ACTIVE"}</span>
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-4 lg:grid-cols-2">
          {days.map((config, idx) => (
            <div key={config.key} className={cn("rounded-2xl border border-slate-100 p-5 transition-all", !config.isOpen && "bg-slate-50/50 opacity-60")}>
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-semibold text-slate-900">{td(config.key)}</span>
                <CustomSwitch
                  label=""
                  checked={config.isOpen}
                  onChange={() => toggleDay(idx)}
                />
              </div>
              
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex-1 min-w-0">
                  <input
                    type="time"
                    value={config.startTime}
                    disabled={!config.isOpen}
                    onChange={(e) => updateTime(idx, "startTime", e.target.value)}
                    className="w-full rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-[14px] text-slate-600 outline-none focus:border-blue-500/50"
                  />
                </div>
                <span className="text-slate-300 hidden sm:inline">-</span>
                <div className="flex-1 min-w-0">
                  <input
                    type="time"
                    value={config.endTime}
                    disabled={!config.isOpen}
                    onChange={(e) => updateTime(idx, "endTime", e.target.value)}
                    className="w-full rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-[14px] text-slate-600 outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
              {!config.isOpen && (
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("closed")}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Global Save Changes Button */}
      <Button
        type="button"
        onClick={handleSave}
        disabled={isLoading || isSaving}
        className="h-12 cursor-pointer w-full rounded-xl bg-[#3B82F6] text-lg font-semibold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? "Saving..." : t("saveChanges")}
      </Button>
    </div>
  );
};

export default OperatingHoursPage;