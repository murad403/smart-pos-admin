import baseApi from "../../api/api";
import { GetAllUsersQueryParams, GetAllUsersResponse } from "../dashboard/dashboard.type";
import { ShiftSession, OpenShiftBody, CloseShiftBody, CashProof, ShiftResponse, GetShiftHistoryResponse } from "./workflow.type";

const workflowApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        openShift: builder.mutation<ShiftResponse<ShiftSession>, OpenShiftBody>({
            query: (data) => {
                return {
                    url: "/shift/open",
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["shift-workflow"]
        }),
        getCurrentShift: builder.query<ShiftResponse<ShiftSession | null>, string | number>({
            query: (userId) => {
                return {
                    url: `/shift/current?userId=${userId}`,
                    method: "GET",
                };
            },
            providesTags: ["shift-workflow"]
        }),
        closeShift: builder.mutation<ShiftResponse<ShiftSession>, { shiftId: string; data: CloseShiftBody }>({
            query: ({ shiftId, data }) => {
                return {
                    url: `/shift/close?shiftId=${shiftId}`,
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["shift-workflow"]
        }),
        getShift: builder.query<ShiftResponse<ShiftSession>, string>({
            query: (shiftId) => {
                return {
                    url: `/shift/${shiftId}`,
                    method: "GET",
                };
            },
            providesTags: ["shift-workflow"]
        }),
        getShiftHistory: builder.query<GetShiftHistoryResponse, string | number>({
            query: (userId) => {
                return {
                    url: `/shift/history/${userId}`,
                    method: "GET",
                };
            },
            providesTags: ["shift-workflow"]
        }),
        uploadCashProof: builder.mutation<ShiftResponse<CashProof>, { shiftId: string; currentUserId: number; data: FormData }>({
            query: ({ shiftId, currentUserId, data }) => {
                return {
                    url: `/shift/${shiftId}/cash-proof?uploadedById=${currentUserId}`,
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["shift-workflow"]
        }),
        verifyCashProof: builder.mutation<ShiftResponse<CashProof>, { shiftId: string; proofId: string; data: { verifiedById: number } }>({
            query: ({ shiftId, proofId, data }) => {
                return {
                    url: `/shift/${shiftId}/cash-proof/${proofId}/verify`,
                    method: "PATCH",
                    body: data
                };
            },
            invalidatesTags: ["shift-workflow"]
        }),
        getAllShiftUsers: builder.query<GetAllUsersResponse, GetAllUsersQueryParams | void>({
            query: (params) => {
                const queryParams: Record<string, string> = {};
                if (params?.page) queryParams.page = String(params.page);
                if (params?.limit) queryParams.limit = String(params.limit);
                if (params?.search) queryParams.search = params.search;

                return {
                    url: "/users/for-shift",
                    method: "GET",
                    params: queryParams,
                };
            },
            providesTags: ["users"]
        }),
    }),
});

export const {
    useOpenShiftMutation,
    useGetCurrentShiftQuery,
    useCloseShiftMutation,
    useGetShiftQuery,
    useGetShiftHistoryQuery,
    useUploadCashProofMutation,
    useVerifyCashProofMutation,
    useGetAllShiftUsersQuery
} = workflowApi;