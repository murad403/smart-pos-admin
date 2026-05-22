import baseApi from "../../api/api";



const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: () => {
                return {
                    url: "/orders",
                    method: "GET"
                };
            },
            providesTags: ["orders"]
        }),
        getOrderDetails: builder.query({
            query: (id) => {
                return {
                    url: `/orders/${id}`,
                    method: "GET"
                };
            },
            providesTags: ["orders"]
        }),
        getPendingPaymentOrders: builder.query({
            query: () => {
                return {
                    url: `/orders/pending-payment`,
                    method: "GET"
                };
            },
            providesTags: ["orders"]
        }),
        markOrderReady: builder.mutation({
            query: (orderId: string) => {
                return {
                    url: `/orders/${orderId}/ready`,
                    method: "PATCH"
                };
            },
            invalidatesTags: ["orders"]
        }),
    }),
});

export const {
    useGetAllOrdersQuery,
    useGetOrderDetailsQuery,
    useGetPendingPaymentOrdersQuery,
    useMarkOrderReadyMutation,
} = orderApi;