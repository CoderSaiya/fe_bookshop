import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {RootState} from "@/store";
import { setCredentials, logout } from "@/store/slices/authSlice";
import {TokenResponse} from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

console.log(BASE_URL);

const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);

        if (result.error && result.error.status === 401) {
            const refreshToken = (api.getState() as RootState).auth.refreshToken;
            if (!refreshToken) {
                api.dispatch(logout());
                return result;
            }

            const refreshResult = await baseQuery(
                { url: "/Auth/refresh", method: "POST", body: { refreshToken } },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const { accessToken, refreshToken: newRefresh } = refreshResult.data as TokenResponse;
                api.dispatch(setCredentials({ accessToken, refreshToken: newRefresh }));
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        }

        return result;
    };

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

    }),
});


export const {

} = api;