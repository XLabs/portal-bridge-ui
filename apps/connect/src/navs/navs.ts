import { WormholeConnectEvent } from "../providers/telemetry";

enum TransferEvents {
  START = "transfer.start",
  SUCCESS = "transfer.success",
  SUCCESS_REDEEM = "transfer.redeem.success",
}

// export const pushResumeUrl = (e: WormholeConnectEvent) => {
//   if (e.type === TransferEvents.START) {
//     const { fromChain, txId } = e.details;
//     history.pushState(
//       { event: e.type },
//       "Start Transfer",
//       `?sourceChain=${fromChain}&transactionId=${txId}`
//     );
//   }
// };

export const clearUrl = (e: WormholeConnectEvent) => {
  if (
    e.type === TransferEvents.SUCCESS ||
    e.type === TransferEvents.SUCCESS_REDEEM
  ) {
    history.pushState({ event: e.type }, "Transfer Success", "/");
  }
};
