"use client"; // 클라이언트 컴포넌트임을 명시

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
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