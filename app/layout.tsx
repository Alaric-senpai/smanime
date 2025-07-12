import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "smAnime",
  description: "Unleash your inner otaku",
  authors: [
    {
      name: "Alaric senpai",
      url: "https://github.com/Alaric-senpai"
    }
  ],
  openGraph: {
    images: [
      {
        url: '/images/logo-full.png',
        width: '400',
        height: '400'
      }
    ],
    tags: ['anime', 'jikan', 'anilist','otaku'],
    title: 'SmAnime',
    description: 'A simple anime streaming platform'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
