import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface IAppSnackbarProps {
  open: boolean;
  handleClose: () => void;
  message: string;
  type: "success" | "error";
}

const AppSnackbar = (props: IAppSnackbarProps) => {
  return (
    <Snackbar open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
      <Alert onClose={props.handleClose} severity={props.type} sx={{ width: "100%" }}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;
