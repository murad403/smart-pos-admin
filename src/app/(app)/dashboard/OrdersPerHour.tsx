/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

const data = [
    { hour: "9AM", orders: 12 },
    { hour: "10AM", orders: 18 },
    { hour: "11AM", orders: 42 },
    { hour: "12PM", orders: 35 },
    { hour: "1PM", orders: 28 },
    { hour: "2PM", orders: 15 },
    { hour: "3PM", orders: 20 },
    { hour: "4PM", orders: 22 },
    { hour: "5PM", orders: 18 },
    { hour: "6PM", orders: 50 },
    { hour: "7PM", orders: 55 },
    { hour: "8PM", orders: 45 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-sm font-bold text-blue-600">{payload[0].value} orders</p>
            </div>
        );
    }
    return null;
};

const OrdersPerHour = () => {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-800">Orders Per Hour</h3>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f5f9" />
                    <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <YAxis
                        ticks={[0, 15, 30, 45, 60]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#2563eb" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrdersPerHour;