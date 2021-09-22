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
import { ClassSharp, Visibility, VisibilityOff } from "@material-ui/icons";
import { useMutation } from "react-query";
import { useUserDispatch } from "../../contexts";
import { useRouter } from "../../helpers/useRouter";
import {
  UsersApi,
  LoginModel,
  RegistrationModel,
  UserModel,
} from "../../data/src";
import { call } from "../../data/callWrapper";

enum FormSections {
  Login = "Login",
  SignUp = "SignUp",
}

interface SignUpPasswordBools {
  showOne: boolean;
  showTwo: boolean;
}

export default function Login() {
  const classes = useStyles();
  const dispatch = useUserDispatch();
  const { history } = useRouter();
  const [tabValue, setTabValue] = React.useState<FormSections>(
    FormSections.Login
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSignUpPassword, setShowSignUpPassword] =
    React.useState<SignUpPasswordBools>({
      showOne: false,
      showTwo: false,
    });
  const [loginCreds, setLoginCreds] = React.useState<LoginModel>({
    username: "",
    password: "",
  });
  const [signUpFields, setSignUpFields] = React.useState<RegistrationModel>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    setLoginCreds({
      username: "",
      password: "",
    });
    setSignUpFields({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    });
  }, [tabValue]);

  const disableSignUp = () => {
    const { firstName, lastName, username, password } = signUpFields;
    if (!firstName || !lastName || !username || !password) return true;
    if (password !== confirmPassword) return true;
    return false;
  };

  const { mutateAsync: login, status: loginStatus } = useMutation(
    async () => {
      const result = await call(UsersApi).usersSignInPost({
        loginModel: {
          ...loginCreds,
        },
      });
      return result;
    },
    {
      onSuccess: (result: UserModel) => {
        dispatch({ type: "signIn", payload: result });
        history.push("/");
      },
    }
  );

  const { mutateAsync: signUp, status: signUpStatus } = useMutation(
    async () => {
      const result = await call(UsersApi).usersPost({
        registrationModel: {
          ...signUpFields,
        },
      });
    },
    {
      onSuccess: () => {
        setTabValue(FormSections.Login);
      },
    }
  );

  return (
    <div className={classes.fullPageContainer}>
      <Card
        className={
          tabValue === FormSections.Login
            ? classes.loginCard
            : classes.signUpCard
        }
      >
        <div className={classes.title}>Welcome to Chaggar Charts!</div>
        <Tabs
          value={tabValue}
          onChange={(e, value: FormSections) => setTabValue(value)}
          variant="fullWidth"
        >
          <Tab value={FormSections.Login} label="Login" />
          <Tab value={FormSections.SignUp} label="Sign Up" />
        </Tabs>
        <div className={classes.fieldContainer}>
          {tabValue === FormSections.Login ? (
            <>
              {loginStatus === "loading" ? (
                <div className={classes.centerLoader}>
                  <CircularProgress variant="indeterminate" size={50} />
                </div>
              ) : (
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
                      marginTop: "12px",
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
              )}
            </>
          ) : (
            <>
              {signUpStatus === "loading" ? (
                <div className={classes.centerLoader}>
                  <CircularProgress variant="indeterminate" size={50} />
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      value={signUpFields.firstName}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="First Name"
                      style={{ width: "50%", margin: "4px 4px 4px 0px" }}
                    />
                    <TextField
                      variant="outlined"
                      value={signUpFields.lastName}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Last Name"
                      style={{ width: "50%", margin: "4px 0px 4px 4px" }}
                    />
                  </div>
                  <TextField
                    className={classes.inputMargin}
                    variant="outlined"
                    value={signUpFields.username}
                    onChange={(e) =>
                      setSignUpFields({
                        ...signUpFields,
                        username: e.target.value,
                      })
                    }
                    placeholder="Username"
                    style={{ width: "100%" }}
                  />
                  <TextField
                    className={classes.inputMargin}
                    variant="outlined"
                    value={signUpFields.password}
                    onChange={(e) =>
                      setSignUpFields({
                        ...signUpFields,
                        password: e.target.value,
                      })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          onClick={() =>
                            setShowSignUpPassword({
                              ...showSignUpPassword,
                              showOne: !showSignUpPassword.showOne,
                            })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {showSignUpPassword.showOne ? (
                            <VisibilityOff style={{ color: "#C4C4C4" }} />
                          ) : (
                            <Visibility style={{ color: "#C4C4C4" }} />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    type={!showSignUpPassword.showOne ? "password" : undefined}
                    placeholder="Password"
                    style={{ width: "100%" }}
                  />
                  <TextField
                    className={classes.inputMargin}
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          onClick={() =>
                            setShowSignUpPassword({
                              ...showSignUpPassword,
                              showTwo: !showSignUpPassword.showTwo,
                            })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {showSignUpPassword.showTwo ? (
                            <VisibilityOff style={{ color: "#C4C4C4" }} />
                          ) : (
                            <Visibility style={{ color: "#C4C4C4" }} />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    type={!showSignUpPassword.showTwo ? "password" : undefined}
                    placeholder="Confirm"
                    style={{ width: "100%" }}
                  />
                  <div
                    style={{
                      marginTop: "12px",
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
                      disabled={disableSignUp()}
                      onClick={() => signUp()}
                    >
                      Sign Up
                    </Button>
                  </div>
                </>
              )}
            </>
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
    height: "35%",
    minWidth: "300px",
    minHeight: "300px",
    padding: "16px",
  },
  signUpCard: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    height: "45%",
    minWidth: "300px",
    minHeight: "450px",
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
    margin: "4px 0 4px 0",
  },
  halfInputMargin: {
    margin: "4px",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: "24px",
  },
  centerLoader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
