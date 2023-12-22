import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";

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
  id: string;
  background: string;
  content: string;
  since: Date;
  until: Date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parse(banner: Record<string, any>): Banner {
  const id = banner.id;
  const background = banner.background;
  const since = new Date(banner.since);
  const until = new Date(banner.until);
  const content = DOMPurify.sanitize(banner.content, {
    USE_PROFILES: { html: true },
  });
  return { id, background, since, until, content };
}

async function fetchMessages(
  location: string = "/data/banners.json"
): Promise<Banner[]> {
  const response = await fetch(location);
  if (response.status !== 200) {
    return [];
  } else {
    const json = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.map((banner: Record<string, any>) => parse(banner));
  }
}

export function useMessages() {
  const now = new Date();
  const allMessages = useQuery({
    queryKey: ["messages"],
    queryFn: () => fetchMessages(),
  });
  return allMessages.data?.filter(
    ({ until, since }: Banner) => since < now && until > now
  );
}
