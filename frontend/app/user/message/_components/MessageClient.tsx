"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { Phone, Video } from "lucide-react";
import { toast } from "react-toastify";
import { handleGetMyFriends } from "@/lib/actions/friend-action";
import { handleListMyCalls } from "@/lib/actions/call-action";
import {
  handleGetOrCreateConversation,
  handleListConversations,
  handleListMessages,
  handleMarkConversationRead,
  handleSendMessage,
} from "@/lib/actions/message-action";
import CallModal from "./CallModal";
import MessageSidebar from "./MessageSidebar";
import MessageTimeline from "./MessageTimeline";
import MessageComposer from "./MessageComposer";
import type {
  ActiveCall,
  CallHistoryItem,
  CallType,
  ConversationItem,
  FriendUser,
  IncomingCall,
  MessageItem,
  TimelineItem,
  OutgoingCall,
} from "./message-types";
import {
  buildProfileImageUrl,
  formatCallDuration,
  getAuthTokenFromCookie,
  getUserAvatar,
  getUserId,
  getUserName,
} from "./message-helpers";

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

const CALL_ICE_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];

export default function MessageClient({ currentUserId }: { currentUserId: string }) {
  const searchParams = useSearchParams();

  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
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
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

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

  const getUserById = useCallback((id?: string | null): FriendUser | null => {
    if (!id) return null;

    const friend = friendsRef.current.find((item) => item._id === id);
    if (friend) return friend;

    for (const conversation of conversationsRef.current) {
      const match = (conversation.participants || []).find((participant) => getUserId(participant) === id);
      if (match && typeof match !== "string") {
        return {
          _id: match._id,
          firstName: match.firstName,
          lastName: match.lastName,
          username: match.username,
          profileUrl: match.profileUrl,
        };
      }
    }

    return null;
  }, []);

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

  const stopStreams = useCallback(() => {
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
    stopStreams();
    stopCallTones();
    setIncomingCall(null);
    setOutgoingCall(null);
    setActiveCall(null);
    setCallSeconds(0);
    setIsEndingCall(false);
    setIsMuted(false);
  }, [closePeerConnection, stopStreams, stopCallTones]);

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
    async (callId: string, callType: CallType) => {
      if (peerConnectionRef.current) return peerConnectionRef.current;
      const socket = socketRef.current;
      if (!socket) throw new Error("Socket not connected");

      const stream = await ensureLocalStream(callType);
      const peer = new RTCPeerConnection({ iceServers: CALL_ICE_SERVERS });

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.onicecandidate = (event) => {
        if (!event.candidate) return;
        socket.emit("call:ice-candidate", {
          callId,
          candidate: event.candidate,
        });
      };

      peer.ontrack = (event) => {
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

      peer.onconnectionstatechange = () => {
        if (["failed", "disconnected", "closed"].includes(peer.connectionState)) {
          resetCallState();
        }
      };

      peerConnectionRef.current = peer;
      return peer;
    },
    [ensureLocalStream, resetCallState]
  );

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const response = await handleListConversations(1, 50);
      if (response.success) {
        const list = (response.data || []) as ConversationItem[];
        setConversations(list);
        if (!activeConversationId && list.length > 0) {
          setActiveConversationId(list[0]._id);
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

  const loadCallHistory = useCallback(async () => {
    const response = await handleListMyCalls(1, 200);
    if (response.success) {
      setCallHistory((response.data || []) as CallHistoryItem[]);
      return;
    }
    setCallHistory([]);
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await handleListMessages(conversationId, 1, 100);
      if (response.success) {
        const list = ((response.data || []) as MessageItem[]).slice().reverse();
        setMessages(list);
      } else {
        setMessages([]);
      }
      await handleMarkConversationRead(conversationId);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const startConversation = useCallback(async (friendId?: string) => {
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
  }, []);

  useEffect(() => {
    void Promise.all([loadConversations(), loadFriends(), loadCallHistory()]);
  }, [loadConversations, loadFriends, loadCallHistory]);

  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    const conversationIdParam = searchParams.get("conversationId");

    if (conversationIdParam) {
      setActiveConversationId(conversationIdParam);
    }

    if (userIdParam) {
      void startConversation(userIdParam);
    }
  }, [searchParams, startConversation]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    void loadMessages(activeConversationId);
  }, [activeConversationId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, callHistory]);

  useEffect(() => {
    const token = getAuthTokenFromCookie();
    if (!token || socketRef.current) return;

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
            ? { ...conversation, lastMessage: incomingMessage.text, lastMessageAt: incomingMessage.createdAt }
            : conversation
        );
        if (!exists) return prev;
        return updated.sort((a, b) => {
          const aTime = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
          const bTime = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
          return bTime - aTime;
        });
      });

      const senderId = getUserId(incomingMessage.senderId);
      if (incomingMessage.conversationId === activeConversationIdRef.current) {
        setMessages((prev) => (prev.some((item) => item._id === incomingMessage._id) ? prev : [...prev, incomingMessage]));
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
        ? outgoingCallRef.current?.calleeId || ""
        : incomingCallRef.current?.callerId || "";
      const callType = outgoingCallRef.current?.callType || incomingCallRef.current?.callType || "audio";

      if (!peerUserId) return;

      setIncomingCall(null);
      setOutgoingCall(null);
      setActiveCall({ callId, peerUserId, callType, startedAt: Date.now() });
      setCallSeconds(0);

      try {
        const peer = await ensurePeerConnection(callId, callType);
        if (isCaller) {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          socket.emit("call:offer", { callId, offer });
        }
        toast.success("Call connected");
        void loadCallHistory();
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to connect call");
        resetCallState();
      }
    });

    socket.on("call:offer", async (payload: CallOfferPayload) => {
      try {
        const callType = incomingCallRef.current?.callType || activeCallRef.current?.callType || "audio";
        const peer = await ensurePeerConnection(payload.callId, callType);
        await peer.setRemoteDescription(new RTCSessionDescription(payload.offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("call:answer", { callId: payload.callId, answer });
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
        // ignore race
      }
    });

    socket.on("call:rejected", ({ by }: { by: string }) => {
      const name = getUserName(getUserById(by));
      toast.info(`${name} rejected the call`);
      resetCallState();
      void loadCallHistory();
    });

    socket.on("call:missed", ({ userId }: { userId: string }) => {
      const name = getUserName(getUserById(userId));
      toast.info(`Missed call with ${name}`);
      resetCallState();
      void loadCallHistory();
    });

    socket.on("call:ended", ({ by }: { by: string }) => {
      if (by !== currentUserId) {
        const name = getUserName(getUserById(by));
        toast.info(`${name} ended the call`);
      }
      resetCallState();
      void loadCallHistory();
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
  }, [currentUserId, ensurePeerConnection, getUserById, loadCallHistory, resetCallState]);

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

  const sendMessageNow = useCallback(async () => {
    if (!activeConversationId || isSending) return;
    const text = messageInput.trim();
    if (!text) return;

    setIsSending(true);
    try {
      const response = await handleSendMessage(activeConversationId, text);
      if (!response.success || !response.data) throw new Error(response.message || "Failed to send message");

      const message = response.data as MessageItem;
      setMessages((prev) => (prev.some((item) => item._id === message._id) ? prev : [...prev, message]));
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
  }, [activeConversationId, isSending, messageInput]);

  const startCall = useCallback(async (callType: CallType) => {
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
      const data = await emitWithAck<{ callId: string }>("call:initiate", { calleeId, callType });
      if (!data?.callId) throw new Error("Invalid call response");
      setOutgoingCall({ callId: data.callId, calleeId, callType });
      void loadCallHistory();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to start call");
    }
  }, [activeCall, activeChatUser, emitWithAck, incomingCall, loadCallHistory, outgoingCall]);

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    try {
      await emitWithAck("call:accept", { callId: incomingCall.callId });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to accept call");
      resetCallState();
    }
  }, [emitWithAck, incomingCall, resetCallState]);

  const rejectCall = useCallback(async () => {
    if (!incomingCall) return;
    try {
      await emitWithAck("call:reject", { callId: incomingCall.callId });
      setIncomingCall(null);
      toast.info("Call rejected");
      void loadCallHistory();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to reject call");
    }
  }, [emitWithAck, incomingCall, loadCallHistory]);

  const endCall = useCallback(async () => {
    if (isEndingCall) return;
    const callId = activeCall?.callId || outgoingCall?.callId;
    if (!callId) return;

    setIsEndingCall(true);
    try {
      await emitWithAck("call:end", { callId });
      resetCallState();
      toast.info("Call ended");
      void loadCallHistory();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to end call");
    } finally {
      setIsEndingCall(false);
    }
  }, [activeCall, emitWithAck, isEndingCall, loadCallHistory, outgoingCall, resetCallState]);

  const toggleMute = useCallback(() => {
    const localStream = localStreamRef.current;
    if (!localStream) return;

    const nextMuted = !isMuted;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    setIsMuted(nextMuted);
  }, [isMuted]);

  const activeCallUser = getUserById(activeCall?.peerUserId || outgoingCall?.calleeId || incomingCall?.callerId);
  const activeCallName = getUserName(activeCallUser);
  const activeCallAvatar = buildProfileImageUrl(getUserAvatar(activeCallUser));
  const activeChatUserId = getUserId(activeChatUser);

  const filteredCallHistory = useMemo(() => {
    if (!activeChatUserId) return [];
    return callHistory.filter((call) => {
      const callerId = getUserId(call.callerId);
      const calleeId = getUserId(call.calleeId);
      return (
        (callerId === currentUserId && calleeId === activeChatUserId) ||
        (calleeId === currentUserId && callerId === activeChatUserId)
      );
    });
  }, [activeChatUserId, callHistory, currentUserId]);

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const messageItems: TimelineItem[] = messages.map((message) => ({
      kind: "message",
      at: new Date(message.createdAt || 0).getTime(),
      item: message,
    }));

    const callItems: TimelineItem[] = filteredCallHistory.map((call) => ({
      kind: "call",
      at: new Date(call.endedAt || call.startedAt || call.createdAt || 0).getTime(),
      item: call,
    }));

    return [...messageItems, ...callItems].sort((a, b) => a.at - b.at);
  }, [filteredCallHistory, messages]);

  const getCallEventLabel = useCallback(
    (call: CallHistoryItem) => {
      const isOutgoing = getUserId(call.callerId) === currentUserId;
      const direction = isOutgoing ? "Outgoing" : "Incoming";
      const mode = call.callType === "video" ? "Video" : "Audio";

      if (call.status === "MISSED") return `${direction} ${mode} call missed`;
      if (call.status === "REJECTED") return `${direction} ${mode} call declined`;
      if (call.status === "RINGING") return `${direction} ${mode} call ringing`;
      if ((call.status === "ENDED" || call.status === "ACCEPTED") && (call.durationSeconds || 0) > 0) {
        return `${direction} ${mode} call · ${formatCallDuration(call.durationSeconds)}`;
      }
      if (call.status === "ENDED") return `${direction} ${mode} call canceled`;
      return `${direction} ${mode} call`;
    },
    [currentUserId]
  );

  const callDurationLabel = useMemo(() => formatCallDuration(callSeconds), [callSeconds]);

  return (
    <section className="relative grid h-full min-h-0 grid-cols-12 gap-4 overflow-hidden">
      <MessageSidebar
        friends={filteredFriends}
        friendSearch={friendSearch}
        onFriendSearchChange={setFriendSearch}
        onStartConversation={(friendId) => void startConversation(friendId)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        currentUserId={currentUserId}
        onSelectConversation={setActiveConversationId}
        isLoadingConversations={isLoadingConversations}
      />

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

        <MessageTimeline
          activeConversationId={activeConversationId}
          isLoadingMessages={isLoadingMessages}
          timelineItems={timelineItems}
          currentUserId={currentUserId}
          getCallEventLabel={getCallEventLabel}
          bottomRef={bottomRef}
        />

        <MessageComposer
          messageInput={messageInput}
          onMessageInputChange={setMessageInput}
          onSubmit={() => void sendMessageNow()}
          activeConversationId={activeConversationId}
          isSending={isSending}
        />
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
