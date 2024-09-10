import { WormholeLogo } from "../quarks/LogoVectors";

export const Footer = () => {
  return (
    <footer className="flex flex-row mt-16 gap-8 justify-between items-center">
      <div className="text-white text-sm text-opacity-90">
        v{import.meta.env.VITE_APP_VERSION || "0.0.0"}
      </div>

      <div className="flex flex-row items-center justify-center flex-1">
        <div className="text-white text-xs text-opacity-60 pr-4">
          Powered By
        </div>
        <WormholeLogo />
      </div>

      <div className=" flex flex-row gap-4 justify-between">
        <div className="text-white text-sm text-opacity-90">Built by xLabs</div>
      </div>
    </footer>
  );
};
