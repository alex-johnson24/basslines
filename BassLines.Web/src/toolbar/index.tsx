import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Button, Switch, TextField } from "@mui/material";
import { call } from "../data/callWrapper";
import { UsersApi } from "../data/src";
import { useHistory } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import { ColorModeContext } from "../contexts/colorModeContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(9)} + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    zIndex: theme.zIndex.drawer + 1,
  },
  [theme.breakpoints.up("md")]: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  },
  [theme.breakpoints.down("md")]: {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  },
}));

const DateBox = styled(Box)(({ theme }) => ({
  marginRight: "auto",
  [theme.breakpoints.up("md")]: {
    marginLeft: 0,
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    marginRight: "auto",
  },
}));

const WhiteBorderTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root .MuiSvgIcon-root": {
    color: theme.palette.secondary.main,
  },
  "& .MuiInputLabel-root": { color: theme.palette.secondary.main }, //styles the label
  "& .MuiOutlinedInput-root": {
    "& > fieldset": { borderColor: theme.palette.secondary.main },
    color: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    "& > fieldset": {
      borderColor: theme.palette.secondary.main,
    },
  },
  "& .MuiOutlinedInput-root:hover": {
    "& > fieldset": {
      borderColor: theme.palette.secondary.main,
    },
  },
  "& .MuiInputLabel-root.Mui-focused ": {
    color: theme.palette.secondary.main,
  },
}));

interface IMiniDrawerProps {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  content: JSX.Element;
  basepath: string;
}

const drawerItems = [
  {
    label: "Home",
    icon: <HomeIcon />,
    link: "/home",
  },
  {
    label: "My Charts",
    icon: <ThumbUpIcon />,
    link: "/mycharts",
  },
  {
    label: "Leaderboard",
    icon: <BarChartIcon />,
    link: "/leaderboard",
  },
  {
    label: "Songs",
    icon: <MusicNoteIcon />,
    link: "/allsongs",
  },
];

export default function MiniDrawer(props: IMiniDrawerProps) {
  const theme = useTheme();
  const history = useHistory();
  const { toggleColorMode, curTheme } = React.useContext(ColorModeContext);

  const logout = async () => {
    try {
      await call(UsersApi).apiUsersLogoutGet();
      history.push("/login");
    } catch (e) {
      console.log("logout failed");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          {/* <Box>
            <Typography>
              {curTheme === "cyberPalette" ? "Night City" : "Light City"}
            </Typography>
          </Box>
          <Switch
            color="secondary"
            checked={curTheme === "cyberPalette"}
            onChange={toggleColorMode}
          /> */}
          <DateBox>
            <DatePicker
              label="Submission Date"
              value={props.selectedDate}
              onChange={(newValue) => {
                props.setSelectedDate(newValue);
              }}
              renderInput={(params) => (
                <WhiteBorderTextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      padding: 10,
                    },
                  }}
                  margin="dense"
                />
              )}
            />
          </DateBox>
          <Box sx={{ marginRight: "20px" }}>
            <GlobalSearch />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent">
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            margin: "0 auto",
          }}
        >
          <Typography variant="h4" color="secondary">
            Chaggar
          </Typography>
          <Typography
            sx={{
              color: theme.palette.primary.light,
              fontWeight: 300,
              fontStyle: "italic",
            }}
            variant="h4"
          >
            Charts
          </Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {drawerItems.map((item, index) => (
            <ListItem
              sx={{
                color:
                  `${props.basepath}${item.link.replace("/", "")}` ===
                  location.pathname
                    ? theme.palette.secondary.main
                    : "",
                backgroundColor:
                  `${props.basepath}${item.link.replace("/", "")}` ===
                  location.pathname
                    ? theme.palette.primary.main
                    : "",
                "&:hover": {
                  backgroundColor:
                    `${props.basepath}${item.link.replace("/", "")}` ===
                    location.pathname
                      ? theme.palette.primary.light
                      : "",
                },
              }}
              button
              key={index}
              onClick={() => {
                if (
                  item.link == "/allsongs" ||
                  item.link == "/home" ||
                  item.link == "/mycharts" ||
                  item.link == "/leaderboard"
                ) {
                  history.push(item.link);
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    `${props.basepath}${item.link.replace("/", "")}` ===
                    location.pathname
                      ? theme.palette.secondary.main
                      : "",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="secondary"
          sx={{ color: theme.palette.primary.main, marginTop: "auto" }}
          onClick={logout}
        >
          Logout
        </Button>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {props.content}
      </Box>
    </Box>
  );
}
