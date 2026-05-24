"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Play, Loader2, Clock, ClipboardClock } from "lucide-react";
import { getUserData } from "@/utils/auth";
import { useOpenShiftMutation, useGetCurrentShiftQuery, useGetAllShiftUsersQuery } from "@/redux/features/workflow/workflow.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useRouter } from "@/i18n/routing";


const ShiftWorkflowPage = () => {
  const t = useTranslations("ShiftWorkflow");
  const router = useRouter();

  // Current logged in user from cookie
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);

  // Fetch users for selection (e.g. for owner/admin workflow)
  const { data: usersRes, isLoading: isUsersLoading } = useGetAllShiftUsersQuery({ limit: 100 });
  const users = usersRes?.data || [];

  useEffect(() => {
    const userData = getUserData();
    setCurrentUser(userData);
    if (userData && !selectedUserId) {
      setSelectedUserId(userData.id);
    }
  }, []);

  // Update selectedUserId if users are loaded and user hasn't selected anything
  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      const userData = getUserData();
      if (userData && users.some((u) => u.id === userData.id)) {
        setSelectedUserId(userData.id);
      } else {
        setSelectedUserId(users[0].id);
      }
    }
  }, [users, selectedUserId]);

  // Fetch current shift session for selected user to see if it is active
  const {
    data: currentShiftRes,
    isLoading: isShiftLoading,
    isFetching: isShiftFetching,
  } = useGetCurrentShiftQuery(selectedUserId, { skip: !selectedUserId });
  const currentShift = currentShiftRes?.data && (currentShiftRes.data as any).id ? currentShiftRes.data : null;

  // Mutations
  const [openShift, { isLoading: isOpenShiftLoading }] = useOpenShiftMutation();

  // Live timer for active shift duration
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    if (!currentShift?.createdAt) {
      setDuration("");
      return;
    }

    const updateTimer = () => {
      const start = new Date(currentShift.createdAt).getTime();
      const now = new Date().getTime();
      const diff = now - start;
      if (diff < 0) {
        setDuration("00:00:00");
        return;
      }
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setDuration(
        `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentShift?.createdAt]);

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });
    } catch {
      return dateStr;
    }
  };

  const handleOpenShift = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user first");
      return;
    }
    if (currentShift) {
      router.push(`/shift-workflow/open-shift?userId=${selectedUserId}`);
      return;
    }
    try {
      await openShift({ userId: selectedUserId }).unwrap();
      toast.success(t("shiftOpenedSuccessfully"));
      router.push(`/shift-workflow/open-shift?userId=${selectedUserId}`);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to open shift");
    }
  };

  const currentSelectedUserObj = users.find((u) => u.id === selectedUserId);
  // console.log(currentSelectedUserObj)
  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
        </div>

        {/* User Selection selector */}
        {isUsersLoading ? (
          <Skeleton className="h-10 w-60 rounded-xl bg-slate-200" />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">
              {t("selectUser")}:
            </span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              disabled={isOpenShiftLoading || isShiftLoading || isShiftFetching}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-[#1A56DB] focus:outline-none focus:ring-1 focus:ring-[#1A56DB] transition-all"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email || u.slug} ({u.role})
                </option>
              ))}
            </select>

            <Link href={`/shift-workflow/shift-history/${selectedUserId}`}>
              <Button
                type="button"
                className="h-9 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <ClipboardClock size={16} />
                <span>Shift History</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isShiftLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <Skeleton className="mx-auto size-20 rounded-3xl bg-slate-200" />
          <Skeleton className="mt-8 h-8 w-64 mx-auto rounded-lg bg-slate-200" />
          <Skeleton className="mt-3 h-4 w-96 mx-auto rounded-lg bg-slate-200" />
          <Skeleton className="mt-6 h-12 w-48 mx-auto rounded-2xl bg-slate-200" />
          <Skeleton className="mt-8 h-12 w-40 mx-auto rounded-xl bg-slate-200" />
        </div>
      ) : (
        /* ================= OPEN SHIFT / ACTIVE SHIFT UI ================= */
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm animate-fade-in">
          <div className={`mx-auto flex size-20 items-center justify-center rounded-3xl shadow-sm transition-colors ${currentShift ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-[#1A56DB]"
            }`}>
            {currentShift ? (
              <div className="relative flex size-10 items-center justify-center">
                <Clock className="size-10" />
                <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-4.5 w-4.5 rounded-full bg-emerald-500"></span>
                </span>
              </div>
            ) : (
              <Play className="size-10 fill-[#1A56DB] ml-1 animate-pulse" />
            )}
          </div>

          {currentShift ? (
            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 animate-pulse">
              <span className="size-2 rounded-full bg-emerald-500" />
              {t("alreadyOpened")}
            </div>
          ) : (
            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1 text-xs font-bold text-slate-600">
              <span className="size-2 rounded-full bg-slate-400" />
              {t("notOpened")}
            </div>
          )}

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            {currentShift ? t("activeShiftTitle") : t("openShiftTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            {currentShift ? t("activeShiftDesc") : t("openShiftDesc")}
          </p>

          {currentSelectedUserObj && (
            <div className={`mt-6 inline-flex items-center gap-3 rounded-2xl px-5 py-3 border transition-colors ${currentShift ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-200"
              }`}>
              <div className={`flex size-8 items-center justify-center rounded-full text-xs font-bold text-white uppercase ${currentShift ? "bg-emerald-500" : "bg-[#1A56DB]"
                }`}>
                {currentSelectedUserObj.name ? currentSelectedUserObj.name[0] : "U"}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-slate-400">
                  {currentShift ? "Active shift for" : "Opening shift for"}
                </p>
                <p className={`text-sm font-bold ${currentShift ? "text-emerald-700" : "text-slate-800"
                  }`}>
                  {currentSelectedUserObj.name || currentSelectedUserObj.email}
                </p>
              </div>
            </div>
          )}

          {currentShift && (
            <div className="mt-6 w-full max-w-sm rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left text-sm animate-fade-in">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                {t("shiftDetails")}
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("startedAt")}</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">
                    {formatDateTime(currentShift.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("runningTime")}</p>
                  <p className="font-bold font-mono text-emerald-600 text-xs mt-0.5">
                    {duration || "00:00:00"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("openingCashBrief")}</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">
                    Rp {currentShift.openingCashAmount ? Number(currentShift.openingCashAmount).toLocaleString() : "0"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("uploadedProofs")}</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">
                    {t("filesCount", { count: currentShift.cashProofs?.length || 0 })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleOpenShift}
            disabled={isOpenShiftLoading}
            className={`mt-8 h-12 rounded-xl px-10 text-[15px] font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${currentShift
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10 animate-pulse"
                : "bg-[#1A56DB] hover:bg-blue-700 shadow-blue-500/10"
              }`}
          >
            {isOpenShiftLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : currentShift ? (
              <Clock className="size-5" />
            ) : (
              <Play className="size-5 fill-white" />
            )}
            {currentShift ? t("goToActiveShift") : t("openShift")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShiftWorkflowPage;