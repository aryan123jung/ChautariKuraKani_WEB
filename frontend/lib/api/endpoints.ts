export const API = {
    Auth: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        WHOAMI: '/api/auth/whoami',
        SEARCH_USERS: "/api/auth/users",
        GET_USER_BY_ID: (userId: string) => `/api/auth/user/${userId}`,
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
    Friends: {
        SEND_REQUEST: (toUserId: string) => `/api/friends/requests/${toUserId}`,
        CANCEL_REQUEST: (toUserId: string) => `/api/friends/requests/${toUserId}`,
        INCOMING_REQUESTS: "/api/friends/requests/incoming",
        OUTGOING_REQUESTS: "/api/friends/requests/outgoing",
        ACCEPT_REQUEST: (requestId: string) => `/api/friends/requests/${requestId}/accept`,
        REJECT_REQUEST: (requestId: string) => `/api/friends/requests/${requestId}/reject`,
        UNFRIEND: (friendUserId: string) => `/api/friends/${friendUserId}`,
        STATUS: (userId: string) => `/api/friends/status/${userId}`,
    },
    Notifications: {
        ALL: "/api/notifications",
        MARK_READ: (notificationId: string) => `/api/notifications/${notificationId}/read`,
        MARK_ALL_READ: "/api/notifications/read-all",
    },
    Messages: {
        GET_OR_CREATE_CONVERSATION: (otherUserId: string) =>
            `/api/messages/conversations/${otherUserId}`,
        LIST_CONVERSATIONS: "/api/messages/conversations",
        LIST_MESSAGES: (conversationId: string) => `/api/messages/${conversationId}`,
        SEND_MESSAGE: (conversationId: string) => `/api/messages/${conversationId}`,
        MARK_READ: (conversationId: string) => `/api/messages/${conversationId}/read`,
    },
    Calls: {
        ALL: "/api/calls",
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
