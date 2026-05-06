"use client";
import { ShoppingCart, DollarSign, Package } from "lucide-react";

const stats = [
    {
        label: "Total Revenue",
        value: "Rp 464,000",
        change: "+12.5% from last week",
        icon: <DollarSign className="size-5 text-white" />,
        variant: "blue",
    },
    {
        label: "Total Orders",
        value: "745",
        change: "+8.2%  from last week",
        icon: <ShoppingCart className="size-5 text-blue-500" />,
        variant: "white",
    },
    {
        label: "Avg Order Value",
        value: "Rp 62,280",
        sub: "Across all orders",
        icon: <Package className="size-5 text-yellow-500" />,
        variant: "white",
    },
    {
        label: "Order Types",
        orderTypes: [
            { name: "Dine-in", count: 458 },
            { name: "Takeaway", count: 287 },
        ],
        variant: "types",
    },
];

const DashboardStats = () => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, i) => {
                if (stat.variant === "blue") {
                    return (
                        <div
                            key={i}
                            className="relative overflow-hidden rounded-2xl bg-blue-600 p-5 text-white shadow-lg"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-100">{stat.label}</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-blue-100">
                                <span className="text-emerald-300">↑</span>
                                {stat.change}
                            </p>
                            {/* decorative circle */}
                            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
                        </div>
                    );
                }
                if (stat.variant === "white") {
                    return (
                        <div
                            key={i}
                            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                            {stat.change && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                    <span className="text-emerald-500">↑</span>
                                    {stat.change}
                                </p>
                            )}
                            {stat.sub && (
                                <p className="mt-1 text-xs text-slate-400">{stat.sub}</p>
                            )}
                        </div>
                    );
                }
                // Order Types
                return (
                    <div
                        key={i}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                    >
                        <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                        <div className="mt-4 space-y-3">
                            {stat.orderTypes?.map((ot) => (
                                <div key={ot.name} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">{ot.name}</span>
                                    <span className="text-sm font-bold text-slate-900">{ot.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardStats;