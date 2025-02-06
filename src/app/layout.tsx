import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./assets/css/globals.css";
import "./assets/css/styles.css";
import MuiThemeProvider from "./MuiThemeProvider";
// import { CookiesProvider } from "react-cookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TCat",
  description: "Tcat Front",
  icons: {
    icon: "/images/favi.jpeg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MuiThemeProvider>
          {/* <CookiesProvider> */}
          {children}
          {/* </CookiesProvider> */}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
