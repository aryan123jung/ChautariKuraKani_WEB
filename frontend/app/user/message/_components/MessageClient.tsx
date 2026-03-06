"use client";

import { Phone, Video } from "lucide-react";
import CallModal from "./CallModal";
import MessageSidebar from "./MessageSidebar";
import MessageTimeline from "./MessageTimeline";
import MessageComposer from "./MessageComposer";
import { getUserName } from "./message-helpers";
import { useMessageClient } from "./useMessageClient";

export default function MessageClient({ currentUserId }: { currentUserId: string }) {
  const {
    filteredFriends,
    friendSearch,
    setFriendSearch,
    startConversation,
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoadingConversations,
    activeChatUser,
    outgoingCall,
    incomingCall,
    activeCall,
    startCall,
    timelineItems,
    getCallEventLabel,
    bottomRef,
    messageInput,
    setMessageInput,
    sendMessageNow,
    isSending,
    isLoadingMessages,
    activeCallName,
    activeCallAvatar,
    callDurationLabel,
    isEndingCall,
    isMuted,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    localVideoRef,
    remoteVideoRef,
    remoteAudioRef,
    setIncomingRingtoneElement,
    setOutgoingRingbackElement,
  } = useMessageClient(currentUserId);

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
        ref={setIncomingRingtoneElement}
        src="/sounds/incoming-call.mp3"
        preload="auto"
        loop
        className="hidden"
      />
      <audio
        ref={setOutgoingRingbackElement}
        src="/sounds/outgoing-call.mp3"
        preload="auto"
        loop
        className="hidden"
      />
    </section>
  );
}
