import createEmotionServer from "@emotion/server/create-instance";
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { theme } from "@/components/theme";
import { createEmotionCache } from "@/lib/emotion";

type CustomDocumentProps = { emotionStyleTags: JSX.Element[] };

export default class CustomDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(
    context: DocumentContext
  ): Promise<DocumentInitialProps & CustomDocumentProps> {
    const originalRenderPage = context.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    context.renderPage = () =>
      originalRenderPage({
        // TODO: Find a way around this `any`.
        enhanceApp: (App: any) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(context);

    return {
      ...initialProps,
      emotionStyleTags: extractCriticalToChunks(initialProps.html).styles.map(
        (style) => (
          <style
            dangerouslySetInnerHTML={{ __html: style.css }}
            data-emotion={`${style.key} ${style.ids.join(" ")}`}
            key={style.key}
          />
        )
      ),
    };
  }

  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="shortcut icon" href="/favicon.ico" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
          />
          <meta name="emotion-insertion-point" content="" />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
