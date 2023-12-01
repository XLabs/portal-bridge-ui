import Footer from "./Footer";

export default function Version() {
  return (
    <Footer left="120px">v{import.meta.env.VITE_APP_VERSION || "0.0.0"}</Footer>
  );
}
