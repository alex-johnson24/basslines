import * as React from "react"
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { themeConfig } from '../../theme.config';
import { createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import { Route, Switch, Redirect } from "react-router-dom";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const muiPalette = themeConfig.palette;
const muiTypography = themeConfig.typography;

const drawerWidth = 240;

const theme = responsiveFontSizes(
    createMuiTheme({
        palette: muiPalette,
        typography: muiTypography,
    })
);

const useStyles = makeStyles(theme => {
    return {
        //
    };
});

interface AppProps { appName: string; version: string; basename: string }

const App = (props: AppProps) => {
    const classes = useStyles();

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    )
};

export default App;