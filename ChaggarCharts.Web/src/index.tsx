import "es6-promise";
import "es6-promise/auto";
import "es6-object-assign/auto";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { themeConfig } from "../theme.config";
import {
  createMuiTheme,
  responsiveFontSizes,
  makeStyles,
} from "@material-ui/core/styles";
import { UserProvider } from "./contexts";
import Root from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";

declare global {
  interface Window {
    __BASENAME__: string;
    __APP_VERSION__: string;
  }
}

const basename = window.__BASENAME__;
const version = window.__APP_VERSION__;

delete window.__BASENAME__;
delete window.__APP_VERSION__;

const muiPalette = themeConfig.palette;
const muiTypography = themeConfig.typography;

const drawerWidth = 240;

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: muiPalette,
    typography: muiTypography,
  })
);

const useStyles = makeStyles((theme) => {
  return {
    //
  };
});

interface AppProps {
  appName: string;
  version: string;
  basename: string;
}

const App = (props: AppProps) => {
  const classes = useStyles();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={theme}>
            <CssBaseline>
              <Root />
            </CssBaseline>
          </ThemeProvider>
        </MuiPickersUtilsProvider>
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