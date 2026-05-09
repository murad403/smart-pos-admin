/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import { useTranslations } from "next-intl";

const data = [
    { day: "Mon", sales: 42000 },
    { day: "Tue", sales: 50000 },
    { day: "Wed", sales: 46000 },
    { day: "Thu", sales: 62000 },
    { day: "Fri", sales: 75000 },
    { day: "Sat", sales: 88000 },
    { day: "Sun", sales: 96000 },
];

const yTicks = [0, 25000, 50000, 75000, 100000];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-sm font-bold text-blue-600">
                    Rp {payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const SalesOverTime = () => {
    const t = useTranslations("Dashboard");
    const td = useTranslations("Days");
    
    const localizedData = data.map(item => ({
        ...item,
        day: td(item.day.toLowerCase() as any)
    }));

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-800">{t("salesOverTime")}</h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={localizedData} barSize={40} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis
                        ticks={yTicks}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        width={55}
                        tickFormatter={(v) => {
                            if (v === 0) return "0";
                            if (v === 25000) return "25000";
                            if (v === 50000) return "50000";
                            if (v === 75000) return "75000";
                            if (v === 100000) return "100000";
                            return String(v);
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff", radius: 6 }} />
                    <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesOverTime;