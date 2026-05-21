/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Plus, Search, Edit3, Trash2, Tag, Layers, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddItemModal from "@/components/modal/AddItemModal";
import EditItemModal from "@/components/modal/EditItemModal";
import { useGetAllItemsQuery, useDeleteItemMutation } from "@/redux/features/menu/menu.api";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Image from "next/image";

const ItemManagementPage = () => {
  const t = useTranslations("Menu");

  // RTK Queries
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 450);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: itemsRes, isLoading, refetch } = useGetAllItemsQuery({
    page: currentPage,
    limit,
    search: debouncedSearchValue || undefined,
  });
  const items = itemsRes?.data ?? [];
  const pagination = itemsRes?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  // Modal controls
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Delete Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const filteredItems = items;

  const totalItems = pagination?.total ?? 0;
  const startItem = totalItems > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endItem = Math.min(currentPage * limit, totalItems);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
            currentPage === i
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const handleDelete = async (itemId: number) => {
    try {
      toast.loading("Deleting item...", { id: "delete-item-toast" });
      await deleteItem(itemId).unwrap();
      toast.success("Item deleted successfully", { id: "delete-item-toast" });
      setConfirmDeleteId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete item", { id: "delete-item-toast" });
    }
  };

  const getLabelText = (lbl: string) => {
    const maps: Record<string, string> = {
      BEST_SELLER: t("bestSeller") || "Best Seller",
      RECOMMENDED: t("recommended") || "Recommended",
      FAVORITE: t("favorite") || "Favorite",
      MUST_TRY: t("mustTry") || "Must Try",
      NEW: t("new") || "New",
      VEGETARIAN: t("vegetarian") || "Vegetarian",
      KIDS_CHOICE: t("kidsChoice") || "Kids Choice",
      SPICY: t("spicy") || "Spicy",
    };
    return maps[lbl] || lbl;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Product Item Management</h1>
          <p className="mt-1 text-slate-500">Create, customize, and configure individual items or multi-packet combo meals.</p>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="h-11 rounded-[14px] bg-blue-600 hover:bg-blue-700 px-6 text-sm font-semibold text-white shadow-md shadow-blue-500/20"
          >
            <Plus className="mr-1.5 size-4" />
            Add Product Item
          </Button>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name or code..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Items List/Table Container */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-[26px] border border-slate-200 py-16 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Layers className="size-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">No Product Items Found</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Get started by adding your first menu item or packet combo list.
          </p>
          <Button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="mt-6 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white"
          >
            Create First Item
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item: any) => {
            const parsedPrice = item.price ? Number(item.price) : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden"
              >
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Item Image and Title details */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-lg">
                          {item.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          item.itemType === "PACKET"
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          {item.itemType}
                        </span>
                        {item.hasPromo && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                            PROMO
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Code: <strong className="text-slate-700">{item.slug}</strong></span>
                        {item.productionStation && (
                          <span>Station: <strong className="text-slate-700">{item.productionStation.name}</strong></span>
                        )}
                        <span>Stock: <strong className={item.isOutOfStock ? "text-rose-600" : "text-slate-700"}>
                          {item.isOutOfStock ? "Out of Stock" : (item.inventoryQty ?? "Unlimited")}
                        </strong></span>
                      </div>

                      {/* Display Labels */}
                      {item.labels && item.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {item.labels.map((lbl: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-lg px-2 py-0.5"
                            >
                              <Tag size={8} />
                              {getLabelText(lbl)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price info and Status */}
                  <div className="flex items-center gap-6 justify-between w-full md:w-auto md:justify-end">
                      <p className="text-base font-extrabold text-slate-900">
                        Rp{parsedPrice.toLocaleString("en-US")}
                      </p>

                    {/* Visibility status */}
                    <div className="flex flex-col items-center shrink-0">
                      {item.isVisible ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                          <XCircle size={12} /> Hidden
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditOpen(true);
                        }}
                        className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 text-slate-600"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="h-9 w-9 p-0 rounded-xl hover:bg-rose-50 text-rose-500 hover:text-rose-600 border-slate-200"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Packet choices list detail preview */}
                {item.itemType === "PACKET" && item.packetSections && item.packetSections.length > 0 && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/40">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2.5">
                      Combo Content Configuration (Max: {item.maxPacketItems} selections)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {item.packetSections.map((sec: any) => (
                        <div key={sec.id} className="bg-white rounded-xl border border-slate-200/60 p-3 shadow-xs">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                            <span className="text-xs font-bold text-slate-800">{sec.name}</span>
                            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                              Max: {sec.maxQty}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {sec.choices && sec.choices.length > 0 ? (
                              sec.choices.map((ch: any) => (
                                <li key={ch.id} className="text-xs text-slate-500 flex items-center justify-between">
                                  <span>• {ch.name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">Max: {ch.maxQty}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-[11px] text-slate-400 italic">No choice options</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="h-9 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1.5">
              {renderPageButtons()}
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="h-9 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Delete Product Item?</h2>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this product? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refetch}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={refetch}
        item={selectedItem}
      />
    </div>
  );
};

export default ItemManagementPage;