import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { useUserDispatch } from "../../contexts";
import { UsersApi, LoginModel, UserModel } from "../../data/src";
import LoadingButton from "@mui/lab/LoadingButton";
import { call } from "../../data/callWrapper";
import ResetPasswordDialog from "./ResetPasswordDialog";
import SignUpDialog from "./SignUpDialog";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";

interface Jwt extends UserModel {
  exp: number;
}

const useStyles = makeStyles({
  autofill: {
    "& :-webkit-autofill": {
      boxShadow: "0 0 0 100px transparent inset !important",
      webkitBoxShadow: "0 0 0 100px transparent inset !important",
      "-webkit-text-fill-color": "black !important",
    },
  },
});

const Login = () => {
  const classes = useStyles();
  const dispatch = useUserDispatch();
  const history = useHistory();
  const [loginCreds, setLoginCreds] = React.useState<LoginModel>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] =
    React.useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = React.useState(false);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await call(UsersApi).apiUsersSignInPost({
        loginModel: {
          ...loginCreds,
        },
      });
      dispatch({ type: "signIn", payload: result });
      history.push("/home");
    } catch (e) {
      console.log(e);
      setLoginCreds((current) => ({ ...current, password: "" }));
      setLoading(false);
    }
  };

  return (
    <>
      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        setOpen={setResetPasswordDialogOpen}
      />
      <SignUpDialog open={signUpDialogOpen} setOpen={setSignUpDialogOpen} />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlined />
          </Avatar>
          <Box component="img" sx={{ height: "48px" }} src="img/basslines.svg" />
          <Box component="form" onSubmit={submitLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              className={classes.autofill}
              autoFocus
              InputLabelProps={{
                style: { color: "#3e3e48" },
              }}
              onChange={(e) =>
                setLoginCreds({
                  ...loginCreds,
                  username: e.target.value,
                })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              className={classes.autofill}
              InputLabelProps={{
                style: { color: "#3e3e48" },
              }}
              onChange={(e) =>
                setLoginCreds({
                  ...loginCreds,
                  password: e.target.value,
                })
              }
            />
            <LoadingButton
              type="submit"
              loading={loading}
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link
                  variant="body2"
                  sx={{ cursor: "pointer" }}
                  color="inherit"
                  onClick={() => {
                    setResetPasswordDialogOpen(true);
                  }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  onClick={() => {
                    setSignUpDialogOpen(true);
                  }}
                  variant="body2"
                  color="inherit"
                  sx={{ cursor: "pointer" }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
