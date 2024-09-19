import "./App.css";
import { Background } from "./components/Background";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppProvider } from "./providers";

function App() {
  return (
    <>
      <AppProvider>
        <Background>
          <div className="flex flex-col grow h-full justify-between overflow-scroll scrollbar-hide py-6 px-4 flex-1">
            <div className="flex flex-1 flex-col md:flex-row">
              <Header />
              <div className="flex flex-1 items-center justify-center">
                <DashboardLayout />
              </div>
            </div>
            <Footer />
          </div>
        </Background>
      </AppProvider>
    </>
  );
}

export default App;
