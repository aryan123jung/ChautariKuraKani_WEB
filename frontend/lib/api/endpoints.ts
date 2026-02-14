export const API = {
    Auth: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/send-reset-password-email',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN:{
        USER:{
            CREATE: '/api/admin/users',
            ALL: "/api/admin/users", 
            DELETE: (userId: string) => `/api/admin/users/${userId}`,
            UPDATE: (userId: string) => `/api/admin/users/${userId}`,
            GET_ONE_User: (userId: string) => `/api/admin/users/${userId}`
        }
    }
}