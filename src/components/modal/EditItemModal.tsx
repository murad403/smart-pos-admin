/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useGetAllProductionStationQuery,
  useUpdateItemMutation,
} from "@/redux/features/menu/menu.api";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item: any;
};

const EditItemModal: React.FC<Props> = ({ open, onClose, onSuccess, item }) => {
  const t = useTranslations("Menu");

  // Fetch production stations with limit 100
  const { data: stationsRes, isLoading: isStationsLoading } = useGetAllProductionStationQuery({ limit: 100 });
  const stations = stationsRes?.data ?? [];

  // Mutation
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

  // Basic Form States
  const [name, setName] = useState("");
  const [itemType, setItemType] = useState<"INDIVIDUAL" | "PACKET">("INDIVIDUAL");
  const [price, setPrice] = useState<number | "">("");
  const [productionStationId, setProductionStationId] = useState<string>("");
  const [inventoryQty, setInventoryQty] = useState<number | "">("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  // Promotion States
  const [hasPromo, setHasPromo] = useState(false);
  const [promoName, setPromoName] = useState("");
  const [promoPrice, setPromoPrice] = useState<number | "">("");

  // Packet States
  const [maxPacketItems, setMaxPacketItems] = useState<number | "">("");

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LABEL_OPTIONS = [
    { key: "BEST_SELLER", label: t("bestSeller") || "Best Seller" },
    { key: "RECOMMENDED", label: t("recommended") || "Recommended" },
    { key: "FAVORITE", label: t("favorite") || "Favorite" },
    { key: "MUST_TRY", label: t("mustTry") || "Must Try" },
    { key: "NEW", label: t("new") || "New" },
    { key: "VEGETARIAN", label: t("vegetarian") || "Vegetarian" },
    { key: "KIDS_CHOICE", label: t("kidsChoice") || "Kids Choice" },
    { key: "SPICY", label: t("spicy") || "Spicy" },
  ];

  // Initialize form when item changes
  useEffect(() => {
    if (item && open) {
      setName(item.name || "");
      setItemType(item.itemType || "INDIVIDUAL");
      setPrice(item.price ? Number(item.price) : "");
      setProductionStationId(item.productionStationId ? String(item.productionStationId) : "");
      setInventoryQty(item.inventoryQty ? Number(item.inventoryQty) : "");
      setSelectedLabels(item.labels || []);
      setIsVisible(item.isVisible ?? true);
      setIsOutOfStock(item.isOutOfStock ?? false);
      setHasPromo(item.hasPromo ?? false);
      setPromoName(item.promoName || "");
      setPromoPrice(item.promoPrice ? Number(item.promoPrice) : "");
      setMaxPacketItems(item.maxPacketItems ? Number(item.maxPacketItems) : "");
      setImageFile(null);
      setImagePreview(item.imageUrl || null);
    }
  }, [item, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(item.imageUrl || null);
    }
  };

  const toggleLabel = (labelKey: string) => {
    if (selectedLabels.includes(labelKey)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== labelKey));
    } else {
      setSelectedLabels([...selectedLabels, labelKey]);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Item Name is required");
      return;
    }

    try {
      const payload: any = {
        name,
        itemType,
        price: price === "" ? 0 : Number(price),
        isVisible,
        isOutOfStock,
        hasPromo,
      };

      // Set optional values or clear them
      payload.productionStationId = productionStationId ? Number(productionStationId) : null;
      payload.inventoryQty = inventoryQty !== "" ? Number(inventoryQty) : null;
      payload.labels = selectedLabels;
      payload.promoName = hasPromo && promoName.trim() ? promoName : null;
      payload.promoPrice = hasPromo && promoPrice !== "" ? Number(promoPrice) : null;
      payload.maxPacketItems = itemType === "PACKET" && maxPacketItems !== "" ? Number(maxPacketItems) : null;

      // Create FormData for multipart request
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      toast.loading("Updating item...", { id: "edit-item-toast" });

      await updateItem({ itemId: item.id, data: formData }).unwrap();

      toast.success("Item updated successfully!", { id: "edit-item-toast" });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update item", { id: "edit-item-toast" });
    }
  };

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 transition-all scale-100">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Product Item</h2>
              <p className="text-sm text-gray-500 mt-1">Modify item properties, pricing, and active promotions.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* General Settings Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 tracking-wide uppercase">General Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Item Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter item name (e.g. Grilled Salmon)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
                  />
                </div>

                {/* Item Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Type</label>
                  <div className="relative">
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value as any)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 appearance-none cursor-pointer pr-8"
                    >
                      <option value="INDIVIDUAL">Individual Item</option>
                      <option value="PACKET">Packet / Combo Meal</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
                  />
                </div>

                {/* Production Station */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Production Destination</label>
                  <div className="relative">
                    <select
                      value={productionStationId}
                      onChange={(e) => setProductionStationId(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 appearance-none cursor-pointer pr-8"
                    >
                      <option value="">Select Production Station...</option>
                      {isStationsLoading ? (
                        <option disabled>Loading stations...</option>
                      ) : (
                        stations.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))
                      )}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Inventory Qty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Inventory Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={inventoryQty}
                    onChange={(e) => setInventoryQty(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0 (leave empty if not tracked)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Upload Product Image */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Product Image</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Upload size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Change Image File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imageFile && (
                  <span className="text-xs text-green-600 font-medium">New Image Selected</span>
                )}
              </div>
              {imagePreview && (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-100 mt-2">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Promotion Section */}
            <div className="border border-gray-200 rounded-xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Promotion Campaign</h3>
                <button
                  type="button"
                  onClick={() => setHasPromo(!hasPromo)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    hasPromo ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      hasPromo ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {hasPromo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 transition-all">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Promotion Label / Name</label>
                    <input
                      type="text"
                      value={promoName}
                      onChange={(e) => setPromoName(e.target.value)}
                      placeholder="e.g. Weekend Special"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Promo Special Price</label>
                    <input
                      type="number"
                      min="0"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Label Selector */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-800">Tag & Label Selectors</h3>
              <p className="text-xs text-gray-500">Tag this item for visibility badges in ordering apps.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {LABEL_OPTIONS.map((opt) => {
                  const isSelected = selectedLabels.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleLabel(opt.key)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10 scale-95"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isVisible ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isVisible ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <div>
                  <span className="text-sm font-semibold text-gray-800 block">Visible on Apps</span>
                  <span className="text-xs text-gray-500">Show this item in active menus</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOutOfStock(!isOutOfStock)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isOutOfStock ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isOutOfStock ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <div>
                  <span className="text-sm font-semibold text-gray-800 block">Out of Stock</span>
                  <span className="text-xs text-gray-500">Mark item as unavailable</span>
                </div>
              </div>
            </div>

            {/* Packet Configuration (Max Items) */}
            {itemType === "PACKET" && (
              <div className="border border-blue-100 rounded-2xl p-5 bg-blue-50/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-blue-900">Packet Configuration</h3>
                    <p className="text-xs text-blue-600 mt-0.5">
                      Define the maximum number of selection choice options.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-blue-900 whitespace-nowrap">Max Choices:</label>
                    <input
                      type="number"
                      min="1"
                      value={maxPacketItems}
                      onChange={(e) => setMaxPacketItems(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-16 border border-blue-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-all border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
