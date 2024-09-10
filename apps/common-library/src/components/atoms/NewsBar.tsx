import { NewsBarButton } from "./NewsBarButton";
import Bar from "./Bar";
import { Banner, Message } from "../../utils/constants";

export type NewsBarProps = {
  message?: Message;
  banners?: Banner[];
};

export const NewsBar = ({ message, banners }: NewsBarProps) => {

  return (
    <>
      {!!message && (
        <Bar background={message.background}>
          {message.content}
          {!!message.button && <NewsBarButton button={message.button} />}
        </Bar>
      )}
      {banners?.map((banner) => (
        <Bar
          background={banner.background}
          color={banner.content.color || ""}
          size={banner.content.size || ""}
        >
          {banner.content.text}
          {!!banner.button && <NewsBarButton button={banner.button} />}
        </Bar>
      ))}
    </>
  );
}
