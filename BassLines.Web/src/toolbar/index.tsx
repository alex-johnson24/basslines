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
import { Button, CircularProgress, Grid, Link, TextField } from "@mui/material";
import { call } from "../data/callWrapper";
import { UsersApi } from "../data/src";
import { useHistory } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import { ColorModeContext } from "../contexts/colorModeContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSpotify } from "../contexts/spotifyContext";
import { useSongState } from "../contexts/songContext";
import { makeStyles } from "@material-ui/styles";

const drawerWidth = 240;

const useStyles = makeStyles(() => {
  return {
    statsBox: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  };
});

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
    maxWidth: 185,
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
  const { dailySongs, allSongsRated } = useSongState();
  const classes = useStyles();

  const logout = async () => {
    try {
      await call(UsersApi).apiUsersLogoutGet();
      history.push("/login");
    } catch (e) {
      console.log("logout failed");
    }
  };

  const percentRated =
    (dailySongs.filter((s) => s.rating != null).length / dailySongs.length) *
    100;

  const winner = dailySongs.sort((a, b) => b.rating - a.rating)[0];

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
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: { boxShadow: "-2px 0 6px -1px rgb(0, 0, 0, .20) inset" },
        }}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            margin: "0 auto",
          }}
        >
          <Typography variant="h4" color="secondary">
            Bass
          </Typography>
          <Typography
            sx={{
              color: theme.palette.primary.light,
              fontWeight: 300,
              fontStyle: "italic",
            }}
            variant="h4"
          >
            Lines
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
        <Divider />
        <Box
          sx={{
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50%",
          }}
        >
          <Typography sx={{ fontSize: "20px", marginBottom: "8px" }}>
            Today's Stats
          </Typography>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box className={classes.statsBox}>
              <Typography variant="caption" color={theme.palette.primary.light}>
                Daily Songs
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {dailySongs.length}
              </Typography>
            </Box>
            <Box className={classes.statsBox}>
              <Typography variant="caption" color={theme.palette.primary.light}>
                Daily Avg
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {allSongsRated
                  ? (
                      dailySongs.reduce((a, b) => a + b.rating, 0) /
                      (1.0 * dailySongs.length)
                    ).toFixed(2)
                  : "--"}
              </Typography>
            </Box>
            <Box className={classes.statsBox}>
              <Typography variant="caption" color={theme.palette.primary.light}>
                Rating Progress
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <CircularProgress
                  variant="determinate"
                  value={percentRated}
                  size="76"
                  thickness={3.4}
                /> */}
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {Math.round(percentRated)}%
                </Typography>
              </Box>
            </Box>
            <Box className={classes.statsBox}>
              <Typography variant="caption" color={theme.palette.primary.light}>
                Today's Winner
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {allSongsRated
                  ? winner.user.firstName + " " + winner.user.lastName
                  : "--"}
              </Typography>
              {winner?.link && allSongsRated ? (
                <>
                  <Link
                    noWrap
                    sx={{ fontWeight: "bold" }}
                    variant="subtitle1"
                    href={winner.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {allSongsRated ? winner.title : "--"}
                  </Link>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                    sx={{ fontWeight: "bold" }}
                  >
                    {allSongsRated ? winner.artist : "--"}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="subtitle1"
                  color={theme.palette.text.secondary}
                  sx={{ fontWeight: "bold" }}
                >
                  {`${allSongsRated ? winner.title : "--"} -
                     ${allSongsRated ? winner.artist : "--"}
                   `}
                </Typography>
              )}
              <Typography
                variant="h5"
                color={theme.palette.secondary.main}
                sx={{ fontWeight: "bold" }}
              >
                {allSongsRated ? winner.rating : "--"}
              </Typography>
            </Box>
          </Box>
        </Box>
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

const SpotifyPlayer = () => {
  const spotify = useSpotify();

  return (
    <Grid
      width="100%"
      position="fixed"
      bottom={0}
      bgcolor={(theme) => theme.palette.primary.main}
      height="80px"
    ></Grid>
  );
};
