/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Plus, Edit3, Trash2, Factory, CheckCircle2, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllProductionStationQuery,
  useAddProductionStationMutation,
  useUpdateProductionStationMutation,
  useDeleteProductionStationMutation,
} from "@/redux/features/menu/menu.api";
import { toast } from "sonner";
import CustomPagination from "@/components/shared/CustomPagination";


const ProductionStationPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15;

  const { data: stationsRes, isLoading } = useGetAllProductionStationQuery({
    page: currentPage,
    limit,
  });
  const stations = stationsRes?.data ?? [];
  const pagination = stationsRes?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  // Mutations
  const [addStation, { isLoading: isAdding }] = useAddProductionStationMutation();
  const [updateStation, { isLoading: isUpdating }] = useUpdateProductionStationMutation();
  const [deleteStation] = useDeleteProductionStationMutation();

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<any>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSortOrder, setFormSortOrder] = useState<number | "">("");

  const resetForm = () => {
    setFormName("");
    setFormIsActive(true);
    setFormSortOrder("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (station: any) => {
    setEditingStation(station);
    setFormName(station.name || "");
    setFormIsActive(station.isActive ?? true);
    setFormSortOrder(station.sortOrder ?? "");
    setIsEditOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Station name is required");
      return;
    }
    try {
      const body: any = { name: formName.trim() };
      if (formSortOrder !== "") body.sortOrder = Number(formSortOrder);
      if (!formIsActive) body.isActive = false;

      toast.loading("Creating station...", { id: "station-toast" });
      await addStation(body).unwrap();
      toast.success("Production station created successfully", { id: "station-toast" });
      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to create station", { id: "station-toast" });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !editingStation) {
      toast.error("Station name is required");
      return;
    }
    try {
      const body: any = { name: formName.trim() };
      if (formSortOrder !== "") body.sortOrder = Number(formSortOrder);
      body.isActive = formIsActive;

      toast.loading("Updating station...", { id: "station-toast" });
      await updateStation({ stationId: editingStation.id, data: body }).unwrap();
      toast.success("Production station updated successfully", { id: "station-toast" });
      setIsEditOpen(false);
      setEditingStation(null);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update station", { id: "station-toast" });
    }
  };

  const handleDelete = async (stationId: number) => {
    try {
      toast.loading("Deleting station...", { id: "station-toast" });
      await deleteStation(stationId).unwrap();
      toast.success("Production station deleted successfully", { id: "station-toast" });
      setConfirmDeleteId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete station", { id: "station-toast" });
    }
  };



  // Shared modal form JSX
  const renderStationForm = (onSubmit: (e: React.FormEvent) => void, isSubmitting: boolean, submitLabel: string, title: string, subtitle: string, onClose: () => void) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 transition-all scale-100">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Station Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Station Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter station name (e.g. Kitchen, Bar)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sort Order</label>
              <input
                type="number"
                min="0"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Optional (e.g. 1, 2, 3)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
              />
            </div>

            {/* Active Status Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setFormIsActive(!formIsActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formIsActive ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formIsActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <div>
                <span className="text-sm font-semibold text-gray-800 block">Active Status</span>
                <span className="text-xs text-gray-500">{formIsActive ? "This station is active and operational" : "This station is currently inactive"}</span>
              </div>
            </div>

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
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Production Stations</h1>
          <p className="mt-1 text-slate-500">Manage kitchen and bar preparation stations for order routing.</p>
        </div>
        <div>
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="h-11 rounded-[14px] bg-blue-600 hover:bg-blue-700 px-6 text-sm font-semibold text-white shadow-md shadow-blue-500/20"
          >
            <Plus className="mr-1.5 size-4" />
            Add Station
          </Button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : stations.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Factory className="size-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">No Production Stations Found</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Get started by adding your first production station to route orders.
          </p>
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="mt-6 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white"
          >
            Create First Station
          </Button>
        </div>
      ) : (
        /* Station Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="py-4 pl-5 pr-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="py-4 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
                  <th className="py-4 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Station Name</th>
                  <th className="py-4 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Sort Order</th>
                  <th className="py-4 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 pl-3 pr-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stations.map((station: any) => (
                  <tr key={station.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="py-4 pl-5 pr-3">
                      <span className="text-sm font-bold text-slate-400">#{station.id}</span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{station.slug}</span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                          <Factory className="size-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{station.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="text-sm font-semibold text-slate-600">{station.sortOrder}</span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      {station.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-3 pr-5">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleOpenEdit(station)}
                          className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 text-slate-600"
                        >
                          <Edit3 size={15} />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setConfirmDeleteId(station.id)}
                          className="h-9 w-9 p-0 rounded-xl hover:bg-rose-50 text-rose-500 hover:text-rose-600 border-slate-200"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Delete Production Station?</h2>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this station? This action is permanent and cannot be undone.
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

      {/* Add Station Modal */}
      {isAddOpen &&
        renderStationForm(
          handleAdd,
          isAdding,
          "Create Station",
          "Add Production Station",
          "Configure a new production station for order routing.",
          () => { setIsAddOpen(false); resetForm(); }
        )
      }

      {/* Edit Station Modal */}
      {isEditOpen &&
        renderStationForm(
          handleUpdate,
          isUpdating,
          "Save Changes",
          "Edit Production Station",
          "Modify station properties and active status.",
          () => { setIsEditOpen(false); setEditingStation(null); resetForm(); }
        )
      }
    </div>
  );
};

export default ProductionStationPage;