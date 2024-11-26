import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";

import { WalletManager } from "../quarks/WalletManager";
import { NavItem } from "../quarks/NavItem";
import { PortalLogoWithText } from "../quarks/LogoVectors";

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(true);
  return (
    <header className="flex flex-col gap-1">
      <div className="flex flex-row gap-1 justify-between">
        <a className="flex mb-12" href={navBar[0].href}>
          <PortalLogoWithText />
        </a>
        <div
          className="md:hidden flex flex-row px-4 hover:cursor-pointer"
          onClick={() => setShowMenu((p) => !p)}
        >
          <CiMenuBurger className="w-5 h-5 stroke-white stroke-1" />
        </div>
      </div>
      <div className={`${showMenu ? "" : "hidden"} md:flex`}>
        <div className="flex flex-col gap-3 pb-6">
          {navBar.map((x, idx) => (
            <NavItem key={idx} item={x} />
          ))}
          <>
            <button
              type="button"
              className="text-white text-sm navbar-item whitespace-nowrap"
              onClick={() => {
                setOpenMenu(!openMenu);
              }}
            >
              <div className="flex items-center gap-x-1">
                <svg
                  className={`w-3 h-3 transition duration-150 ${
                    openMenu ? "transform rotate-45" : ""
                  }`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.25 8.75V14H8.75V8.75H14V7.25H8.75V2H7.25V7.25H2V8.75H7.25Z"
                    fill="currentColor"
                  />
                </svg>
                <span> MORE </span>
              </div>
            </button>
            <div
              className={`relative overflow-hidden transition-all max-h-0 duration-700 mb-5 ml-3 ${
                openMenu ? "overflow-visible" : ""
              }`}
            >
              <NavItem item={{ label: "Cosmos", href: `${BASE_URL}/cosmos` }} />
            </div>
          </>
          <WalletManager />
        </div>
      </div>
    </header>
  );
};
