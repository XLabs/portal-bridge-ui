import NewBarButton from "./NewsBarButton";
import useBannerMessageConfig from "./useBannerMessage";
import config from "./messages";
import Bar from "./Bar";
import { useMemo } from "react";

export default function NewsBar() {
  const messages = useMemo(() => Object.values(config), []);
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
