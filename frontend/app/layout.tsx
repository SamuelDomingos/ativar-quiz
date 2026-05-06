import { Geist, Geist_Mono, Noto_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import { TooltipProvider } from "@/components/ui/tooltip"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        notoSans.variable,
        geistHeading.variable
      )}
    >
      <body className="h-screen flex flex-col">
        <ThemeProvider>
          <TooltipProvider>
            <Header />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
