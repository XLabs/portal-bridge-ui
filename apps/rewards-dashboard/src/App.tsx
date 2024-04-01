import { useState } from "react";
import "./App.css";
import { Background } from "./components/Background";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppProvider } from "./providers";
import { Trans } from "@lingui/macro";
import { RxCross1 } from "react-icons/rx";

function App() {
  const [hideModal, setHideModal] = useState(false);
  return (
    <>
      <AppProvider>
        <Background>
          {hideModal ? (
            <></>
          ) : (
            <div className="absolute flex flex-col grow h-full w-full scrollbar-hide justify-center items-center ">
              <div className="w-96 h-40 bg-[#262b5a] z-10 rounded-3xl border border-1 border-gray-500">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row justify-between text-gray-300 py-1 justify-center border-b border-gray-500 ">
                    <div className="flex flex-row items-center grow justify-center text-white">
                      Program Ended
                    </div>
                    <div className="flex flex-row items-center justify-center">
                      <a
                        className="hover:cursor-pointer pr-3"
                        onClick={() => {
                          setHideModal(true);
                        }}
                      >
                        <RxCross1 />
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-row justify-start text-white text-sm">
                    <p className="align-start w-full text-center whitespace-pre">
                      <Trans>Rewards Ended Information</Trans>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`
              flex flex-col grow h-full
              justify-between
              overflow-scroll scrollbar-hide
              ${!hideModal && "blur-sm"}
              `}
          >
            <Header />
            {
              // TODO: routing for different layouts
            }
            <DashboardLayout />
            <Footer />
          </div>
        </Background>
      </AppProvider>
    </>
  );
}

export default App;
