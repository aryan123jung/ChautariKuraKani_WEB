"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { Phone, Send, Video } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { handleGetMyFriends } from "@/lib/actions/friend-action";
import CallModal from "./CallModal";
import {
  handleGetOrCreateConversation,
  handleListConversations,
  handleListMessages,
  handleMarkConversationRead,
  handleSendMessage,
} from "@/lib/actions/message-action";

type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type ConversationItem = {
  _id: string;
  participants?: Array<string | FriendUser>;
  lastMessage?: string;
  lastMessageAt?: string;
  updatedAt?: string;
};

type MessageUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type MessageItem = {
  _id: string;
  conversationId: string;
  senderId: string | MessageUser;
  receiverId: string | MessageUser;
  text: string;
  createdAt?: string;
  readBy?: string[];
};

type CallType = "audio" | "video";

type IncomingCall = {
  callId: string;
  callerId: string;
  calleeId: string;
  callType: CallType;
};

type OutgoingCall = {
  callId: string;
  calleeId: string;
  callType: CallType;
};

type ActiveCall = {
  callId: string;
  peerUserId: string;
  callType: CallType;
  startedAt: number;
};

type CallOfferPayload = {
  callId: string;
  fromUserId: string;
  offer: RTCSessionDescriptionInit;
};

type CallAnswerPayload = {
  callId: string;
  fromUserId: string;
  answer: RTCSessionDescriptionInit;
};

type CallCandidatePayload = {
  callId: string;
  fromUserId: string;
  candidate: RTCIceCandidateInit;
};

const getUserId = (user: string | MessageUser | FriendUser | undefined) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id || "";
};

const getUserName = (user: string | MessageUser | FriendUser | undefined) => {
  if (!user || typeof user === "string") return "User";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
};

const getUserAvatar = (user: string | MessageUser | FriendUser | undefined) => {
  if (!user || typeof user === "string") return null;
  return user.profileUrl || null;
};

