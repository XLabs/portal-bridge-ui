import Footer from "./Footer";

export default function Version() {
  return (
    <Footer left="120px">
      {import.meta.env.VITE_APP_VERSION || "0.0.0"}
      <br />
      {import.meta.env.VITE_APP_WORMHOLE_CONNECT_VERSION || "0.0.0"}
    </Footer>
  );
}
