import * as React from "react";
import {
  Card,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useMutation } from "react-query";
import { useUserDispatch, User } from "../../contexts";
import axios from "axios";
import { useRouter } from "../../helpers/useRouter";

interface LoginRequest {
  username?: string;
  password?: string;
}

enum FormSections {
  Login = "Login",
  SignUp = "SignUp",
}

export default function Login() {
  const classes = useStyles();
  const dispatch = useUserDispatch();
  const { history } = useRouter();
  const [tabValue, setTabValue] = React.useState<FormSections>(
    FormSections.Login
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginCreds, setLoginCreds] = React.useState<LoginRequest>({});

  const { mutateAsync: login } = useMutation(
    async () => {
      const result = await axios.post("https://localhost:5001/Users/SignIn", {
        ...loginCreds,
      });
      return result;
    },
    {
      onSuccess: (result: any) => {
        dispatch({ type: "signIn", payload: result.data });
        history.push("/");
      },
    }
  );

  return (
    <div className={classes.fullPageContainer}>
      <Card className={classes.loginCard}>
        <div className={classes.title}>Welcome to Chaggar Charts!</div>
        <Tabs
          value={tabValue}
          onChange={(e, value: FormSections) => setTabValue(value)}
          variant="fullWidth"
        >
          <Tab value={FormSections.Login} label="Login" />
          <Tab value={FormSections.SignUp} label="Sign Up" />
        </Tabs>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "24px",
          }}
        >
          {tabValue === FormSections.Login ? (
            <>
              <TextField
                className={classes.inputMargin}
                variant="outlined"
                value={loginCreds?.username || ""}
                onChange={(e) =>
                  setLoginCreds({ ...loginCreds, username: e.target.value })
                }
                placeholder="Username"
                style={{ width: "100%" }}
              />
              <TextField
                className={classes.inputMargin}
                variant="outlined"
                value={loginCreds?.password || ""}
                onChange={(e) =>
                  setLoginCreds({ ...loginCreds, password: e.target.value })
                }
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <VisibilityOff style={{ color: "#C4C4C4" }} />
                      ) : (
                        <Visibility style={{ color: "#C4C4C4" }} />
                      )}
                    </InputAdornment>
                  ),
                }}
                type={!showPassword ? "password" : undefined}
                style={{ width: "100%" }}
              />
              <div
                style={{
                  marginTop: "10px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "end",
                }}
              >
                <Button
                  style={{
                    textTransform: "unset",
                    width: "100%",
                  }}
                  variant="contained"
                  color="primary"
                  disabled={!loginCreds.username || !loginCreds.password}
                  onClick={() => login()}
                >
                  Login
                </Button>
              </div>
            </>
          ) : (
            <div>Sign Up</div>
          )}
        </div>
      </Card>
    </div>
  );
}

const useStyles = makeStyles({
  fullPageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#DFDFDF",
  },
  loginCard: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    minWidth: "300px",
    height: "35%",
    padding: "16px",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    fontWeight: 500,
    fontSize: "18px",
    color: "#212121",
  },
  inputMargin: {
    margin: "5px 0 5px 0",
  },
});