const buildProfileImageUrl = (profileUrl?: string | null) => {
  if (!profileUrl) return null;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${backendUrl}/uploads/profile/${profileUrl}`;
};

const getAuthTokenFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const CALL_ICE_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];

export default function MessageClient({ currentUserId }: { currentUserId: string }) {
  const searchParams = useSearchParams();
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<OutgoingCall | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callSeconds, setCallSeconds] = useState(0);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const incomingRingtoneRef = useRef<HTMLAudioElement | null>(null);
  const outgoingRingbackRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const currentCallIdRef = useRef<string | null>(null);
  const currentPeerUserIdRef = useRef<string | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);
  const incomingCallRef = useRef<IncomingCall | null>(null);
  const outgoingCallRef = useRef<OutgoingCall | null>(null);
  const activeCallRef = useRef<ActiveCall | null>(null);
  const friendsRef = useRef<FriendUser[]>([]);
  const conversationsRef = useRef<ConversationItem[]>([]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  const activeChatUser = useMemo(() => {
    if (!activeConversation) return null;
    return (activeConversation.participants || []).find(
      (participant) => getUserId(participant) !== currentUserId
    );
  }, [activeConversation, currentUserId]);

  const filteredFriends = useMemo(() => {
    const keyword = friendSearch.trim().toLowerCase();
    if (!keyword) return friends;

    return friends.filter((friend) => {
      const name = `${friend.firstName || ""} ${friend.lastName || ""}`.toLowerCase();
      return name.includes(keyword) || (friend.username || "").toLowerCase().includes(keyword);
    });
  }, [friends, friendSearch]);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  useEffect(() => {
    outgoingCallRef.current = outgoingCall;
  }, [outgoingCall]);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  useEffect(() => {
    friendsRef.current = friends;
  }, [friends]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const getUserById = useCallback(
    (id?: string | null): FriendUser | null => {
      if (!id) return null;

      const friend = friendsRef.current.find((item) => item._id === id);
      if (friend) return friend;

      for (const conversation of conversationsRef.current) {
        const matched = (conversation.participants || []).find(
          (participant) => getUserId(participant) === id
        );
        if (matched && typeof matched !== "string") {
          return {
            _id: matched._id,
            firstName: matched.firstName,
            lastName: matched.lastName,
            username: matched.username,
            profileUrl: matched.profileUrl,
          };
        }
      }

      return null;
    },
    []
  );

  const emitWithAck = useCallback(
    <T,>(eventName: string, payload: object) =>
      new Promise<T>((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket) {
          reject(new Error("Socket not connected"));
          return;
        }

        socket.emit(eventName, payload, (response: { success?: boolean; data?: T; message?: string }) => {
          if (response?.success) {
            resolve(response.data as T);
            return;
          }
          reject(new Error(response?.message || `Failed: ${eventName}`));
        });
      }),
    []
  );

  const stopLocalAndRemoteStreams = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
  }, []);

  const stopCallTones = useCallback(() => {
    if (incomingRingtoneRef.current) {
      incomingRingtoneRef.current.pause();
      incomingRingtoneRef.current.currentTime = 0;
    }

    if (outgoingRingbackRef.current) {
      outgoingRingbackRef.current.pause();
      outgoingRingbackRef.current.currentTime = 0;
    }
  }, []);

  const closePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  }, []);

  const resetCallState = useCallback(() => {
    closePeerConnection();
    stopLocalAndRemoteStreams();
    stopCallTones();
    currentCallIdRef.current = null;
    currentPeerUserIdRef.current = null;
    setIncomingCall(null);
    setOutgoingCall(null);
    setActiveCall(null);
    setCallSeconds(0);
    setIsEndingCall(false);
    setIsMuted(false);
  }, [closePeerConnection, stopLocalAndRemoteStreams, stopCallTones]);

  const ensureLocalStream = useCallback(async (callType: CallType) => {
    if (localStreamRef.current) return localStreamRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video",
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.muted = true;
      void localVideoRef.current.play().catch(() => null);
    }

    return stream;
  }, []);

  const ensurePeerConnection = useCallback(
    async (callId: string, peerUserId: string, callType: CallType) => {
      if (peerConnectionRef.current) return peerConnectionRef.current;

      const socket = socketRef.current;
      if (!socket) {
        throw new Error("Socket not connected");
      }

      const stream = await ensureLocalStream(callType);
      const peerConnection = new RTCPeerConnection({ iceServers: CALL_ICE_SERVERS });

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.onicecandidate = (event) => {
        if (!event.candidate) return;

        socket.emit("call:ice-candidate", {
          callId,
          candidate: event.candidate,
        });
      };

      peerConnection.ontrack = (event) => {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();

          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStreamRef.current;
            void remoteAudioRef.current.play().catch(() => null);
          }

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
            void remoteVideoRef.current.play().catch(() => null);
          }
        }

        event.streams[0]?.getTracks().forEach((track) => {
          remoteStreamRef.current?.addTrack(track);
        });
      };

      peerConnection.onconnectionstatechange = () => {
        if (
          peerConnection.connectionState === "failed" ||
          peerConnection.connectionState === "disconnected" ||
          peerConnection.connectionState === "closed"
        ) {
          resetCallState();
        }
      };

      currentCallIdRef.current = callId;
      currentPeerUserIdRef.current = peerUserId;
      peerConnectionRef.current = peerConnection;

      return peerConnection;
    },
    [ensureLocalStream, resetCallState]
  );

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const response = await handleListConversations(1, 50);
      if (response.success) {
        const conversationList = (response.data || []) as ConversationItem[];
        setConversations(conversationList);
        if (!activeConversationId && conversationList.length > 0) {
          setActiveConversationId(conversationList[0]._id);
        }
      } else {
        setConversations([]);
      }
    } finally {
      setIsLoadingConversations(false);
    }
  }, [activeConversationId]);

  const loadFriends = useCallback(async () => {
    const response = await handleGetMyFriends(1, 200);
    if (response.success) {
      setFriends((response.data || []) as FriendUser[]);
    }
  }, []);

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await handleListMessages(conversationId, 1, 100);
      if (response.success) {
        const data = ((response.data || []) as MessageItem[]).slice().reverse();
        setMessages(data);
      } else {
        setMessages([]);
      }
      await handleMarkConversationRead(conversationId);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    void Promise.all([loadConversations(), loadFriends()]);
  }, [loadConversations, loadFriends]);

  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    const conversationIdParam = searchParams.get("conversationId");

    if (conversationIdParam) {
      setActiveConversationId(conversationIdParam);
    }

    if (userIdParam) {
      void startConversation(userIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    void loadMessages(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = getAuthTokenFromCookie();
    if (!token) return;
    if (socketRef.current) return;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
    const socket = io(backendUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("message:new", (incomingMessage: MessageItem) => {
      setConversations((prev) => {
        const exists = prev.some((conversation) => conversation._id === incomingMessage.conversationId);
        const updated = prev.map((conversation) =>
          conversation._id === incomingMessage.conversationId
            ? {
                ...conversation,
                lastMessage: incomingMessage.text,
                lastMessageAt: incomingMessage.createdAt,
              }
            : conversation
        );

        if (!exists) {
          return prev;
        }

        return updated.sort((a, b) => {
          const aTime = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
          const bTime = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
          return bTime - aTime;
        });
      });

      const senderId = getUserId(incomingMessage.senderId);
      if (incomingMessage.conversationId === activeConversationIdRef.current) {
        setMessages((prev) => {
          if (prev.some((message) => message._id === incomingMessage._id)) return prev;
          return [...prev, incomingMessage];
        });
        if (senderId !== currentUserId) {
          void handleMarkConversationRead(incomingMessage.conversationId);
        }
      } else if (senderId !== currentUserId) {
        toast.info("New message received");
      }
    });

    socket.on("call:incoming", (payload: IncomingCall) => {
      if (!payload?.callId) return;

      setIncomingCall({
        callId: payload.callId,
        callerId: payload.callerId,
        calleeId: payload.calleeId,
        callType: payload.callType || "audio",
      });
      toast.info("Incoming call");
    });

    socket.on("call:ringing", ({ callId, calleeId, callType }: { callId: string; calleeId: string; callType: CallType }) => {
      setOutgoingCall({ callId, calleeId, callType: callType || "audio" });
      toast.info("Ringing...");
    });

    socket.on("call:accepted", async ({ callId, by }: { callId: string; by: string }) => {
      const isCaller = by !== currentUserId;
      const peerUserId = isCaller
        ? outgoingCallRef.current?.calleeId || currentPeerUserIdRef.current || ""
        : incomingCallRef.current?.callerId || currentPeerUserIdRef.current || "";
      const callType = outgoingCallRef.current?.callType || incomingCallRef.current?.callType || "audio";

      if (!peerUserId) return;

      setIncomingCall(null);
      setOutgoingCall(null);
      setActiveCall({
        callId,
        peerUserId,
        callType,
        startedAt: Date.now(),
      });
      setCallSeconds(0);

      try {
        const peerConnection = await ensurePeerConnection(callId, peerUserId, callType);

        if (isCaller) {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit("call:offer", { callId, offer });
        }

        toast.success("Call connected");
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to connect call");
        resetCallState();
      }
    });

    socket.on("call:offer", async (payload: CallOfferPayload) => {
      try {
        const peerUserId = payload.fromUserId;
        const callType = incomingCallRef.current?.callType || activeCallRef.current?.callType || "audio";
        const peerConnection = await ensurePeerConnection(payload.callId, peerUserId, callType);

        await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit("call:answer", {
          callId: payload.callId,
          answer,
        });
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to handle call offer");
      }
    });

    socket.on("call:answer", async (payload: CallAnswerPayload) => {
      try {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to handle call answer");
      }
    });

    socket.on("call:ice-candidate", async (payload: CallCandidatePayload) => {
      try {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch {
        // ignore candidate race conditions
      }
    });

    socket.on("call:rejected", ({ by }: { callId: string; by: string }) => {
      const name = getUserName(getUserById(by) || undefined);
      toast.info(`${name} rejected the call`);
      resetCallState();
    });

    socket.on("call:missed", ({ userId }: { callId: string; userId: string }) => {
      const name = getUserName(getUserById(userId) || undefined);
      toast.info(`Missed call with ${name}`);
      resetCallState();
    });

    socket.on("call:ended", ({ by }: { callId: string; by: string }) => {
      const byMe = by === currentUserId;
      if (!byMe) {
        const name = getUserName(getUserById(by) || undefined);
        toast.info(`${name} ended the call`);
      }
      resetCallState();
    });

    socketRef.current = socket;

    return () => {
      socket.off("message:new");
      socket.off("call:incoming");
      socket.off("call:ringing");
      socket.off("call:accepted");
      socket.off("call:offer");
      socket.off("call:answer");
      socket.off("call:ice-candidate");
      socket.off("call:rejected");
      socket.off("call:missed");
      socket.off("call:ended");
      socket.disconnect();
      socketRef.current = null;
      resetCallState();
    };
  }, [currentUserId, ensurePeerConnection, getUserById, resetCallState]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeConversationId) return;

    socket.emit("conversation:join", activeConversationId);
    return () => {
      socket.emit("conversation:leave", activeConversationId);
    };
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeCall) {
      setCallSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setCallSeconds(Math.max(0, Math.floor((Date.now() - activeCall.startedAt) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall]);

  useEffect(() => {
    const incomingTone = incomingRingtoneRef.current;
    const outgoingTone = outgoingRingbackRef.current;

    if (!incomingTone || !outgoingTone) return;

    if (incomingCall && !activeCall) {
      outgoingTone.pause();
      outgoingTone.currentTime = 0;
      void incomingTone.play().catch(() => null);
      return;
    }

    if (outgoingCall && !activeCall) {
      incomingTone.pause();
      incomingTone.currentTime = 0;
      void outgoingTone.play().catch(() => null);
      return;
    }

    incomingTone.pause();
    incomingTone.currentTime = 0;
    outgoingTone.pause();
    outgoingTone.currentTime = 0;
  }, [incomingCall, outgoingCall, activeCall]);

  const startConversation = async (friendId?: string) => {
    if (!friendId) return;
    const response = await handleGetOrCreateConversation(friendId);
    if (!response.success || !response.data) {
      toast.error(response.message || "Could not open conversation");
      return;
    }

    const conversation = response.data as ConversationItem;
    setConversations((prev) => {
      if (prev.some((item) => item._id === conversation._id)) return prev;
      return [conversation, ...prev];
    });
    setActiveConversationId(conversation._id);
  };

  const sendMessageNow = async () => {
    if (!activeConversationId || isSending) return;
    const text = messageInput.trim();
    if (!text) return;

    setIsSending(true);
    try {
      const response = await handleSendMessage(activeConversationId, text);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to send message");
      }

      const message = response.data as MessageItem;
      setMessages((prev) => {
        if (prev.some((item) => item._id === message._id)) return prev;
        return [...prev, message];
      });
      setMessageInput("");

      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation._id === activeConversationId
              ? { ...conversation, lastMessage: message.text, lastMessageAt: message.createdAt }
              : conversation
          )
          .sort((a, b) => {
            const aTime = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
            const bTime = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
            return bTime - aTime;
          })
      );
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const startCall = async (callType: CallType) => {
    if (incomingCall || outgoingCall || activeCall) {
      toast.info("Another call is already in progress");
      return;
    }

    const calleeId = getUserId(activeChatUser);
    if (!calleeId) {
      toast.info("Select a valid conversation first");
      return;
    }

    try {
      const data = await emitWithAck<{ callId: string }>("call:initiate", {
        calleeId,
        callType,
      });

      if (!data?.callId) {
        throw new Error("Invalid call response");
      }

      setOutgoingCall({ callId: data.callId, calleeId, callType });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to start call");
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      await emitWithAck("call:accept", { callId: incomingCall.callId });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to accept call");
      resetCallState();
    }
  };

  const rejectCall = async () => {
    if (!incomingCall) return;

    try {
      await emitWithAck("call:reject", { callId: incomingCall.callId });
      setIncomingCall(null);
      toast.info("Call rejected");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to reject call");
    }
  };

  const endCall = async () => {
    if (isEndingCall) return;

    const callId = activeCall?.callId || outgoingCall?.callId;
    if (!callId) return;

    setIsEndingCall(true);
    try {
      await emitWithAck("call:end", { callId });
      resetCallState();
      toast.info("Call ended");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to end call");
    } finally {
      setIsEndingCall(false);
    }
  };

  const toggleMute = () => {
    const localStream = localStreamRef.current;
    if (!localStream) return;

    const nextMuted = !isMuted;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    setIsMuted(nextMuted);
  };

  const activeCallUser = getUserById(activeCall?.peerUserId || outgoingCall?.calleeId || incomingCall?.callerId);
  const activeCallName = getUserName(activeCallUser || undefined);
  const activeCallAvatar = buildProfileImageUrl(getUserAvatar(activeCallUser || undefined));

  const callDurationLabel = useMemo(() => {
    const minutes = Math.floor(callSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (callSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [callSeconds]);

  return (
    <section className="relative grid h-full min-h-0 grid-cols-12 gap-4 overflow-hidden">
      <aside className="col-span-4 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-zinc-100">Messages</h2>

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
            Start Chat (Friends)
          </p>
          <input
            value={friendSearch}
            onChange={(event) => setFriendSearch(event.target.value)}
            placeholder="Search friends..."
            className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
          />
          <div className="scrollbar-feed flex gap-2 overflow-x-auto pb-1">
            {filteredFriends.map((friend) => (
              <button
                key={friend._id || friend.username}
                onClick={() => void startConversation(friend._id)}
                className="whitespace-nowrap rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {getUserName(friend)}
              </button>
            ))}
            {filteredFriends.length === 0 && (
              <span className="text-xs text-slate-500 dark:text-zinc-400">No friends found</span>
            )}
          </div>
        </div>

        <div className="scrollbar-feed min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {isLoadingConversations && (
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading conversations...</p>
          )}

          {!isLoadingConversations && conversations.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-zinc-400">No conversations yet.</p>
          )}

          {conversations.map((conversation) => {
            const otherParticipant = (conversation.participants || []).find(
              (participant) => getUserId(participant) !== currentUserId
            );
            const name = getUserName(otherParticipant);
            const avatar = buildProfileImageUrl(getUserAvatar(otherParticipant));
            const isActive = conversation._id === activeConversationId;

            return (
              <button
                key={conversation._id}
                onClick={() => setActiveConversationId(conversation._id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  isActive
                    ? "border-green-500 bg-green-50 dark:border-emerald-500 dark:bg-zinc-800"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-700 dark:text-zinc-200">
                        {name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">{name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                      {conversation.lastMessage || "Say hello"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="col-span-8 flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
            {activeChatUser ? getUserName(activeChatUser) : "Select a conversation"}
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!activeChatUser || !!outgoingCall || !!incomingCall || !!activeCall}
              onClick={() => void startCall("audio")}
              className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              title="Audio call"
            >
              <Phone size={16} />
            </button>
            <button
              type="button"
              disabled={!activeChatUser || !!outgoingCall || !!incomingCall || !!activeCall}
              onClick={() => void startCall("video")}
              className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              title="Video call"
            >
              <Video size={16} />
            </button>
          </div>
        </div>

        <div className="scrollbar-feed min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {!activeConversationId && (
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Select a conversation from the left or start one with a friend.
            </p>
          )}

          {activeConversationId && isLoadingMessages && (
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading messages...</p>
          )}

          {activeConversationId &&
            !isLoadingMessages &&
            messages.map((message) => {
              const isMine = getUserId(message.senderId) === currentUserId;
              return (
                <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      isMine
                        ? "bg-[#76C05D] text-white"
                        : "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        isMine ? "text-white/80" : "text-slate-500 dark:text-zinc-400"
                      }`}
                    >
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <input
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void sendMessageNow();
                }
              }}
              disabled={!activeConversationId || isSending}
              placeholder={activeConversationId ? "Type a message..." : "Select conversation first"}
              className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
            <button
              onClick={() => void sendMessageNow()}
              disabled={!activeConversationId || isSending || !messageInput.trim()}
              className="rounded-full bg-[#76C05D] p-2 text-white transition hover:bg-[#67a94f] disabled:opacity-60"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>

      <CallModal
        incomingCall={incomingCall}
        outgoingCall={outgoingCall}
        activeCall={activeCall}
        callName={activeCallName}
        callAvatar={activeCallAvatar}
        callDurationLabel={callDurationLabel}
        isEndingCall={isEndingCall}
        isMuted={isMuted}
        onAccept={() => void acceptCall()}
        onReject={() => void rejectCall()}
        onEnd={() => void endCall()}
        onToggleMute={toggleMute}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        remoteAudioRef={remoteAudioRef}
      />

      <audio
        ref={incomingRingtoneRef}
        src="/sounds/incoming-call.mp3"
        preload="auto"
        loop
        className="hidden"
      />
      <audio
        ref={outgoingRingbackRef}
        src="/sounds/outgoing-call.mp3"
        preload="auto"
        loop
        className="hidden"
      />
    </section>
  );
}
