import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { AppProps } from "next/app";
import { createEmotionCache } from "@/lib/emotion";
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@/components/theme";

export type CustomAppProps = AppProps & { emotionCache?: EmotionCache };

const clientSideEmotionCache = createEmotionCache();

export default function CustomApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: CustomAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
