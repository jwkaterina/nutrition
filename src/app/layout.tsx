'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { CardOpenProvider } from '@/app/context/card-context'

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
        <CardOpenProvider>
          {children}
        </CardOpenProvider>
      </body>
    </html>
  )
}
