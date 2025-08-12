import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";
import {AuthState} from "@/types/auth";

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    userId: null,
    role: null,
};

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue || null;
    }
    return null;
}

function deleteCookie(name: string) {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            const { accessToken, refreshToken } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;

            const decode : any = jwtDecode(accessToken);
            const userId = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            const role = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            state.userId = userId;
            state.role = role

            console.log("setCredentials:" + userId)

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", userId);
            localStorage.setItem("role", role);
        },
        loadFromCookies: (state) => {
            const accessToken = getCookie('accessToken');
            const refreshToken = getCookie('refreshToken');

            if (accessToken) {
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;

                try {
                    const decode: any = jwtDecode(accessToken);
                    const userId = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    const role = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                    state.userId = userId;
                    state.role = role;
                } catch (error) {
                    console.error("Error decoding token:", error);
                    state.accessToken = null;
                    state.refreshToken = null;
                    state.userId = null;
                    state.role = null;
                }
            }
        },
        updateAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            localStorage.setItem("accessToken", action.payload);
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.userId = null;
            state.role = null;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");

            deleteCookie('accessToken');
            deleteCookie('refreshToken');
        },
    },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;