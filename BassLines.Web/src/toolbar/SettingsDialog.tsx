import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Switch,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { ColorModeContext } from "../contexts/colorModeContext";
import SettingsIcon from "@mui/icons-material/Settings";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  sx: SxProps<Theme>;
}

const SettingsDialog = (props: IProps) => {
  const [open, setOpen] = React.useState(false);
  const { toggleColorMode, curTheme } = React.useContext(ColorModeContext);

  const handleChange = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ ...props.sx }}>
      <IconButton onClick={handleChange}>
        <SettingsIcon sx={{color: "white"}} />
      </IconButton>
      <Dialog
        onClose={handleChange}
        maxWidth="xs"
        fullWidth
        open={open}
        TransitionComponent={Transition}
        sx={{ minWidth: "25px" }}
      >
        <DialogTitle>
          <Typography
            variant="h4"
            sx={{ justifyContent: "center", textAlign: "center" }}
          >
            Settings
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>
              {curTheme === "darkPalette" ? "Dark" : "Light"}
            </Typography>
            <Switch
              color="secondary"
              checked={curTheme === "darkPalette"}
              onChange={toggleColorMode}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleChange}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsDialog;
