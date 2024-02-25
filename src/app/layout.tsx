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
