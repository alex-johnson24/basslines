import "es6-promise";
import "es6-promise/auto";
import "es6-object-assign/auto";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { themeConfig } from "../theme.config";
import { UserProvider } from "./contexts";
import Root from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ColorModeContext } from "./contexts/colorModeContext";

declare global {
  interface Window {
    __BASENAME__: string;
    __APP_VERSION__: string;
  }
}

const basename = window.__BASENAME__;
const version = window.__APP_VERSION__;


interface AppProps {
  appName: string;
  version: string;
  basename: string;
}

const App = (props: AppProps) => {
    const [mode, setMode] = React.useState<'palette' | 'cyberPalette'>(localStorage.getItem('theme') === 'cyberPalette' ? 'cyberPalette' : 'palette');
    const colorMode = React.useMemo( 
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'palette' ? 'cyberPalette' : 'palette'));
            }, theme: mode
        }),
        [mode],
    );

    React.useEffect(() => {
      localStorage.setItem('theme', mode);
    }, [mode]);
    
    const theme = React.useMemo(
      () => responsiveFontSizes(
        createTheme({
          palette: themeConfig[mode],
          typography: themeConfig.typography
      })),
      [mode],
    );

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Root basepath={props.basename} />
            </ThemeProvider>
          </ColorModeContext.Provider>
        </LocalizationProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

ReactDOM.render(
  <BrowserRouter basename={basename}>
    <App appName="ChaggarCharts" version={version} basename={basename} />
  </BrowserRouter>,
  document.getElementById("mountNode")
);
