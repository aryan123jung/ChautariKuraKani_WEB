"use client";

import type { RefObject } from "react";
import { Phone, PhoneOff, Video } from "lucide-react";

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

type Props = {
  incomingCall: IncomingCall | null;
  outgoingCall: OutgoingCall | null;
  activeCall: ActiveCall | null;
  callName: string;
  callAvatar: string | null;
  callDurationLabel: string;
  isEndingCall: boolean;
  onAccept: () => void;
  onReject: () => void;
  onEnd: () => void;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  remoteAudioRef: RefObject<HTMLAudioElement | null>;
};

export default function CallModal({
  incomingCall,
  outgoingCall,
  activeCall,
  callName,
  callAvatar,
  callDurationLabel,
  isEndingCall,
  onAccept,
  onReject,
  onEnd,
  localVideoRef,
  remoteVideoRef,
  remoteAudioRef,
}: Props) {
  const showModal = !!incomingCall || !!outgoingCall || !!activeCall;
  if (!showModal) return null;

  const isIncoming = !!incomingCall;
  const isConnected = !!activeCall;
  const isVideoCall = (activeCall?.callType || outgoingCall?.callType || incomingCall?.callType) === "video";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
            {callAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={callAvatar} alt={callName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700 dark:text-zinc-200">
                {callName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-slate-900 dark:text-zinc-100">{callName}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isIncoming && `Incoming ${isVideoCall ? "video" : "audio"} call`}
              {!isIncoming && !isConnected && `Calling... (${isVideoCall ? "video" : "audio"})`}
              {isConnected && `${isVideoCall ? "Video" : "Audio"} call connected`}
            </p>
            {isConnected && (
              <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{callDurationLabel}</p>
            )}
          </div>
        </div>

        {isConnected && isVideoCall && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="relative h-32 overflow-hidden rounded-xl bg-black">
              <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
              <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                {callName}
              </span>
            </div>
            <div className="relative h-32 overflow-hidden rounded-xl bg-black">
              <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                You
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isIncoming && (
            <>
              <button
                onClick={onReject}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                <PhoneOff size={16} />
                Reject
              </button>
              <button
                onClick={onAccept}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#76C05D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#67a94f]"
              >
                <Phone size={16} />
                Pick Up
              </button>
            </>
          )}

          {!isIncoming && (
            <button
              onClick={onEnd}
              disabled={isEndingCall}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              <PhoneOff size={16} />
              {isConnected ? "End Call" : "Cancel Call"}
            </button>
          )}
        </div>

        <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
        {isVideoCall && !isConnected && (
          <div className="mt-3 flex items-center justify-center text-xs text-slate-500 dark:text-zinc-400">
            <Video size={12} className="mr-1" />
            Waiting for connection...
          </div>
        )}
      </div>
    </div>
  );
}
