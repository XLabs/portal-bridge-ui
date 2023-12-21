//import { useWeb3Modal } from "@web3modal/wagmi/react"

import { CiMenuBurger } from "react-icons/ci";
import { WalletManager } from "../quarks/WalletManager";
import { useState } from "react";

const WormholeLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="164"
    height="71"
    fill="none"
    viewBox="0 0 164 71"
  >
    <path
      fill="#fff"
      d="M77.784 33.503c0 2.093-1.513 3.801-4.575 3.801H69.99v3.985a.247.247 0 01-.242.242h-1.11a.247.247 0 01-.242-.242V29.945a.246.246 0 01.242-.243h4.57c3.063 0 4.575 1.707 4.575 3.801zm-1.672 0c0-1.343-.809-2.443-3.218-2.443h-2.901v4.886h2.901c2.409 0 3.218-1.096 3.218-2.443M97.13 35.617a5.946 5.946 0 01-6.03 6.089 6.084 6.084 0 01-5.665-3.718 6.092 6.092 0 014.397-8.34 6.085 6.085 0 017.297 5.968l.001.001zm-1.673-.001c0-2.802-1.827-4.732-4.356-4.732-2.53 0-4.357 1.931-4.357 4.732 0 2.8 1.827 4.732 4.357 4.732 2.53 0 4.356-1.93 4.356-4.732M114.046 41.052a.291.291 0 01-.256.479h-1.139a.217.217 0 01-.184-.106l-2.859-4.315h-3.074v4.18a.244.244 0 01-.242.242h-1.111a.246.246 0 01-.242-.243V29.944a.247.247 0 01.242-.242h4.376c3.063 0 4.575 1.61 4.575 3.704 0 1.663-.948 3.02-2.873 3.51l2.787 4.136zm-4.804-5.3c2.409 0 3.218-.999 3.218-2.347 0-1.343-.809-2.347-3.218-2.347h-2.706v4.694h2.706zM131.531 29.945v.872a.245.245 0 01-.238.242h-4.101v10.23a.247.247 0 01-.243.242h-1.109a.245.245 0 01-.17-.072.244.244 0 01-.073-.17v-10.23h-4.098a.249.249 0 01-.171-.072.248.248 0 01-.072-.17v-.872a.247.247 0 01.243-.243h9.794a.245.245 0 01.238.242M148.192 41.628h-1.332a.269.269 0 01-.276-.18l-1.289-2.98h-5.554l-1.38 2.98a.285.285 0 01-.277.18h-1.182c-.174 0-.276-.106-.193-.286l5.466-11.558a.279.279 0 01.276-.18h.387a.29.29 0 01.277.18l5.258 11.558c.078.18-.005.286-.179.286h-.002zm-3.454-4.44l-2.128-4.921-2.277 4.92h4.405zM163.999 40.416v.873a.222.222 0 01-.057.165.229.229 0 01-.185.077h-7.885a.246.246 0 01-.242-.242V29.944a.247.247 0 01.242-.242h1.11a.245.245 0 01.242.242v10.23h6.533a.229.229 0 01.243.215v.028"
    ></path>
    <path
      fill="url(#paint0_radial_2254_3382)"
      d="M34.998.483C15.676.483 0 16.165 0 35.494c0 19.33 15.676 35.011 34.998 35.011 19.322 0 34.998-15.681 34.998-35.01C69.996 16.164 54.32.482 34.998.482zm0 50.09c-8.326 0-15.073-6.75-15.073-15.079s6.747-15.079 15.073-15.079 15.073 6.75 15.073 15.08c0 8.329-6.747 15.078-15.073 15.078z"
    ></path>
    <defs>
      <radialGradient
        id="paint0_radial_2254_3382"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="matrix(29.3334 0 0 29.3448 34.994 35.49)"
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

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <div className="flex flex-col">
        <div
          className="
        flex flex-row
        gap-1
        justify-between
        items-center
        "
        >
          <div
            className="
          flex flex-row gap-2
          items-center
          "
          >
            <WormholeLogo />
          </div>
          <div
            className="
          collapse md:visible
          flex flex-row
          justify-end
          items-center px-2
          w-2/3
          grow
          "
          >
            <div
              className="
            flex flex-row justify-between
            gap-8
            items-center
            py-8
            "
            >
              <a
                href={`${BASE_URL}`}
                className="text-white text-sm
              hover:cursor-pointer hover:underline hover:underline-offset-8
              "
              >
                Home
              </a>
              <a
                href={`${BASE_URL}/usdc-bridge`}
                className="text-white text-sm
              hover:cursor-pointer hover:underline hover:underline-offset-8
              "
              >
                USDC
              </a>
              <a
                href={`${BASE_URL}/rewards-dashboard`}
                className="
              text-white text-sm
              underline underline-offset-8
              hover:cursor-pointer
              whitespace-nowrap
              "
              >
                ARB Rewards
              </a>
              <a
                href="https://wormholescan.io"
                target="_blank"
                className="
              text-white text-sm
              hover:cursor-pointer hover:underline hover:underline-offset-8
              "
              >
                Wormholescan
              </a>
              <WalletManager />
            </div>
          </div>
          <div
            className="
          md:hidden
          flex flex-row items-center px-4
          hover:cursor-pointer
          "
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <CiMenuBurger className="w-5 h-5 stroke-white stroke-1" />
          </div>
        </div>
        <div className={`${showMenu ? "" : "hidden"} md:hidden pb-8`}>
          <div className="flex flex-col text-start">
            <a
              href="https://portalbridge.com"
              className="text-white
              hover:cursor-pointer
              hover:bg-white hover:bg-opacity-10 duration-200
              pb-3
              pl-4 ml-2
              "
            >
              Home
            </a>
            <a
              href="https://portalbridge.com/usdc-bridge"
              className="text-white
              hover:cursor-pointer
              hover:bg-white hover:bg-opacity-10 duration-200
              py-3
              pl-4 ml-2
              "
            >
              USDC
            </a>
            <a
              className="text-white
              hover:cursor-pointer
              hover:bg-white hover:bg-opacity-10 duration-200
              py-3
              pl-4 ml-2
              "
            >
              ARB Rewards
            </a>
            <a
              href="https://wormholescan.com"
              target="_blank"
              className="
              text-white
              hover:cursor-pointer hover:underline hover:underline-offset-8
              py-3
              pl-4 ml-2
              "
            >
              Wormholescan
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
