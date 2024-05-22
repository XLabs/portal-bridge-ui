import { ChainName } from "@certusone/wormhole-sdk";
import { chainToIcon } from "@wormhole-foundation/sdk-icons";
import { toChainNameIcon } from "../../helpers/explorer";
interface ChainIconProps {
  chain: ChainName;
}
const ChainIcon = ({ chain }: ChainIconProps) => {
  const chainIcon = toChainNameIcon(chain);
  const icon = chainToIcon(chainIcon);
  return icon ? (
    <img
      src={icon}
      alt={chain}
      height="20px"
      width="20px"
      style={{ verticalAlign: "sub" }}
    />
  ) : null;
};

export default ChainIcon;
