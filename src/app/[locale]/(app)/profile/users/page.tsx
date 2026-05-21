"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import AddAdminModal from "@/components/modal/AddAdminModal";
import UserResetPasswordModal from "@/components/modal/UserResetPasswordModal";
import { useTranslations } from "next-intl";
import CustomPagination from "@/components/shared/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteUserModal from "@/components/modal/DeleteUserModal";
import { toast } from "sonner";
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/features/dashboard/dashboard.api";
import type { UserListItem } from "@/redux/features/dashboard/dashboard.type";
import { Trash2, KeyRound } from "lucide-react";

type SelectedUser = {
    id: number;
    name: string;
    email: string;
};

const UserManagementPage = ({ params }: { params?: Promise<{ locale: string }> }) => {
    if (params) React.use(params);
    const t = useTranslations("Profile");
    const [isAddAdminOpen, setIsAddAdminOpen] = React.useState(false);
    const [isResetPassOpen, setIsResetPassOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<SelectedUser | null>(null);
    const [search, setSearch] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const { data: usersRes, isLoading, isFetching } = useGetAllUsersQuery({
        page: currentPage,
        limit: 10,
        search: search.trim() || undefined,
    });

    const users = usersRes?.data ?? [];
    const pagination = usersRes?.pagination;
    const totalPages = pagination?.totalPages ?? 1;

    const handleResetPassword = (user: SelectedUser) => {
        setSelectedUser(user);
        setIsResetPassOpen(true);
    };

    const handleDeleteUser = (user: SelectedUser) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const result = await deleteUser(selectedUser.id).unwrap();
            toast.success(result.message || "User deleted successfully");
            setIsDeleteOpen(false);
            setSelectedUser(null);
        } catch (error: unknown) {
            const message = error && typeof error === "object" && "data" in error
                ? (error as { data?: { message?: string } }).data?.message
                : undefined;
            const fallbackMessage = error instanceof Error ? error.message : undefined;
            toast.error(message || fallbackMessage || "Failed to delete user");
        }
    };

    const getRoleBadgeClass = (role: string) => {
        if (role === "OWNER") return "bg-emerald-50 text-emerald-600";
        if (role === "ADMIN") return "bg-orange-50 text-orange-600";
        return "bg-blue-50 text-blue-600";
    };

    const getUserColorClass = (role: string) => {
        if (role === "OWNER") return "bg-emerald-50 text-emerald-600";
        if (role === "ADMIN") return "bg-orange-50 text-orange-600";
        return "bg-blue-50 text-blue-600";
    };

    const getUserInitial = (user: UserListItem) => {
        const base = user.name?.trim() || user.email?.trim() || user.slug || "U";
        return base.charAt(0).toUpperCase();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-[32px] font-bold tracking-tight text-slate-900">{t("userManagementTitle") || "USER & ACCESS MANAGEMENT"}</h1>
                    <p className="mt-1 text-slate-500">{t("subtitle")}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsAddAdminOpen(true)}
                        className="h-11 rounded-xl bg-[#1A56DB] px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                    >
                        {t("addAdminStaff")}
                    </Button>
                </div>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-8">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-blue-500" />
                        <h2 className="text-[12px] font-bold uppercase tracking-wider text-blue-600">{t("userManagementTitle") || "USER & ACCESS MANAGEMENT"}</h2>
                    </div>
                    <div className="flex w-full items-center gap-3 md:max-w-sm">
                        <input
                            value={search}
                            onChange={handleSearchChange}
                            placeholder={t("search") || "Search users"}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                </div>

                <p className="mb-6 text-[14px] text-slate-500">{t("resetDescription")}</p>

                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="rounded-2xl border border-slate-100 p-5">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="size-11 rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 space-y-2 border-t border-slate-50 pt-4">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center text-sm text-slate-500">
                        {isFetching ? "Loading users..." : "No users found."}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {users.map((user) => {
                                const displayName = user.name?.trim() || user.email?.trim() || user.slug;
                                const displayEmail = user.email?.trim() || "No email provided";
                                const lastActive = new Date(user.updatedAt || user.createdAt).toLocaleString();

                                return (
                                    <div key={user.id} className="group rounded-2xl border border-slate-100 p-5 transition-all hover:border-blue-200 hover:shadow-md">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex size-11 items-center justify-center rounded-xl font-bold ${getUserColorClass(user.role)}`}>
                                                    {getUserInitial(user)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[15px] font-bold text-slate-900">{displayName}</span>
                                                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wider ${getRoleBadgeClass(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                    <p className="text-[12px] text-slate-500">{displayEmail}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser({ id: user.id, name: displayName, email: displayEmail })}
                                                className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                aria-label={`Delete ${displayName}`}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>

                                        <div className="mb-4 space-y-1 border-t border-slate-50 pt-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t("lastActive")}</p>
                                            <p className="text-[12px] font-medium text-slate-700">{lastActive}</p>
                                        </div>

                                        <button
                                            onClick={() => handleResetPassword({ id: user.id, name: displayName, email: displayEmail })}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-2.5 text-[11px] font-bold uppercase tracking-widest text-blue-600 transition-all hover:bg-blue-50"
                                        >
                                            <KeyRound className="size-4" />
                                            {t("resetPasswordButton") || "RESET PASSWORD"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {pagination && totalPages > 1 && (
                            <CustomPagination
                                currentPage={pagination.page}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>


            {/* Modals */}
            <AddAdminModal open={isAddAdminOpen} onClose={() => setIsAddAdminOpen(false)} />
            <UserResetPasswordModal
                open={isResetPassOpen}
                onClose={() => setIsResetPassOpen(false)}
                userId={selectedUser?.id ?? null}
            />
            <DeleteUserModal
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDeleteUser}
                userName={selectedUser?.name || "User"}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default UserManagementPage;