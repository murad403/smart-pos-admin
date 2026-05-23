"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle, Eye, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetShiftHistoryQuery } from "@/redux/features/workflow/workflow.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ShiftHistoryPage = () => {
  const router = useRouter();
  const t = useTranslations("ShiftHistoryPage");
  const { id } = useParams();
  const { data: historyRes, isLoading } = useGetShiftHistoryQuery(id as string, { skip: !id });
  const history = historyRes?.data || [];

  // Get user details from first session if available
  const user = history[0]?.user;

  const formatCurrency = (value?: string | null) => {
    if (!value) return "Rp 0";
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return "Rp 0";
    return `Rp ${parsed.toLocaleString("en-US")}`;
  };

  const getVerificationBadge = (isVerified: boolean | null, isSkipped: boolean) => {
    if (isSkipped) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
          <HelpCircle size={13} />
          {t("skipped")}
        </span>
      );
    }
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
          <CheckCircle size={13} />
          {t("verified")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg">
        <AlertCircle size={13} />
        {t("notVerified")}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-fit h-9 px-4 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-650 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{t("back")}</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-3xl border border-slate-200/70 bg-[#f4f3f0] p-4 sm:p-5">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl bg-slate-200" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-slate-200" />
                      <Skeleton className="h-3 w-20 bg-slate-200" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Skeleton className="h-14 rounded-xl bg-slate-100" />
                  <Skeleton className="h-14 rounded-xl bg-slate-100" />
                  <Skeleton className="h-14 rounded-xl bg-slate-100" />
                </div>
                <Skeleton className="h-6 w-3/4 bg-slate-200" />
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">
            {t("noHistory")}
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Information Profile Card */}
            {user && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] max-w-sm">
                <div className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-base uppercase shrink-0">
                  {user.name ? user.name[0] : "U"}
                </div>
                <div className="min-w-0 leading-tight">
                  <h2 className="text-sm font-bold text-slate-800 truncate">{user.name || "User"}</h2>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{user.email}</p>
                </div>
              </div>
            )}
            {history.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >

                {/* Session Header Card */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-blue-50 text-[#1A56DB] p-2 rounded-xl">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {new Date(session.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {t("openedAt")}: {new Date(session.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border w-fit ${session.type === "CLOSING"
                        ? "bg-amber-50 text-amber-750 border-amber-200"
                        : "bg-blue-50 text-blue-750 border-blue-200"
                      }`}
                  >
                    {session.type}
                  </span>
                </div>

                {/* Grid for values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("openingCash")}</p>
                    <p className="text-base font-extrabold text-slate-800 mt-1">
                      {formatCurrency(session.openingCashAmount)}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("closingCash")}</p>
                    <p className="text-base font-extrabold text-slate-800 mt-1">
                      {formatCurrency(session.closingCashAmount)}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("discrepancy")}</p>
                    <p
                      className={`text-base font-extrabold mt-1 ${session.closingDiscrepancy && parseFloat(session.closingDiscrepancy) !== 0
                          ? "text-red-650 font-black"
                          : "text-slate-800"
                        }`}
                    >
                      {formatCurrency(session.closingDiscrepancy)}
                    </p>
                  </div>
                </div>

                {/* Checklist statuses */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-slate-450 uppercase tracking-wide">{t("checklist")}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">{t("inventory")}:</span>
                      {getVerificationBadge(session.inventoryAccurate, session.skippedInventory)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">{t("promotions")}:</span>
                      {getVerificationBadge(session.promotionConfirmed, session.skippedPromotion)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">{t("salesConfirmed")}:</span>
                      {getVerificationBadge(session.salesConfirmed, session.skippedCash)}
                    </div>
                  </div>
                </div>

                {/* Cash Proofs previews */}
                {session.cashProofs && session.cashProofs.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-455 uppercase tracking-wide">{t("cashProofs")}</p>
                    <div className="flex flex-wrap gap-3 mt-2.5">
                      {session.cashProofs.map((proof) => (
                        <a
                          key={proof.id}
                          href={proof.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="relative group size-20 rounded-xl overflow-hidden border border-slate-150 block bg-slate-50 shadow-sm transition hover:-translate-y-0.5 duration-200"
                        >
                          <img src={proof.imageUrl} alt="Cash Proof" className="size-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Eye className="size-5 text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftHistoryPage;