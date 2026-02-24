export type HomeFriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export type HomeConversationItem = {
  _id?: string;
  participants?: Array<string | HomeFriendUser>;
  lastMessage?: string;
};

export type HomeUserData = {
  firstName: string;
  lastName: string;
  profileUrl?: string;
};

export type ChatMessage = {
  role: "user" | "ai";
  text: string;
};
