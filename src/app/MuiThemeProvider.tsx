"use client";

import localFont from "next/font/local";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

const theme = createTheme({
  typography: {
    fontFamily: nanumSquareNeo.style.fontFamily
  },
  palette: {
    primary: {
      main: '#38276f',
    }
  },
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 0,
  //     md: 0,
  //     lg: 0,
  //     xl: 0,
  //   },
  // },
});

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}