import "es6-promise";
import "es6-promise/auto";
import "es6-object-assign/auto";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { UserProvider } from "./contexts";
import Root from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline } from "@mui/material";
import ColorModeWithProvider from "./helpers/useTheme";


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
    

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ColorModeWithProvider>
            <>
              <CssBaseline />
              <Root basepath={props.basename} />
            </>
          </ColorModeWithProvider>
        </LocalizationProvider>
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
