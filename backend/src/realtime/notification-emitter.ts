import { INotification } from "../models/notification.model";

type EmitFn = (userId: string, notification: INotification) => void;

let emitNotificationFn: EmitFn = () => {
  // No-op fallback when no realtime socket layer is attached.
};

export const setNotificationEmitter = (fn: EmitFn) => {
  emitNotificationFn = fn;
};

export const emitNotificationNew = (userId: string, notification: INotification) => {
  emitNotificationFn(userId, notification);
};
