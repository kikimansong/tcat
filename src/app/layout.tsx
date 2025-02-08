import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./assets/css/globals.css";
import "./assets/css/styles.css";
import MuiThemeProvider from "./MuiThemeProvider";
// import { CookiesProvider } from "react-cookie";

const nanumSquareNeo = localFont({
  src: [
    {
      path: "../../public/fonts/NanumSquareNeoOTF-Rg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NanumSquareNeoOTF-Bd.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nanumSquareNeo",
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
    <html lang="en" className={nanumSquareNeo.variable}>
      <body>
        <MuiThemeProvider>
          {/* <CookiesProvider> */}
          {children}
          {/* </CookiesProvider> */}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
