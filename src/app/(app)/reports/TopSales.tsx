const items = [
    { name: "Nasi Goreng Special", category: "Main Course", qty: 245, revenue: "Rp 3,675,000" },
    { name: "Ayam Bakar",          category: "Main Course", qty: 198, revenue: "Rp 3,960,000" },
    { name: "Es Teh Manis",        category: "Beverages",   qty: 342, revenue: "Rp 1,710,000" },
    { name: "Soto Ayam",           category: "Main Course", qty: 167, revenue: "Rp 2,505,000" },
    { name: "Sate Ayam",           category: "Main Course", qty: 156, revenue: "Rp 3,120,000" },
];

const TopSales = () => {
    return (
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="px-6 pt-5 pb-2">
                <h3 className="text-base font-semibold text-slate-800">Top Sales</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Item</th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Category</th>
                            <th className="px-6 py-3 text-right font-medium text-slate-500">Quantity</th>
                            <th className="px-6 py-3 text-right font-medium text-slate-500">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                                <td className="px-6 py-3.5 text-slate-700">{item.name}</td>
                                <td className="px-6 py-3.5 text-slate-500">{item.category}</td>
                                <td className="px-6 py-3.5 text-right text-slate-700">{item.qty}</td>
                                <td className="px-6 py-3.5 text-right font-medium text-slate-800">{item.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopSales;