import * as React from "react";
import { makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, InputAdornment, styled } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { call } from "../../data/callWrapper";
import { RegistrationModel, UsersApi } from "../../data/src";
import AppSnackbar, { IAppSnackbarProps } from "../../snackbar/AppSnackbar";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useMutation } from "react-query";

const useStyles = makeStyles(() => {
  return {
    //
  };
});

const FullWidthInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  margin: "4px 0 4px 0",
  width: "100%",
}));

const HalfWidthInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  margin: "4px 0 4px 0",
  width: "50%",
}));

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SignUpPasswordBools {
  showOne: boolean;
  showTwo: boolean;
}

const SignUpDialog = (props: IProps) => {
  const classes = useStyles();

  const [signUpFields, setSignUpFields] = React.useState<RegistrationModel>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [snackbarProps, setSnackbarProps] = React.useState<IAppSnackbarProps>();
  const [showSignUpPassword, setShowSignUpPassword] =
    React.useState<SignUpPasswordBools>({
      showOne: false,
      showTwo: false,
    });

  const closeSnackbar = () => {
    setSnackbarProps((current) => ({ ...current, open: false }));
  };

  const handleClose = () => {
    setSignUpFields({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    });
    props.setOpen(false);
  };

  const { mutateAsync: signUp, status: signUpStatus } = useMutation(
    async () => {
      const result = await call(UsersApi).apiUsersPost({
        registrationModel: {
          ...signUpFields,
        },
      });
    },
    {
      onSuccess: () => {
        setSnackbarProps({
          type: "success",
          message: "New User Created!",
          open: true,
          handleClose: closeSnackbar,
        });
        props.setOpen(false);
      },
    }
  );

  const disableSignUp = () => {
    const { firstName, lastName, username, password } = signUpFields;
    if (!firstName || !lastName || !username || !password) return true;
    if (password !== confirmPassword) return true;
    return false;
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
        <DialogTitle>New User Sign Up</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <HalfWidthInput
              sx={{ marginRight: "4px" }}
              variant="outlined"
              value={signUpFields.firstName}
              onChange={(e) =>
                setSignUpFields({
                  ...signUpFields,
                  firstName: e.target.value,
                })
              }
              placeholder="First Name"
            />
            <HalfWidthInput
              sx={{ marginLeft: "4px" }}
              variant="outlined"
              value={signUpFields.lastName}
              onChange={(e) =>
                setSignUpFields({
                  ...signUpFields,
                  lastName: e.target.value,
                })
              }
              placeholder="Last Name"
            />
          </div>
          <FullWidthInput
            variant="outlined"
            value={signUpFields.username}
            onChange={(e) =>
              setSignUpFields({
                ...signUpFields,
                username: e.target.value,
              })
            }
            placeholder="Username"
          />
          <FullWidthInput
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
          />
          <FullWidthInput
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            disabled={disableSignUp()}
            onClick={() => signUp()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignUpDialog;
