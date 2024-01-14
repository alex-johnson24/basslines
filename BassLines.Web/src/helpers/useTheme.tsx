import * as React from "react";
import { themeConfig } from "../../theme.config";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { ColorModeContext } from "../contexts/colorModeContext";
import { ThemeProvider } from "@mui/material/styles";

const useTheme = () => {
  const [mode, setMode] = React.useState<"palette" | "darkPalette">(
    localStorage.getItem("theme") === "darkPalette" ? "darkPalette" : "palette"
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === "palette" ? "darkPalette" : "palette"
        );
      },
      curTheme: mode,
    }),
    [mode]
  );

  React.useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const curTheme = React.useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: themeConfig[mode],
          typography: themeConfig.typography,
          breakpoints: {
            values: {
              xs: 0,
              sm: 600,
              md: 960,
              lg: 1200,
              xl: 1536,
            },
          },
        })
      ),
    [mode]
  );

  return { colorMode, curTheme };
};

const ColorModeWithProvider = React.memo(
  ({ children }: { children: JSX.Element }) => {
    const { colorMode, curTheme } = useTheme();

    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={curTheme}>{children}</ThemeProvider>
      </ColorModeContext.Provider>
    );
  }
);

export default ColorModeWithProvider;
