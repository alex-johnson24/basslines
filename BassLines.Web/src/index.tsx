import "es6-promise";
import "es6-promise/auto";
import "es6-object-assign/auto";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { UserProvider } from "./contexts";
import Root from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import ColorModeWithProvider from "./helpers/useTheme";
import { SpotifyProvider } from "./contexts/spotifyContext";
import { SongProvider } from "./contexts/songContext";
import CssBaseline from "@mui/material/CssBaseline";
import { getApiUrl } from "./data/callWrapper";

declare global {
  interface Window {
    __BASENAME__: string;
    __APP_VERSION__: string;
    __API_URL__: string;
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
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SongProvider apiUrl={getApiUrl()}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ColorModeWithProvider>
              <SpotifyProvider>
                <CssBaseline />
                <Root basepath={props.basename} version={props.version} />
              </SpotifyProvider>
            </ColorModeWithProvider>
          </LocalizationProvider>
        </SongProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

ReactDOM.render(
  <BrowserRouter basename={basename}>
    <App appName="BassLines" version={version} basename={basename} />
  </BrowserRouter>,
  document.getElementById("mountNode")
);
