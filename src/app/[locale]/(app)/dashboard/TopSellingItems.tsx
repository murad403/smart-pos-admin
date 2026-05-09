import { useTranslations } from "next-intl";

const items = [
    { rank: 1, name: "Nasi Goreng Special", sold: 245 },
    { rank: 2, name: "Ayam Bakar", sold: 198 },
    { rank: 3, name: "Es Teh Manis", sold: 342 },
];

const TopSellingItems = () => {
    const t = useTranslations("Dashboard");
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-800">{t("topSellingItems")}</h3>
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.rank}
                        className="flex items-center justify-between gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                {item.rank}
                            </span>
                            <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        </div>
                        <span className="shrink-0 text-sm text-slate-500">{item.sold} {t("sold")}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopSellingItems;