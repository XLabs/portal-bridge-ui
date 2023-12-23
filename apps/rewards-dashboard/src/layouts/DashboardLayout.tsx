import { useAccount } from "wagmi";
import Taurus from "../quarks/Taurus";
import { WalletManager } from "../quarks/WalletManager";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
  EstimatedRewardsGraphic,
  RewardHistoryGraphic,
  TotalBridgedGraphic,
} from "../quarks/DashboardVectors";
import { InfoStatWindow, StatWindow } from "../quarks/StatWindow";
import { PortalLogo } from "../quarks/LogoVectors";
import { Trans, t } from "@lingui/macro";

const ConnectedDashboard = () => {
  const [numbersHidden, setNumbersHidden] = useState(false);

  const [totalBridged, setTotalBridged] = useState<number | undefined>(
    undefined
  );
  const [estimatedRewards, setEstimatedRewards] = useState<number | undefined>(
    undefined
  );
  const [historyRewardsEarned, setHistoryRewardsEarned] = useState<
    number | undefined
  >(undefined);

  const [usdcBridged, setUSDCBridged] = useState<number | undefined>(undefined);
  const [usdcHeld, setUSDCHeld] = useState<number | undefined>(undefined);
  const [cusdcHeld, setCUSDCHeld] = useState<number | undefined>(undefined);
  const [ausdcHeld, setAUSDCHeld] = useState<number | undefined>(undefined);
  const [accruedRewards, setAccruedRewards] = useState<number | undefined>(
    undefined
  );

  const fillExampleValues = () => {
    setTotalBridged(73255155);
    setEstimatedRewards(15477);
    setHistoryRewardsEarned(18025);
    setUSDCBridged(1558);
    setUSDCHeld(63758);
    setAUSDCHeld(1558);
    setCUSDCHeld(142);
    setAccruedRewards(69420);
  };
  fillExampleValues;
  useEffect(() => {
    setTimeout(() => {
      fillExampleValues();
    }, 1000);
  }, []);

  const maybeHide = (x?: number) => {
    if (numbersHidden == true) {
      return undefined;
    }
    return x;
  };

  const formatInteger = (x?: number) => {
    x = maybeHide(x);
    return x !== undefined ? Math.floor(x).toLocaleString() : undefined;
  };

  return (
    <div className="grow flex flex-col justify-center items-center">
      <div
        className="
        flex flex-col justify-center items-center
        pb-16
        "
      >
        <h1
          className="
          text-white
          text-4xl
          md:text-5xl
          "
        >
          <Trans>Connected Dashboard Title</Trans>
        </h1>
        <h2
          className="
          text-white
          md:text-md
          pt-5
          pb-4
          md:pb-8
          "
        >
          <Trans>Connected Dashboard Subtitle</Trans>
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-screen-xl">
        <div
          className="flex flex-col items-start gap-4
          bg-[#44457D] bg-opacity-30 backdrop-blur-lg
          rounded-lg
          px-11 pt-12 pb-12
          grow
          "
        >
          <div className="flex flex-col sm:flex-row md:items-center w-full text-start justify-between gap-4">
            <h3 className="whitespace-pre text-white text-4xl">
              <Trans>Connected Dashboard Header </Trans>
            </h3>
            <div
              className="flex flex-row items-center hover:cursor-pointer"
              onClick={() => {
                setNumbersHidden(!numbersHidden);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="12"
                fill="none"
                viewBox="0 0 18 12"
              >
                <path
                  fill="#fff"
                  d="M15.938 8.2L14.63 6.63l.213-.184c1.455-1.262 2.463-2.931 2.994-4.967a.866.866 0 00-.62-1.055.863.863 0 00-1.054.62c-1.53 5.86-6.993 5.978-7.224 5.981-.236 0-5.71-.118-7.238-5.982a.865.865 0 00-1.674.436c.53 2.034 1.539 3.705 2.994 4.967l.213.184L1.926 8.2a.863.863 0 00.11 1.216.892.892 0 001.218-.11L4.68 7.599l.205.107a9.754 9.754 0 002.937.96l.245.036v2.36c0 .476.39.865.864.865.475 0 .865-.39.865-.864v-2.36l.245-.038a9.795 9.795 0 002.937-.959l.204-.107 1.427 1.709a.889.889 0 001.219.109.862.862 0 00.109-1.216z"
                ></path>
              </svg>
              <div className="whitespace-pre text-white text-md pl-2">
                {numbersHidden ? t`Hide Number Text` : t`Show Number Text`}
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <WalletManager />
          </div>
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <InfoStatWindow
                  header={t`Bridged Header`}
                  value={formatInteger(usdcBridged)}
                  unit="USDC"
                  infoElement={<Trans>Bridged Window Tooltip</Trans>}
                />
                <InfoStatWindow
                  header={t`USDC Held Header`}
                  value={formatInteger(usdcHeld)}
                  unit="USDC"
                  infoElement={<Trans>USDC Held Window Tooltip</Trans>}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <InfoStatWindow
                  header={t`aUSDC Held Value Header`}
                  value={formatInteger(ausdcHeld)}
                  unit="aUSDC"
                  infoElement={<Trans>aUSDC Held Value Tooltip</Trans>}
                />
                <InfoStatWindow
                  header={t`cUSDC Held Value`}
                  value={formatInteger(cusdcHeld)}
                  unit="cUSDC"
                  infoElement={<Trans>cUSDC Held Value Tooltip</Trans>}
                />
              </div>
              <div className="">
                <InfoStatWindow
                  header={t`Accrued Rewards Header`}
                  value={formatInteger(accruedRewards)}
                  unit="ARB"
                  infoElement={<Trans>Accrued Rewards Tooltip</Trans>}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <StatWindow
            header={t`Staking Power Header`}
            value={formatInteger(totalBridged)}
            unit=""
            graphic={<TotalBridgedGraphic />}
          />
          <StatWindow
            header={t`Estimated Rewards Header`}
            value={formatInteger(estimatedRewards)}
            unit="ARB"
            graphic={<EstimatedRewardsGraphic />}
          />
          <StatWindow
            header={t`History of Rewards Earned Header`}
            value={formatInteger(historyRewardsEarned)}
            unit="ARB"
            graphic={<RewardHistoryGraphic />}
          />
        </div>
      </div>
    </div>
  );
};

const DisconnectedDashboard = () => {
  return (
    <div className="grow flex flex-col justify-center items-center gap-10">
      <div
        className="flex flex-col items-center gap-4
        bg-[#44457D] bg-opacity-30 backdrop-blur-lg
        rounded-lg
        pb-32 pt-8
        w-4/5
        px-4
        "
      >
        <div className="pb-2">
          <PortalLogo />
        </div>
        <div className="text-white text-3xl md:text-4xl pb-3">
          <Trans>Disconnect Wallet Dashboard Title</Trans>
        </div>
        <div className="flex flex-col items-center pb-8 w-5/6 md:w-1/1 ">
          <div className="text-white text-sm md:text-base w-1/1">
            <Trans>Disconnect Wallet Dashboard Subtitle One</Trans>
          </div>
          <div className="text-white text-sm md:text-base 2-1/1">
            <Trans>Disconnect Wallet Dashboard Subtitle Two</Trans>
          </div>
        </div>
        <WalletManager />
      </div>
      <div
        className="
        flex flex-col md:flex-row
        md:items-center gap-4
        bg-[#44457D] bg-opacity-30 backdrop-blur
        rounded-xl
        py-8
        px-8
        justify-between
        w-2/3
        "
      >
        <div
          className="
          flex flex-col md:flex-row md:items-center gap-4 md:gap-8
          text-start
          "
        >
          <Taurus />
          <div className="text-white text-2xl font-light">
            <Trans>Bottom Banner Header</Trans>
          </div>
        </div>
        <div>
          <a
            href="https://forum.arbitrum.foundation/t/wormhole-final-stip-round-1/16617"
            target="_blank"
            className="flex flex-row items-center gap-3"
          >
            <div className="text-white text-sm">
              <Trans>Bottom Banner Link</Trans>
            </div>
            <FaArrowRight className="fill-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const DashboardLayout = () => {
  const { isConnected } = useAccount();
  return (
    <div
      className="
      flex flex-col
      "
    >
      {isConnected ? <ConnectedDashboard /> : <DisconnectedDashboard />}
    </div>
  );
};
