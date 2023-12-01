import NewBarButton from "./NewsBarButton";
import useBannerMessageConfig, {
  type Message,
} from "../../hooks/useBannerMessage";
import Bar from "./Bar";

export type NewsBarProps = {
  messages: Message[];
};

export default function NewsBar({ messages }: NewsBarProps) {
  const message = useBannerMessageConfig(messages);
  return (
    message && (
      <Bar background={message.background}>
        {message.content}
        <NewBarButton button={message.button} />
      </Bar>
    )
  );
}
