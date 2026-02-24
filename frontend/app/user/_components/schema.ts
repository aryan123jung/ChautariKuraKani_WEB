export type UserData = {
  firstName: string;
  lastName: string;
  profileUrl?: string;
};

export type NavbarProps = {
  onMenuClick: () => void;
};

export type SearchUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export type SearchCommunity = {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  profileUrl?: string;
};

export type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
  profileImage?: string;
};

export type IncomingFriendRequest = {
  _id: string;
  fromUserId: string | FriendUser;
  toUserId: string | FriendUser;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt?: string;
};

export type NotificationItem = {
  _id: string;
  actorUserId?: string | FriendUser;
  type:
    | "FRIEND_REQUEST_SENT"
    | "FRIEND_REQUEST_ACCEPTED"
    | "POST_LIKED"
    | "POST_COMMENTED";
  entityType?: string;
  entityId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
};

export type MessageEvent = {
  _id: string;
  text?: string;
  senderId?: string | FriendUser;
  conversationId?: string;
  createdAt?: string;
};

export type MessageAlertItem = {
  id: string;
  senderName: string;
  senderAvatar?: string | null;
  text: string;
  conversationId?: string;
  isRead: boolean;
  createdAt?: string;
};

export type SideNavbarProps = {
  open: boolean;
  onClose: () => void;
  user: UserData;
};
