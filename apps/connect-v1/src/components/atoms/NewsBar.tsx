import NewBarButton from "./NewsBarButton";
import {
  useBannerMessageConfig,
  type Message,
} from "../../hooks/useBannerMessageConfig";
import { useMessages } from "../../hooks/useMessages";
import Bar from "./Bar";

export type NewsBarProps = {
  messages: Message[];
};

export default function NewsBar({ messages }: NewsBarProps) {
  const message = useBannerMessageConfig(messages);
  const banners = useMessages();
  return (
    <>
      {!!message && (
        <Bar background={message.background}>
          {message.content}
          {!!message.button && <NewBarButton button={message.button} />}
        </Bar>
      )}
      {banners?.map((banner) => (
        <Bar
          background={banner.background}
          color={banner.content.color || ""}
          size={banner.content.size || ""}
        >
          {banner.content.text}
          {!!banner.button && <NewBarButton button={banner.button} />}
        </Bar>
      ))}
    </>
  );
}
