import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Parser, useJsonParser } from "./useJsonParser";

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

export type Banner = {
  id: string,
  networks: string[]
  assets: string[]
  content: string
  since: Date
  until: Date
};



async function fetchMessages(location: string = '/banners.json', parse: Parser<Banner[]>) {
  const response = await fetch(location);
  return await response.text().then((text) => parse(text));
}

export function useMessages() {
  const now = new Date();
  const parse = useJsonParser<Banner[]>({
    elements: {
      properties: {
        id: { type: "string" },
        networks: { elements: { type: "string" } },
        assets: { elements: { type: "string" } },
        content: { type: "string" },
        since: { type: "timestamp" },
        until: { type: "timestamp" },
      }
    }
  });
  const allMessages = useQuery({ queryKey: ['messages'], queryFn: () => fetchMessages('/banners.json', parse) });
  const activeMessages = allMessages.data?.filter(({ until }: Banner) => until < now);
  return activeMessages;
}