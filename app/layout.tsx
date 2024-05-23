import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IMBOR demo app",
  description: "Voorbeeldimplementatie van software die werkt op basis van NEN 2660-2:2022",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Voorbeeldimplementatie van software die werkt op basis van NEN 2660-2:2022"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/icon/icon-imbor-app.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>IMBOR demo app</title>
        <link href="https://unpkg.com/maplibre-gl@2.1.9/dist/maplibre-gl.css" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
