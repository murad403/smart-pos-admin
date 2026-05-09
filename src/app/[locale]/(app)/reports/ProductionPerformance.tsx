import { useTranslations } from "next-intl";

const slowestItems = [
    { name: "Nasi Goreng Special", time: "18 min" },
    { name: "Ayam Bakar",          time: "25 min" },
    { name: "Soto Ayam",           time: "15 min" },
    { name: "Sate Ayam",           time: "22 min" },
    { name: "Gado-Gado",           time: "12 min" },
];

const ProductionPerformance = () => {
    const t = useTranslations("Reports");
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-800">{t("productionPerformance")}</h3>

            {/* Avg prep time */}
            <div className="mb-5 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">{t("avgPrepTime")}</p>
                <p className="mt-0.5 text-3xl font-bold text-slate-900">16 {t("min")}</p>
            </div>

            {/* Slowest items */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("slowestItems")}</p>
            <div className="space-y-3">
                {slowestItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{item.name}</span>
                        <span className="text-sm font-semibold text-slate-800">{item.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductionPerformance;