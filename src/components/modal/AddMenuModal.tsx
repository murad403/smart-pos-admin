/* eslint-disable react-hooks/incompatible-library */
"use client";
import React, { useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGetAllItemsQuery, useAddItemToSectionMutation } from "@/redux/features/menu/menu.api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  sectionId: number | null;
};

const AddMenuModal: React.FC<Props> = ({ open, onClose, onSave, sectionId }) => {
  const t = useTranslations("Menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Fetch all items with limit 100 to populate search dropdown
  const { data: itemsRes, isLoading: isItemsLoading } = useGetAllItemsQuery(
    { limit: 100 },
    { skip: !open }
  );

  const [addItemToSection, { isLoading: isSaving }] = useAddItemToSectionMutation();

  const items = itemsRes?.data ?? [];

  // Filter items by search text
  const filteredItems = items.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!sectionId) {
      toast.error("Invalid section ID");
      return;
    }
    if (!selectedItemId) {
      toast.error("Please select an item to add");
      return;
    }

    try {
      await addItemToSection({
        sectionId,
        data: { itemId: selectedItemId },
      }).unwrap();
      toast.success("Item added to section successfully!");
      onSave?.();
      onClose();
      setSelectedItemId(null);
      setSearchQuery("");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to add item to section");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Add Item to Section</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content & Search */}
        <div className="p-6 flex flex-col flex-1 overflow-hidden min-h-0">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Select Existing Item
          </label>
          <div className="relative mb-4 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by name..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* List of items */}
          <div className="flex-1 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50 bg-white">
            {isItemsLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-lg bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3 bg-slate-100 rounded" />
                      <Skeleton className="h-3 w-1/3 bg-slate-100 rounded" />
                    </div>
                    <Skeleton className="w-5 h-5 rounded-full bg-slate-100 shrink-0" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No items found matching search
              </div>
            ) : (
              filteredItems.map((item: any) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left border-l-2 ${
                      isSelected
                        ? "bg-blue-50/40 border-blue-500 hover:bg-blue-50/60"
                        : "border-transparent"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/60 shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-100">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Price: Rp {Number(item.price || 0).toLocaleString("en-US")}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !selectedItemId}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 className="animate-spin" size={16} />}
            Add to Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMenuModal;