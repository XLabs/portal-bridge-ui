import { useQuery } from "@tanstack/react-query";

export interface Banner {
  id: string;
  background: string;
  button?: {
    href: string;
    label?: string;
    background: string;
  };
  content: {
    text: string;
    color?: string;
    size?: string;
  };
  since: Date;
  until: Date;
}

const parse = (banner: Record<string, any>): Banner => {
  const id = banner.id;
  const background = banner.background;
  const since = new Date(banner.since);
  const until = new Date(banner.until);
  const content = {
    text: banner.content.text,
    color: banner.content.color,
    size: banner.content.size,
  };
  const button = banner.button;
  return { id, background, since, until, content, button };
};

const fetchMessages = async (
  location: string = "/data/banners.json"
): Promise<Banner[]> => {
  const response = await fetch(location);
  if (response.status !== 200) return [];
  const json = await response.json();
  return json.map((banner: Record<string, any>) => parse(banner));
};

export const useMessages = () => {
  const now = new Date();
  const allMessages = useQuery({
    queryKey: ["messages"],
    queryFn: () => fetchMessages(),
  });
  return allMessages.data?.filter(
    ({ until, since }: Banner) => since < now && until > now
  );
};
