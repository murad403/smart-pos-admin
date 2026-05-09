"use client";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

const data = [
    { date: "Apr 16", sales: 48000 },
    { date: "Apr 17", sales: 51000 },
    { date: "Apr 18", sales: 48500 },
    { date: "Apr 19", sales: 63000 },
    { date: "Apr 20", sales: 72000 },
    { date: "Apr 21", sales: 82000 },
    { date: "Apr 22", sales: 95000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-bold text-blue-600">Rp {payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const SalesSummary = () => {
    const t = useTranslations("Reports");
    return (
        <div className="space-y-4">
            {/* Chart card */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">{t("salesSummary")}</h2>
                <p className="mt-0.5 text-sm font-medium text-blue-500">23 April 2026 – 23 April 2026</p>
                <div className="mt-5">
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                            />
                            <YAxis
                                ticks={[0, 25000, 50000, 75000, 100000]}
                                tickFormatter={(v) => v === 0 ? "0" : String(v)}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                width={58}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#2563eb"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly earning card */}
            <div className="flex items-center justify-between rounded-2xl bg-blue-50 px-6 py-5">
                <div>
                    <p className="text-lg font-bold text-slate-800">{t("thisMonthEarning")}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">Rp 20,825,000</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">+26.2%</p>
                    <p className="mt-1 text-sm text-blue-500">{t("comparedToLastMonth")}</p>
                </div>
            </div>
        </div>
    );
};

export default SalesSummary;