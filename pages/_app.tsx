import { global } from "application/state";
import { useEffect } from "react";
import { Surface } from "application/rui";
import { AppProps } from "next/app";
import {
  HandshakeProvider,
  useReplit,
  useThemeValues,
} from "@replit/extensions-react";
import { useAtom } from "jotai";
import { SmolScreen, Loading } from "application/screens";
import Head from "next/head";
import "styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  const [, setInIframe] = useAtom(global.inIframe);
  const [, setWindowWidth] = useAtom(global.windowWidth);
  const [, setWindowHeight] = useAtom(global.windowHeight);

  const { status } = useReplit();
  const themeValues = useThemeValues();

  const mappedThemeValues = themeValues
    ? Object.entries(themeValues).map(
        ([key, val]) =>
          `--${key.replace(
            /[A-Z]/g,
            (c) => "-" + c.toLowerCase()
          )}: ${val} !important;`
      )
    : [];

  useEffect(() => {
    setInIframe(window.location !== window.parent.location);

    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <>
      <Head>
        <style>{`:root, .replit-ui-theme-root {
${mappedThemeValues.join("\n")}
        }`}</style>
      </Head>
      <Surface background="default" elevated className="body">
        {status === "ready" ? (
          <>
            <Component {...pageProps} />
            <SmolScreen />
          </>
        ) : (
          <Loading />
        )}
      </Surface>
    </>
  );
}

export default function Generator(props: AppProps) {
  return (
    <HandshakeProvider>
      <App {...props} />
    </HandshakeProvider>
  );
}
