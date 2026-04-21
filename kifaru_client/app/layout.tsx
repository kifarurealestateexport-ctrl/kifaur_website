import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kifaru Real Estate & Building Co. Ltd — Tunajenga kwa gharama nafuu',
  description: "Tanzania's trusted CRB-registered construction and real estate company. Build your dream home, pay afterwards.",
  keywords: 'real estate Tanzania, construction Dar es Salaam, paving blocks Tanzania, Kifaru Building',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} flex flex-col min-h-screen bg-white text-gray-800`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}