import { AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";

const PaymentVerificationStats = () => {
    const t = useTranslations("Payment");
    
    return (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            {/* Total Mismatch */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t("mismatchesDetected")}
                        </p>
                        <h3 className="mt-0.5 text-2xl font-bold text-slate-900">12</h3>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-xs font-medium text-red-500">
                        <TrendingUp size={12} />
                        +2
                    </span>
                    <span className="text-xs text-slate-400">from yesterday</span>
                </div>
            </div>

            {/* Total Transactions Verified */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t("totalTransactions")}
                        </p>
                        <h3 className="mt-0.5 text-2xl font-bold text-slate-900">458</h3>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-xs font-medium text-blue-600">
                        <TrendingUp size={12} />
                        +124
                    </span>
                    <span className="text-xs text-slate-400">from yesterday</span>
                </div>
            </div>

            {/* Cash vs Total Percentage */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t("cashTransactions")}
                        </p>
                        <h3 className="mt-0.5 text-2xl font-bold text-slate-900">82%</h3>
                    </div>
                </div>
                <div className="mt-4 w-full rounded-full bg-slate-100 h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "82%" }} />
                </div>
            </div>
        </div>
    );
};

export default PaymentVerificationStats;