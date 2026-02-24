export type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export type FriendRequestItem = {
  _id: string;
  fromUserId: string | FriendUser;
  toUserId: string | FriendUser;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt?: string;
};

export type FriendsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  friends: FriendUser[];
};
