export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    role: string | null;
}

export interface TokenResponse {
    accessToken: string
    refreshToken: string
}