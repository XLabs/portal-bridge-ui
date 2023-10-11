import { Outlet } from "react-router-dom";
import Footer from "../components/atoms/Footer";
import NavBar from "../components/atoms/NavBar";
import NewsBar from "../components/atoms/NewsBar";

export default function Root() {
    return (
        <>
          <NewsBar />
          <NavBar />
          <Outlet />
          <Footer />
        </>
      )
}