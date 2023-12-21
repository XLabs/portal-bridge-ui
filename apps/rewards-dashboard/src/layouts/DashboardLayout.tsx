import { useAccount } from "wagmi";
import Taurus from "../quarks/Taurus";
import { WalletManager } from "../quarks/WalletManager";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
  EstimatedApyGraphic,
  EstimatedRewardsGraphic,
  RewardHistoryGraphic,
  TotalBridgedGraphic,
} from "../quarks/DashboardVectors";
import { InfoStatWindow, StatWindow } from "../quarks/StatWindow";

const WormholeLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="103"
    height="104"
    fill="none"
    viewBox="0 0 103 104"
  >
    <path
      fill="url(#paint0_radial_2254_3414)"
      d="M51.5 0C23.067 0 0 23.291 0 52s23.067 52 51.5 52S103 80.709 103 52 79.933 0 51.5 0zm0 74.395c-12.252 0-22.18-10.024-22.18-22.395 0-12.37 9.928-22.395 22.18-22.395 12.252 0 22.18 10.024 22.18 22.395 0 12.37-9.928 22.395-22.18 22.395z"
    ></path>
    <defs>
      <radialGradient
        id="paint0_radial_2254_3414"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(43.1648 0 0 43.5839 51.495 51.993)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.225" stopColor="#fff"></stop>
        <stop offset="0.544" stopColor="#fff" stopOpacity="0.44"></stop>
        <stop offset="0.686" stopColor="#fff" stopOpacity="0.23"></stop>
        <stop offset="0.857" stopColor="#fff" stopOpacity="0.07"></stop>
        <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
      </radialGradient>
    </defs>
  </svg>
);

const EyeCon = () => (
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
);

const ConnectedDashboard = () => {
  const [numbersHidden, setNumbersHidden] = useState(false);

  const [totalBridged, setTotalBridged] = useState<number | undefined>(
    undefined
  );
  const [estimatedAPY, setEstimatedApy] = useState<number | undefined>(
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
  const [unclaimedRewards, setUnclaimedRewards] = useState<number | undefined>(
    undefined
  );

  const fillExampleValues = () => {
    setTotalBridged(73255155);
    setEstimatedApy(780);
    setEstimatedRewards(15477);
    setHistoryRewardsEarned(18025);
    setUSDCBridged(1558);
    setUSDCHeld(63758);
    setAUSDCHeld(1558);
    setCUSDCHeld(142);
    setUnclaimedRewards(69420);
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

  const formatPercent = (x?: number) => {
    x = maybeHide(x);
    return x !== undefined ? `${x}%` : undefined;
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
        <div
          className="
          text-white
          text-4xl
          md:text-5xl
          "
        >
          ARB Rewards Dashboard
        </div>
        <div
          className="
          text-white
          md:text-md
          pt-5
          pb-4
          md:pb-8
          "
        >
          TODO: Some copy to be written here about USDC staking & arb rewards
        </div>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="whitespace-pre text-white text-4xl">
              My ARB Rewards
            </div>
            <div
              className="flex flex-row items-center hover:cursor-pointer"
              onClick={() => {
                setNumbersHidden(!numbersHidden);
              }}
            >
              <EyeCon />
              <div className="whitespace-pre text-white text-md pl-2">
                {numbersHidden ? "Show All Numbers" : "Hide All Numbers"}
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
                  header="Bridged"
                  value={formatInteger(usdcBridged)}
                  unit="USDC"
                  infoElement={
                    <div>
                      This is the amount of <b>CCTP USDC</b> you have bridged to
                      your wallet on <b>Arbitrum One</b>.
                    </div>
                  }
                />
                <InfoStatWindow
                  header="Held"
                  value={formatInteger(usdcHeld)}
                  unit="USDC"
                  infoElement={
                    <div>
                      This is the amount of <b>CCTP USDC</b> you are holding in
                      your wallet on <b>Arbitrum One</b>.
                    </div>
                  }
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <InfoStatWindow
                  header="Held Value"
                  value={formatInteger(ausdcHeld)}
                  unit="aUSDC"
                  infoElement={
                    <div>
                      This is the <b>USDC value</b> of the <b>CCTP aUSDC</b> you
                      are holding in your wallet on <b>Arbitrum One</b>.
                    </div>
                  }
                />
                <InfoStatWindow
                  header="Held Value"
                  value={formatInteger(cusdcHeld)}
                  unit="cUSDC"
                  infoElement={
                    <div>
                      This is the <b>USDC value</b> of the <b>CCTP cUSDC</b> you
                      are holding in your wallet on <b>Arbitrum One</b>.
                    </div>
                  }
                />
              </div>
              <div className="">
                <InfoStatWindow
                  header="Unclaimed Rewards"
                  value={formatInteger(unclaimedRewards)}
                  unit="USDC"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {/* total bridged */}
          <StatWindow
            header="Total Bridged"
            value={formatInteger(totalBridged)}
            unit="USDC"
            graphic={<TotalBridgedGraphic />}
          />
          <StatWindow
            header="Estimated APY"
            value={formatPercent(estimatedAPY)}
            graphic={<EstimatedApyGraphic />}
          />
          <StatWindow
            header="Estimated Rewards"
            value={formatInteger(estimatedRewards)}
            unit="ARB"
            graphic={<EstimatedRewardsGraphic />}
          />
          <StatWindow
            header="History of Rewards Earned"
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
          <WormholeLogo />
        </div>
        <div className="text-white text-3xl md:text-4xl pb-3">
          Connect your wallet
        </div>
        <div className="flex flex-col items-center pb-8 w-5/6 md:w-1/1 ">
          <div className="text-white text-sm md:text-base w-1/1">
            Get up to 5% APY by bridging your USDC to the Arbitrum network until
            March 29th.
          </div>
          <div className="text-white text-sm md:text-base 2-1/1">
            Deposit native USDC in AAVE or Compound to earn additional rewards.
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
            How Rewards Work?
          </div>
        </div>
        <div>
          <a
            href="https://forum.arbitrum.foundation/t/wormhole-final-stip-round-1/16617"
            target="_blank"
            className="flex flex-row items-center gap-3"
          >
            <div className="text-white text-sm">Learn More</div>
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
