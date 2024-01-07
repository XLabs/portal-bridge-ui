//import { useWeb3Modal } from "@web3modal/wagmi/react"

import { CiMenuBurger } from "react-icons/ci";
import { WalletManager } from "../quarks/WalletManager";
import { useState } from "react";
import { MobileNavItem, NavItem } from "../quarks/NavItem";
import { PortalLogoWithText } from "../quarks/LogoVectors";

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
            <PortalLogoWithText />
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
              {navBar.map((x, idx) => {
                return (
                  <>
                    <NavItem key={idx} item={x} />
                  </>
                );
              })}
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
        {showMenu && (
          <div className={` md:hidden pb-8 duration-200`}>
            <div className="flex flex-col text-start">
              {navBar.map((x, idx) => {
                return (
                  <>
                    <MobileNavItem key={idx} item={x} />
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
