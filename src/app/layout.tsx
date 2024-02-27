'use client'

import { Inter } from 'next/font/google';
import ContextProviders from '@/app/context/context-providers';
import LoadingSpinner from './components/utilities/loading/loading-spinner';
import Toast from './components/utilities/toast/toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {

    return (
        <html lang="en">
            <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            <title>Nutrition</title>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
            <meta name="msapplication-TileColor" content="#da532c"/>
            <meta name="theme-color" content="#ffffff"></meta>
            </head>
            <body className={inter.className}>
                <ContextProviders>
                    <LoadingSpinner/>
                    <Toast />
                    {children}
                </ContextProviders>
            </body>
        </html>
    );
}

export default RootLayout;
