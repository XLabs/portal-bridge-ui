import { Outlet } from "react-router-dom";
import Footer from "../components/atoms/Footer";
import NavBar from "../components/atoms/NavBar";
import NewsBar from "../components/atoms/NewsBar";
import messageConfig from "../configs/messages";

export default function Root() {
    const messages = Object.values(messageConfig);
    return (
        <>
          <NewsBar messages={messages}/>
          <NavBar />
          <Outlet />
          <Footer />
        </>
      )
}