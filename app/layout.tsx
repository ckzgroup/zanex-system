

import { Inter as FontSans } from "next/font/google"

import {siteConfig} from "@/config/site";

import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/lib/theme-provider";
import {Toaster} from "@/components/lib/toaster";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Project ",
    "Service",
    "Management System",
  ],
  authors: [
    {
      name: "Fabii Kelvans",
      url: "https://github.com/fabiikelvans",
    },
  ],
  creator: "Fabii Kelvans",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@fabiikelvans",
  },
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">

      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
        <link rel="manifest" href="/images/site.webmanifest"/>
        <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
      </head>

      <body
          className={cn(
              "min-h-screen bg-background text-sm font-sans antialiased",
              fontSans.variable,
          )}
      >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <main >
          {children}
        </main>
        <Toaster />
      </ThemeProvider>
      </body>
      </html>
  )
}
