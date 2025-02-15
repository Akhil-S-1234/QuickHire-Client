import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Work_Sans } from 'next/font/google'
import "./globals.css";

import { ReduxProvider } from '../store/provider';
import BlockModal from "../components/BlockModal";
import { Toaster } from "sonner";


const workSans = Work_Sans({
  subsets: ["latin"], // Specify the subset for the font
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Include all weights you need
  variable: "--font-work-sans", // Define a CSS variable for the font
});

export const metadata: Metadata = {
  title: "QuikHire",
  description: "Created by Akhil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} antialiased`}>
      <Toaster richColors position="top-right" />

        <ReduxProvider>
          {children}
          <BlockModal />
        </ReduxProvider>
      </body>
    </html>
  );
}
