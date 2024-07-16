import { useMemo } from "react";

export interface Message {
  background: string;
  button?: {
    href: string;
    label?: string;
    background: string;
  };
  content: JSX.Element;
  start?: Date;
  ends?: Date;
}

const criteria = (left: Message, right: Message): number => {
  if (left.start && right.start) {
    return right.start.getTime() - left.start.getTime();
  }
  if (left.start) return 1;
  if (right.start) return -1;
  return 0;
};

export const useBannerMessageConfig = (messages: Message[]): Message | null => {
  return useMemo(() => {
    const now = new Date();
    const message = [...messages]
      .sort(criteria)
      .find(
        (message) =>
          (!message.start || message.start < now) &&
          (!message.ends || message.ends > now)
      );
    return message || null;
  }, [messages]);
};
