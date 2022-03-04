import * as React from 'react';
import { themeConfig } from "../../theme.config";
import {
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

const useTheme = () => {
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

    return({colorMode, theme});
}

export default useTheme;