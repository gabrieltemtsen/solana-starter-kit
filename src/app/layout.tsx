import { Header } from '@/components/common/header'
import { PrivyClientProvider } from '@/components/provider/PrivyClientProvider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solana Starter Kit',
  description: 'Take your Solana App idea from 0 to 1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyClientProvider>
          <Header />
          <Toaster />
          <div className="max-w-6xl mx-auto pt-12 pb-22">{children}</div>
        </PrivyClientProvider>
      </body>
    </html>
  )
}
