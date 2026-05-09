"use client";
import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (start: Date | null, end: Date | null) => void;
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}
function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}
function isBetween(date: Date, start: Date, end: Date) {
    return date > start && date < end;
}

const DateRangePicker = ({ startDate, endDate, onChange }: DateRangePickerProps) => {
    const t = useTranslations("DatePicker");
    const tm = useTranslations("Months");
    const td = useTranslations("Days");
    const locale = useLocale();

    const MONTHS = [
        tm("january"), tm("february"), tm("march"), tm("april"), tm("may"), tm("june"),
        tm("july"), tm("august"), tm("september"), tm("october"), tm("november"), tm("december"),
    ];
    const DAYS = [td("sun"), td("mon"), td("tue"), td("wed"), td("thu"), td("fri"), td("sat")];

    const today = new Date();
    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [hovered, setHovered] = useState<Date | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const handleDayClick = (day: number) => {
        const clicked = new Date(viewYear, viewMonth, day);
        if (!startDate || (startDate && endDate)) {
            onChange(clicked, null);
        } else {
            if (clicked < startDate) onChange(clicked, startDate);
            else onChange(startDate, clicked);
            setOpen(false);
        }
    };

    const formatDate = (d: Date | null) => {
        if (!d) return "";
        return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    const effectiveEnd = endDate ?? hovered;

    return (
        <div ref={ref} className="relative flex items-center gap-2">
            {/* Start Date */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
            >
                <span className="text-slate-400 text-xs font-medium">{t("startDate")}</span>
                {startDate && <span className="font-medium text-slate-700">{formatDate(startDate)}</span>}
                <Calendar className="size-4 text-slate-400" />
            </button>

            {/* End Date */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
            >
                <span className="text-slate-400 text-xs font-medium">{t("endDate")}</span>
                {endDate && <span className="font-medium text-slate-700">{formatDate(endDate)}</span>}
                <Calendar className="size-4 text-slate-400" />
            </button>

            {/* Calendar Dropdown */}
            {open && (
                <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                        <button onClick={prevMonth} className="rounded-lg p-1 hover:bg-slate-100">
                            <svg className="size-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold text-slate-700">
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button onClick={nextMonth} className="rounded-lg p-1 hover:bg-slate-100">
                            <svg className="size-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day labels */}
                    <div className="mb-1 grid grid-cols-7 text-center">
                        {DAYS.map(d => (
                            <span key={d} className="py-1 text-[11px] font-medium text-slate-400">{d}</span>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-y-0.5 text-center">
                        {cells.map((day, idx) => {
                            if (!day) return <span key={idx} />;
                            const date = new Date(viewYear, viewMonth, day);
                            const isStart = startDate && isSameDay(date, startDate);
                            const isEnd = endDate && isSameDay(date, endDate);
                            const isInRange = startDate && effectiveEnd && !isStart && !isEnd &&
                                (startDate < effectiveEnd
                                    ? isBetween(date, startDate, effectiveEnd)
                                    : isBetween(date, effectiveEnd, startDate));
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleDayClick(day)}
                                    onMouseEnter={() => setHovered(date)}
                                    onMouseLeave={() => setHovered(null)}
                                    className={`relative h-8 w-full text-xs font-medium transition
                                        ${isStart || isEnd ? "rounded-full bg-blue-600 text-white" : ""}
                                        ${isInRange ? "bg-blue-50 text-blue-700" : ""}
                                        ${!isStart && !isEnd && !isInRange ? "rounded-full text-slate-700 hover:bg-slate-100" : ""}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <button
                            onClick={() => { onChange(null, null); }}
                            className="text-xs text-slate-400 hover:text-slate-600"
                        >
                            {t("clear")}
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            {t("apply")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;