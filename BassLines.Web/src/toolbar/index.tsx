import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Home from "@mui/icons-material/Home";
import ThumbUp from "@mui/icons-material/ThumbUp";
import BarChart from "@mui/icons-material/BarChart";
import MusicNote from "@mui/icons-material/MusicNote";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { call } from "../data/callWrapper";
import { UsersApi } from "../data/src";
import { useHistory } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSpotify } from "../contexts/spotifyContext";
import { useSongState } from "../contexts/songContext";
import SettingsDialog from "./SettingsDialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";

const drawerWidth = 240;

interface DrawerProps extends MuiDrawerProps {
  open?: boolean;
}

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
  width: 0,
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
  zIndex: theme.zIndex.drawer + 1,
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
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
  version: string;
}

const drawerItems = [
  {
    label: "Home",
    icon: <Home />,
    link: "/home",
  },
  {
    label: "My Charts",
    icon: <ThumbUp />,
    link: "/mycharts",
  },
  {
    label: "Leaderboard",
    icon: <BarChart />,
    link: "/leaderboard",
  },
  {
    label: "Songs",
    icon: <MusicNote />,
    link: "/allsongs",
  },
];

export default function MiniDrawer(props: IMiniDrawerProps) {
  const theme = useTheme();
  const history = useHistory();
  const classes = useStyles();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const {
    state: { profile, player },
  } = useSpotify();
  const { dailySongs, allSongsRated } = useSongState();

  const logout = async () => {
    try {
      if (player) player.disconnect();
      localStorage.removeItem("refreshToken");
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
        <Toolbar disableGutters>
          {isSmallScreen && (
            <IconButton
              sx={{ marginLeft: "10px" }}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
          )}
          <Box sx={{ marginLeft: "24px" }}>
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
          </Box>
          <Box
            component="img"
            sx={{
              position: "fixed",
              width: "100%",
              height: "48px",
              zIndex: -1,
            }}
            display={{ xs: "none", md: "flex" }}
            src={`img/basslines.svg`}
          />
          <Box
            display={{ xs: "none", md: "unset" }}
            sx={{ marginLeft: "auto", marginRight: "20px" }}
          >
            <GlobalSearch />
          </Box>
          <SettingsDialog
            sx={{
              marginRight: isSmallScreen ? "unset" : "24px",
              marginLeft: isSmallScreen ? "auto" : "unset",
            }}
          />
        </Toolbar>
      </AppBar>
      <MuiDrawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        PaperProps={{
          sx: { 
            width: isSmallScreen ? "100vw" : drawerWidth,
            maxWidth: "500px",
            boxShadow: "-2px 0 6px -1px rgb(0, 0, 0, .20) inset" ,
            position: isSmallScreen ? "fixed" : "relative",
          },
        }}
        open={!isSmallScreen || menuOpen}
      >
        <DrawerHeader />
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
                  setMenuOpen(false);
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
        {!!dailySongs.length && (
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
              <StatBox>
                <Typography
                  variant="caption"
                  color={theme.palette.primary.light}
                >
                  Daily Songs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {dailySongs.length}
                </Typography>
              </StatBox>
              <StatBox>
                <Typography
                  variant="caption"
                  color={theme.palette.primary.light}
                >
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
              </StatBox>
              <StatBox>
                <Typography
                  variant="caption"
                  color={theme.palette.primary.light}
                >
                  Rating Progress
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {percentRated ? Math.round(percentRated) : "--"}%
                  </Typography>
                </Box>
              </StatBox>

              {!!winner && (
                <StatBox>
                  <Typography
                    variant="caption"
                    color={theme.palette.primary.light}
                  >
                    Today's Winner
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {allSongsRated
                      ? winner?.user?.firstName + " " + winner?.user?.lastName
                      : "--"}
                  </Typography>
                  {winner?.link && allSongsRated ? (
                    <>
                      <Link
                        noWrap
                        sx={{ fontWeight: "bold" }}
                        variant="subtitle1"
                        href={winner?.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {allSongsRated ? winner?.title : "--"}
                      </Link>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                        sx={{ fontWeight: "bold" }}
                      >
                        {allSongsRated ? winner?.artist : "--"}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                      sx={{ fontWeight: "bold" }}
                    >
                      {`${allSongsRated ? winner?.title : "--"} -
                     ${allSongsRated ? winner?.artist : "--"}
                   `}
                    </Typography>
                  )}
                  <Typography
                    variant="h5"
                    color={theme.palette.secondary.main}
                    sx={{ fontWeight: "bold" }}
                  >
                    {allSongsRated ? winner?.rating : "--"}
                  </Typography>
                </StatBox>
              )}
            </Box>
          </Box>
        )}
        <Typography sx={{ margin: "auto auto 10px auto" }} variant="caption">
          {props.version}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ color: theme.palette.primary.main }}
          onClick={logout}
        >
          Logout
        </Button>
      </MuiDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: "24px",
          pb: profile?.premium ? 13 : "",
          overflow: "auto",
          height: "100vh"
        }}
        className={classes.slimScrollbar}
      >
        <DrawerHeader />
        {props.content}
      </Box>
    </Box>
  );
}

const useStyles = makeStyles(() => {
  return {
    slimScrollbar: {
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "rgba(0, 0, 0, 0.2)",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderRadius: "4px",
      },
    },
  };
});
