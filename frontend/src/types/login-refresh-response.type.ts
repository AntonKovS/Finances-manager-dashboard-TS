export type LoginRefreshResponseType = {
    error: boolean,
    message: string,
    validation?: [{
            key: string,
            message: string
        }],
    tokens?: {
        accessToken: string,
        refreshToken: string
    },
    user?: {
        name: string,
        lastName: string,
        id: number,
    },
}