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
          <div
            className="
            flex flex-col grow
            justify-between
            overflow-scroll scrollbar-hide
            "
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
