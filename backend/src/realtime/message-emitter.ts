import { IMessage } from "../models/message.model";

type EmitMessageFn = (payload: {
  senderId: string;
  receiverId: string;
  conversationId: string;
  message: IMessage;
}) => void;

let emitMessageFn: EmitMessageFn = () => {
  // No-op fallback.
};

export const setMessageEmitter = (fn: EmitMessageFn) => {
  emitMessageFn = fn;
};

export const emitMessageNew = (payload: {
  senderId: string;
  receiverId: string;
  conversationId: string;
  message: IMessage;
}) => {
  emitMessageFn(payload);
};
