import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WOOMAAN by Yolanda Diva</title>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </>
  )
}
