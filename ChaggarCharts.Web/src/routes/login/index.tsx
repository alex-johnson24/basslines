import * as React from "react";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
      '& :-webkit-autofill': {
        transitionDelay: '9999s'
      }
    }
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
      let result = await call(UsersApi).usersSignInPost({
        loginModel: {
          ...loginCreds,
        },
      });
      dispatch({ type: "signIn", payload: result });
      history.push("/home");
    } catch (e) {
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h4" color="secondary">
              Chaggar
            </Typography>
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 300,
                fontStyle: "italic",
              }}
              variant="h4"
            >
              Charts
            </Typography>
          </Box>
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
