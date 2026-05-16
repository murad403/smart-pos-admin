"use client";

import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";

type CategoryAccess = {
  qrTable: boolean;
  screen: boolean;
  service: boolean;
  admin: boolean;
};

type CategoryItem = {
  id: string;
  name: string;
  access: CategoryAccess;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (categories: CategoryItem[]) => void;
};

const AddCategoryModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: "1", name: "Category 1", access: { qrTable: true, screen: true, service: true, admin: true } },
    { id: "2", name: "Category 2", access: { qrTable: true, screen: true, service: true, admin: true } },
    { id: "3", name: "Category 3", access: { qrTable: true, screen: true, service: true, admin: true } },
    { id: "4", name: "Category 4", access: { qrTable: false, screen: false, service: false, admin: false } },
    { id: "5", name: "Category 5", access: { qrTable: false, screen: false, service: false, admin: false } },
  ]);

  const [tags, setTags] = useState([
    { id: "stater", label: "Stater", active: true },
    { id: "main", label: "Main", active: false },
    { id: "dessert", label: "Dessert", active: false },
    { id: "drink", label: "Drink", active: false },
  ]);

  const [categoryToAdd, setCategoryToAdd] = useState("Main");

  if (!open) return null;

  const handleToggleAccess = (id: string, field: keyof CategoryAccess) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, access: { ...cat.access, [field]: !cat.access[field] } } : cat
      )
    );
  };

  const handleUpdateName = (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const handleAddTag = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setTags([...tags, { id: newId, label: categoryToAdd, active: false }]);
  };

  const handleRemoveTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: '1.4fr 0.8fr 1fr 1fr 1fr',
    gap: '12px',
    alignItems: 'center'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[500px] rounded-[32px] bg-white p-7 shadow-2xl overflow-hidden font-sans">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="mb-7 mt-1">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Category Management</h2>
        </div>

        {/* Add Category Section */}
        <div className="mb-6">
          <label className="block text-[16px] font-bold text-gray-900 mb-2.5">Add Category</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                value={categoryToAdd}
                onChange={(e) => setCategoryToAdd(e.target.value)}
                className="w-full appearance-none rounded-[14px] bg-[#F1F5F9] px-4 py-3.5 text-[16px] text-gray-400 outline-none cursor-pointer"
              >
                <option value="Main">Main</option>
                <option value="Stater">Stater</option>
                <option value="Dessert">Dessert</option>
                <option value="Drink">Drink</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="flex items-center gap-1.5 rounded-[12px] bg-[#3B82F6] px-6 py-3 text-[15px] font-bold text-white transition hover:bg-blue-600 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <Plus size={18} strokeWidth={3} />
              Add
            </button>
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setTags(tags.map(t => ({ ...t, active: t.id === tag.id })))}
              className={`flex items-center gap-2.5 rounded-[16px] px-5 py-2.5 text-[16px] font-medium transition-all ${
                tag.active
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30"
                  : "bg-[#F1F5F9] text-gray-400 hover:bg-gray-200"
              }`}
            >
              {tag.label}
              {tag.active && (
                <X 
                  size={16} 
                  className="ml-1 opacity-90 hover:opacity-100" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag.id);
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Settings Table Box */}
        <div className="mb-8 rounded-[28px] border border-gray-100 p-5 bg-white shadow-sm overflow-hidden">
          {/* Table Header */}
          <div style={gridStyle} className="mb-4 px-1">
            <span className="text-[14px] font-bold text-gray-900 leading-tight">Category<br />Naming</span>
            <span className="text-center text-[14px] font-bold text-gray-900 leading-[1.1]">QR<br />Table</span>
            <span className="text-center text-[14px] font-bold text-gray-900">Screen</span>
            <span className="text-center text-[14px] font-bold text-gray-900">Service</span>
            <span className="text-center text-[14px] font-bold text-gray-900">Admin</span>
          </div>

          {/* Table Rows */}
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                style={gridStyle}
                className={`pt-4 border-t border-gray-50 first:border-0 first:pt-0 px-1`}
              >
                <div className="relative group">
                  <input 
                    value={cat.name}
                    onChange={(e) => handleUpdateName(cat.id, e.target.value)}
                    className="w-full rounded-[12px] bg-[#F1F5F9] px-4 py-3 text-[14px] text-gray-700 font-medium outline-none border-2 border-transparent focus:border-blue-200 focus:bg-blue-50/30 transition-all"
                    placeholder="Category Name"
                  />
                </div>
                <div className="flex justify-center items-center">
                  <ImageCheckbox 
                    checked={cat.access.qrTable} 
                    onChange={() => handleToggleAccess(cat.id, 'qrTable')}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <ImageCheckbox 
                    checked={cat.access.screen} 
                    onChange={() => handleToggleAccess(cat.id, 'screen')}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <ImageCheckbox 
                    checked={cat.access.service} 
                    onChange={() => handleToggleAccess(cat.id, 'service')}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <ImageCheckbox 
                    checked={cat.access.admin} 
                    onChange={() => handleToggleAccess(cat.id, 'admin')}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] border border-gray-200 px-7 py-3 text-[16px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
                onSave?.(categories);
                onClose();
            }}
            className="rounded-[14px] bg-[#2563EB] px-8 py-3 text-[16px] font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-500/30 active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`flex h-6 w-6 items-center justify-center rounded-[6px] border-2 transition-all duration-200 shrink-0 ${
      checked 
        ? "border-[#3B82F6] bg-[#3B82F6] text-white" 
        : "border-gray-100 bg-[#F1F5F9] hover:border-gray-200"
    }`}
  >
    {checked && <Check size={14} strokeWidth={4} />}
  </button>
);

export default AddCategoryModal;