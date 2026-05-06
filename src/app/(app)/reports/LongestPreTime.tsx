const items = [
    { name: "Soto Ayam Special",   minutes: 12, max: 12 },
    { name: "Ayam Bakar Taliwang", minutes: 8,  max: 12 },
    { name: "Sate Kambing",        minutes: 7,  max: 12 },
    { name: "Soto Ayam (Plate)",   minutes: 5,  max: 12 },
    { name: "Soto Ayam Special",   minutes: 4,  max: 12 },
];

const LongestPreTime = () => {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-800">Items with Longest Prep Time</h3>
            <div className="space-y-4">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="w-44 shrink-0 text-sm text-slate-600">{item.name}</span>
                        <div className="flex flex-1 items-center gap-3">
                            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-red-500"
                                    style={{ width: `${(item.minutes / item.max) * 100}%` }}
                                />
                            </div>
                            <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-700">
                                {item.minutes} m
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LongestPreTime;