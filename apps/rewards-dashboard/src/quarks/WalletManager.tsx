import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { t } from "@lingui/macro";

export const WalletManager = () => {
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();

  const text = isConnected
    ? address
      ? truncateAddr(address)
      : ""
    : t`CONNECT WALLET`;
  return (
    <div
      className="
      flex flex-row items-center gap-2 px-4 py-2 mt-2
      border border-0.5 border-white
      bg-white
      hover:cursor-pointer
      rounded-full
      "
      onClick={() => {
        open();
      }}
    >
      <LightningIcon />

      <div className="text-black text-xs font-light whitespace-pre">{text}</div>
    </div>
  );
};

const LightningIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="7.25" fill="#000"></circle>
      <path
        fill="#fff"
        d="M11.682 7.518L6.486 12.38a.414.414 0 01-.284.108.422.422 0 01-.212-.056.363.363 0 01-.168-.438l1.023-2.872H4.603a.402.402 0 01-.364-.217.355.355 0 01.06-.4l4.397-4.862a.419.419 0 01.48-.093c.167.076.257.249.216.419L8.7 6.879H11.4a.4.4 0 01.367.231c.063.14.03.3-.084.408z"
      ></path>
    </svg>
  );
};

const truncateAddr = (x?: string) => {
  if (x) {
    if (x.length > 10) {
      return x.slice(0, 4) + "..." + x.slice(-4);
    }
    return x;
  }
  return "";
};
