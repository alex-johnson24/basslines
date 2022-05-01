import * as React from "react";
import { makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { call } from "../../data/callWrapper";
import { UsersApi } from "../../data/src";
import AppSnackbar, { IAppSnackbarProps } from "../../snackbar/AppSnackbar";

const useStyles = makeStyles(() => {
  return {
    //
  };
});

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetPasswordDialog = (props: IProps) => {
  const classes = useStyles();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [resetToken, setResetToken] = React.useState("");
  const [snackbarProps, setSnackbarProps] = React.useState<IAppSnackbarProps>();

  const closeSnackbar = () => {
    setSnackbarProps((current) => ({ ...current, open: false }));
  };

  const handleClose = () => {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setResetToken("");
      props.setOpen(false);
  }

  const submitReset = async () => {
    try {
      await call(UsersApi).apiUsersResetUserPasswordPost({
        resetPasswordModel: {
          username,
          password,
          resetToken,
        },
      });
      setSnackbarProps({
        type: "success",
        message: "User password updated",
        open: true,
        handleClose: closeSnackbar
      });
      handleClose();
    } catch (e) {
      setSnackbarProps({
        type: "error",
        message: "Failed to reset user password",
        open: true,
        handleClose: closeSnackbar
      });
    }
  };

  return (
    <>
      <AppSnackbar {...snackbarProps} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={props.open}
        sx={{ minHeight: "300px" }}
      >
        <DialogTitle>Reset User Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                variant="standard"
                value={username}
                onChange={(e) => {
                  const val = e.target?.value;
                  setUsername(val);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                variant="standard"
                value={password}
                onChange={(e) => {
                  const val = e.target?.value;
                  setPassword(val);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="standard"
                value={confirmPassword}
                onChange={(e) => {
                  const val = e.target?.value;
                  setConfirmPassword(val);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Reset Token"
                fullWidth
                variant="standard"
                value={resetToken}
                onChange={(e) => {
                  const val = e.target?.value;
                  setResetToken(val);
                }}
                helperText="ChaggarCharts admins can generate tokens via the API"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={
              password === "" ||
              password !== confirmPassword ||
              username === "" ||
              resetToken === ""
            }
            variant="contained"
            onClick={submitReset}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetPasswordDialog;
