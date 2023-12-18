import { useState, useEffect } from "react";

export type Message = {
  background: string;
  button?: {
    href: string;
    label?: string;
    background: string;
  };
  content: JSX.Element;
  start: Date;
  ends?: Date;
};

function criteria(left: Message, right: Message) {
  if (left.start && right.start) {
    return right.start.getTime() - left.start.getTime();
  }
  if (left.start) {
    return 1;
  }
  if (right.start) {
    return -1;
  }
  return 0;
}

export default function useBannerMessageConfig(messages: Message[]) {
  const [message, setMessage] = useState<Message | null>(null);
  useEffect(() => {
    const now = new Date();
    const message = messages
      .sort(criteria)
      .find(
        (message) =>
          (!message.start || message.start < now) &&
          (!message.ends || message.ends > now)
      );
    setMessage(message || null);
  }, [messages]);
  return message;
}
