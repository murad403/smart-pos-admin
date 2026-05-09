import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const Alerts = () => {
    const t = useTranslations("Dashboard");
    
    const localizedAlerts = [
        {
            type: "error",
            title: t("paymentMismatchDetected"),
            desc: "Order #1245 - Rp 5,000 " + t("difference"),
        },
        {
            type: "warning",
            title: t("lowStockAlert"),
            desc: "Es Teh Manis - Only 15 " + t("unitsLeft"),
        },
    ];

    return (
        <div className="rounded-xl bg-white p-5 border-l-4 border-red-500 shadow-sm">
            <div className="mb-5 flex items-center gap-2  pl-3">
                <AlertCircle className="size-4 text-red-500" />
                <h3 className="text-base font-semibold text-slate-800">{t("alerts")}</h3>
            </div>
            <div className="space-y-3">
                {localizedAlerts.map((alert, i) => (
                    <div
                        key={i}
                        className={`rounded-xl px-4 py-3 ${
                            alert.type === "error"
                                ? "bg-red-50"
                                : "bg-yellow-50"
                        }`}
                    >
                        <p
                            className={`text-sm font-semibold ${
                                alert.type === "error" ? "text-red-700" : "text-yellow-700"
                            }`}
                        >
                            {alert.title}
                        </p>
                        <p
                            className={`mt-0.5 text-xs ${
                                alert.type === "error" ? "text-red-500" : "text-yellow-600"
                            }`}
                        >
                            {alert.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alerts;