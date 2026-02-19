export const API = {
    Auth: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/send-reset-password-email',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    Post: {
        CREATE: "/api/post",
        ALL: "/api/post",
        GET_ONE: (postId: string) => `/api/post/${postId}`,
        LIKE: (postId: string) => `/api/post/${postId}/like`,
        COMMENTS: (postId: string) => `/api/post/${postId}/comments`,
        DELETE_COMMENT: (postId: string, commentId: string) =>
            `/api/post/${postId}/comments/${commentId}`,
        UPDATE: (postId: string) => `/api/post/${postId}`,
        DELETE: (postId: string) => `/api/post/${postId}`,
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
