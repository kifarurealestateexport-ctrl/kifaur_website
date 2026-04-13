import type { Metadata } from 'next'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'

export const metadata: Metadata = {
  title: 'Kifaru Real Estate & Building Co. Ltd — Tunajenga kwa gharama nafuu',
  description: "Tanzania's trusted CRB-registered construction and real estate company. Build your dream home, pay afterwards.",
  keywords: 'real estate Tanzania, construction Dar es Salaam, paving blocks Tanzania, Kifaru Building',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white text-gray-800">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}