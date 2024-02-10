'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import ContextProviders from '@/app/context/context-providers'
import LoadingSpinner from './components/utilities/loading/loading-spinner'
import Toast from './components/utilities/toast/toast'
import { StatusContext } from '@/app/context/status-context'
import { useContext } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { isLoading } = useContext(StatusContext)

    return (
        <html lang="en">
            <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            <title>Nutrition</title>
            </head>
            <body className={inter.className}>
                <ContextProviders>
                    {isLoading && <LoadingSpinner />}
                    <Toast />
                    {children}
                </ContextProviders>
            </body>
        </html>
    )
}
