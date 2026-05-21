import baseApi from "../../api/api";
import { GetAllMenuResponse, AddMenuBody, AddMenuResponse, UpdateMenuBody, UpdateMenuResponse, DeleteMenuResponse, GetAllSectionResponse, AddSectionBody, AddSectionResponse } from "./menu.type";

const menuApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // menu*********************************************************
        getAllMenu: builder.query<GetAllMenuResponse, void>({
            query: () => {
                return {
                    url: "/menu",
                    method: "GET",
                };
            },
            providesTags: ["menu"],
        }),
        addMenu: builder.mutation<AddMenuResponse, AddMenuBody>({
            query: (data) => {
                return {
                    url: "/menu",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["menu"],
        }),
        deleteMenu: builder.mutation<DeleteMenuResponse, number>({
            query: (menuId) => {
                return {
                    url: `/menu/${menuId}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["menu"],
        }),
        updateMenu: builder.mutation<UpdateMenuResponse, { menuId: number; data: UpdateMenuBody }>({
            query: ({ menuId, data }) => {
                return {
                    url: `/menu/${menuId}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["menu"],
        }),

        // section**************************************************
        addSection: builder.mutation<AddSectionResponse, AddSectionBody>({
            query: (data) => {
                return {
                    url: "/section",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["section"],
        }),
        deleteSection: builder.mutation({
            query: (sectionId) => {
                return {
                    url: `/section/${sectionId}`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["section"],
        }),
        getAllSectionByMenuId: builder.query<GetAllSectionResponse, number>({
            query: (menuId) => {
                return {
                    url: `/section?menuId=${menuId}`,
                    method: "GET",
                };
            },
            providesTags: ["section", "menu"],
        }),
        getAllSectionDetailsByMenuId: builder.query({
            query: (sectionId) => {
                return {
                    url: `/section/${sectionId}`,
                    method: "GET",
                };
            },
            providesTags: ["section"],
        }),
        updateSection: builder.mutation({
            query: ({ data, sectionId }) => {
                return {
                    url: `/section/${sectionId}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["section"],
        }),
        updateSectionVisibilityBulk: builder.mutation({
            query: (data) => {
                return {
                    url: `/section/visibility/bulk`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["section"],
        }),

        // item*******************************************************
        getAllProductionStation: builder.query<any, { limit?: number; page?: number } | void>({
            query: (params) => {
                const limit = params?.limit ?? 100;
                const page = params?.page ?? 1;
                return {
                    url: `/production-station?limit=${limit}&page=${page}`,
                    method: "GET",
                };
            }
        }),
        getAllItems: builder.query<any, { limit?: number; page?: number; search?: string } | void>({
            query: (params) => {
                const queryParams: Record<string, any> = {};
                if (params?.limit) queryParams.limit = params.limit;
                if (params?.page) queryParams.page = params.page;
                if (params?.search) queryParams.search = params.search;
                return {
                    url: `/items`,
                    method: "GET",
                    params: queryParams,
                };
            },
            providesTags: ["item"]
        }),
        addItem: builder.mutation<any, any>({
            query: (data) => {
                return {
                    url: `/items`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["item"]
        }),
        updateItem: builder.mutation<any, { itemId: number; data: any }>({
            query: ({ itemId, data }) => {
                return {
                    url: `/items/${itemId}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["item"]
        }),
        deleteItem: builder.mutation<any, number>({
            query: (itemId) => {
                return {
                    url: `/items/${itemId}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["item"]
        }),
        addPacketSection: builder.mutation<any, { itemId: number; data: any }>({
            query: ({ data, itemId }) => {
                return {
                    url: `/items/${itemId}/packet-sections`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["item"]
        }),
        updatePacketSection: builder.mutation({
            query: ({ data, sId }) => {
                return {
                    url: `/items/packet-sections/${sId}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["item"]
        }),
        deletePacketSection: builder.mutation({
            query: ({ sId }) => {
                return {
                    url: `/items/packet-sections/${sId}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["item"]
        }),
        addPacketSectionChoice: builder.mutation<any, { sid: number; data: any }>({
            query: ({ data, sid }) => {
                return {
                    url: `/items/packet-sections/${sid}/choices`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["item"]
        }),
        updatePacketSectionChoice: builder.mutation({
            query: ({ data, cid }) => {
                return {
                    url: `/items/packet-sections/choices/${cid}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["item"]
        }),
        deletePacketSectionChoice: builder.mutation({
            query: ({ cid }) => {
                return {
                    url: `/items/packet-sections/choices/${cid}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["item"]
        }),
        addItemToSection: builder.mutation({
            query: ({ data, sectionId }) => {
                return {
                    url: `/section/${sectionId}/items`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["section", "menu"]
        }),
        removeItemToSection: builder.mutation({
            query: ({ sectionId, itemId }) => {
                return {
                    url: `/section/${sectionId}/items/${itemId}`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["section", "menu"]
        }),
    }),
});

export const {
    useGetAllMenuQuery,
    useAddMenuMutation,
    useDeleteMenuMutation,
    useUpdateMenuMutation,
    useAddSectionMutation,
    useDeleteSectionMutation,
    useGetAllSectionByMenuIdQuery,
    useGetAllSectionDetailsByMenuIdQuery,
    useUpdateSectionMutation,
    useUpdateSectionVisibilityBulkMutation,
    useGetAllProductionStationQuery,
    useGetAllItemsQuery,
    useAddItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
    useAddPacketSectionMutation,
    useUpdatePacketSectionMutation,
    useDeletePacketSectionMutation,
    useAddPacketSectionChoiceMutation,
    useUpdatePacketSectionChoiceMutation,
    useDeletePacketSectionChoiceMutation,
    useAddItemToSectionMutation,
    useRemoveItemToSectionMutation,
} = menuApi;