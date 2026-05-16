import baseApi from "../api/api";


const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            })
        })
    })
});

export const {
    useSignInMutation
} = authApi;