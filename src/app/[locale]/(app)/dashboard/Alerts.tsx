import { AlertCircle } from "lucide-react";

const alerts = [
    {
        type: "error",
        title: "Payment mismatch detected",
        desc: "Order #1245 - Rp 5,000 difference",
    },
    {
        type: "warning",
        title: "Low stock alert",
        desc: "Es Teh Manis - Only 15 units left",
    },
];

const Alerts = () => {
    return (
        <div className="rounded-xl bg-white p-5 border-l-4 border-red-500 shadow-sm">
            <div className="mb-5 flex items-center gap-2  pl-3">
                <AlertCircle className="size-4 text-red-500" />
                <h3 className="text-base font-semibold text-slate-800">Alerts</h3>
            </div>
            <div className="space-y-3">
                {alerts.map((alert, i) => (
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