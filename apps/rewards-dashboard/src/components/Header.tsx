import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";

import { WalletManager } from "../quarks/WalletManager";
import { NavItem } from "../quarks/NavItem";
import { PortalLogoWithText } from "../quarks/LogoVectors";

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

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
          <WalletManager />
        </div>
      </div>
    </header>
  );
};
