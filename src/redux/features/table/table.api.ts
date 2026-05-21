import baseApi from "../../api/api";
import {
    GetTablesResponse,
    GetTablesQueryParams,
    GetTableDetailsResponse,
    AddTableBody,
    AddTableResponse,
    UpdateTableBody,
    UpdateTableResponse,
    DeleteTableResponse
} from "./table.type";

const tableApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTables: builder.query<GetTablesResponse, GetTablesQueryParams | void>({
            query: (params) => {
                const queryParams: Record<string, string> = {};
                if (params?.page) queryParams.page = String(params.page);
                if (params?.limit) queryParams.limit = String(params.limit);
                if (params?.search) queryParams.search = params.search;

                return {
                    url: "/table",
                    method: "GET",
                    params: queryParams,
                };
            },
            providesTags: ["tables"]
        }),
        getTableDetails: builder.query<GetTableDetailsResponse, number>({
            query: (tableId) => {
                return {
                    url: `/table/${tableId}`,
                    method: "GET",
                };
            },
            providesTags: ["tables"]
        }),
        addTable: builder.mutation<AddTableResponse, AddTableBody>({
            query: (data) => {
                return {
                    url: "/table",
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["tables"]
        }),
        updateTable: builder.mutation<UpdateTableResponse, { data: UpdateTableBody; tableId: number }>({
            query: ({ data, tableId }) => {
                return {
                    url: `/table/${tableId}`,
                    method: "PATCH",
                    body: data
                };
            },
            invalidatesTags: ["tables"]
        }),
        deleteTable: builder.mutation<DeleteTableResponse, number>({
            query: (tableId) => {
                return {
                    url: `/table/${tableId}`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["tables"]
        }),
    }),
});

export const {
    useGetTablesQuery,
    useGetTableDetailsQuery,
    useAddTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
} = tableApi;