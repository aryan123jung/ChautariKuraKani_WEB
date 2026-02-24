export type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export type ConversationItem = {
  _id: string;
  participants?: Array<string | FriendUser>;
  lastMessage?: string;
  lastMessageAt?: string;
  updatedAt?: string;
};

export type MessageUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export type MessageItem = {
  _id: string;
  conversationId: string;
  senderId: string | MessageUser;
  receiverId: string | MessageUser;
  text: string;
  createdAt?: string;
  readBy?: string[];
};

export type CallType = "audio" | "video";
export type CallStatus = "RINGING" | "ACCEPTED" | "REJECTED" | "MISSED" | "ENDED";

export type CallHistoryItem = {
  _id: string;
  callerId: string | FriendUser;
  calleeId: string | FriendUser;
  status: CallStatus;
  callType: CallType;
  durationSeconds?: number;
  createdAt?: string;
  startedAt?: string;
  endedAt?: string;
};

export type IncomingCall = {
  callId: string;
  callerId: string;
  calleeId: string;
  callType: CallType;
};

export type OutgoingCall = {
  callId: string;
  calleeId: string;
  callType: CallType;
};

export type ActiveCall = {
  callId: string;
  peerUserId: string;
  callType: CallType;
  startedAt: number;
};

export type TimelineItem =
  | { kind: "message"; at: number; item: MessageItem }
  | { kind: "call"; at: number; item: CallHistoryItem };

export type CallOfferPayload = {
  callId: string;
  fromUserId: string;
  offer: RTCSessionDescriptionInit;
};

export type CallAnswerPayload = {
  callId: string;
  fromUserId: string;
  answer: RTCSessionDescriptionInit;
};

export type CallCandidatePayload = {
  callId: string;
  fromUserId: string;
  candidate: RTCIceCandidateInit;
};
