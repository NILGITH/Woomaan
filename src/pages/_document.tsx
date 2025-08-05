import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/woomaan-logo.svg" />
        <meta name="description" content="WOOMAAN by Yolanda Diva - Révélez votre élégance africaine avec nos créations haute couture" />
        <meta property="og:title" content="WOOMAAN by Yolanda Diva" />
        <meta property="og:description" content="Créations haute couture alliant tradition africaine et sophistication moderne" />
        <meta property="og:image" content="/woomaan-logo.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
