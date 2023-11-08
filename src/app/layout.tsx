'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import ContextProviders from '@/app/context/context-providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <title>Nutrition</title>
      </head>
      <body className={inter.className}>
        <ContextProviders>
          {children}
        </ContextProviders>
      </body>
    </html>
  )
}
