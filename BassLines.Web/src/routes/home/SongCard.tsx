import AddRounded from "@mui/icons-material/AddRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import {
  Avatar,
  Chip,
  Grid,
  IconButton,
  Link,
  styled,
  SvgIcon,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/system/Box";
import * as React from "react";
import { useSpotify } from "../../contexts/spotifyContext";
import { SpotifyApi } from "../../data/src/apis/SpotifyApi";
import { SongModel, SpotifyTrackDetails } from "../../data/src/models";
import { parseSpotifyId } from "../../utils";
import { useTheme } from "@mui/material/styles";
import ThumbUp from "@mui/icons-material/ThumbUp";
import Edit from "@mui/icons-material/Edit";
import useMediaQuery from "@mui/material/useMediaQuery";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import RatingInputField from "./RatingInputField";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { makeStyles } from "@mui/styles";
import { LikesApi, SongsApi } from "../../data/src";
import { call } from "../../data/callWrapper";
import { useUserState } from "../../contexts";
import { animated } from "react-spring";
import useAnimation, { HookStyle } from "../../hooks/useAnimation";
import { format } from "date-fns";

interface IProps {
  song: SongModel & { saved?: boolean };
  allSongsRated: boolean;
  setSelectedSong: React.Dispatch<React.SetStateAction<SongModel>>;
  refreshSongs: () => void;
  setEditSongDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ranking?: "first" | "second" | "third";
  toggleSaved: (id: string, save: boolean) => Promise<void>;
  trackDetails?: SpotifyTrackDetails;
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  float: "right",
  width: 30,
  height: 30,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const useStyles = makeStyles(() => ({
  root: {
    "& .reset-icon": {
      display: "none",
    },
    "&:hover .reset-icon": {
      display: "inline-flex",
    },
  },
}));

const resetRating = async (toSubmit: SongModel) => {
  try {
    await call(SongsApi).apiSongsPut({ songModel: toSubmit });
  } catch (e) {
    console.log("song reset failed", e);
  }
};

export default function SongCard(props: IProps) {
  const firstName = props.song?.user?.firstName;
  const lastName = props.song?.user?.lastName;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { userInfo } = useUserState();
  const isUserSong = props.song.user.username === userInfo?.username;

  const isInitialMount = React.useRef(true);
  const [style, trigger] = useAnimation({ y: -9 });

  const songIsRated = typeof props.song.rating === "number";
  const isCurrentSubmissionDate =
    format(props.song.submitteddate, "yyyy-MM-dd") ===
    format(new Date(), "yyyy-MM-dd");

  const classes = useStyles();

  const spotifyProps = {
    ...props,
    iconSize: isSmallScreen ? "14px" : "20px",
  };

  const spotifyActionLocation = {
    bottom: isSmallScreen ? "75px" : "33px",
    right: isSmallScreen ? "15px" : "75px",
  };

  const nameAvatarLocation = {
    bottom: isSmallScreen ? "30px" : "30px",
    right: isSmallScreen ? "8px" : "15px",
  };

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      trigger();
    }
  }, [props.song.likes.length]);

  return (
    <Paper
      sx={{
        mt: "8px",
        p: "12px 16px 20px 16px",
        position: "relative",
        minHeight: "115px",
      }}
      variant="outlined"
    >
      <Grid container alignItems="center">
        <Grid item xs={5} md={4}>
          <SongTitle {...props} />
          <Typography
            sx={{ m: 0, color: "text.textColor" }}
            variant="subtitle1"
            noWrap
          >
            {props.song.artist}
          </Typography>
        </Grid>
        <Grid display={{ xs: "none", md: "unset" }} item xs={2}>
          <Typography variant="body2">Genre</Typography>
          <Typography variant="subtitle1">{props.song.genre?.name}</Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          bottom: "5px",
          left: "10px",
          alignItems: "center",
        }}
      >
        <animated.span style={style}>
          <SmallAvatar
            sx={{
              bgcolor: "secondary.main",
              color: "white",
              opacity: ".75",
            }}
          >
            <ThumbUpOutlinedIcon
              sx={{
                color: "white",
                fontSize: "16px",
              }}
            />
          </SmallAvatar>
        </animated.span>
        <Typography
          textAlign="center"
          variant="subtitle2"
          color="text.secondary"
          sx={{ ml: "8px" }}
        >
          {props.song.likes?.length || 0}
        </Typography>
        {!songIsRated && isCurrentSubmissionDate && isUserSong && (
          <Chip
            sx={{
              ml: "20px",
            }}
            icon={<Edit />}
            label="Edit Song"
            variant="outlined"
            color="secondary"
            onClick={() => props.setEditSongDialogOpen(true)}
            size="small"
          />
        )}
      </Box>
      <Box sx={{ position: "absolute", ...spotifyActionLocation }}>
        <SpotifyActions {...spotifyProps} />
      </Box>
      <Box
        sx={{ position: "absolute", top: "0", right: "35%", marginTop: "-2px" }}
        className={classes.root}
      >
        {props.song?.rating ? (
          <>
            <SvgIcon
              sx={{ width: "62px", height: "102px" }}
              viewBox="0 0 62 101"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#50D292"
                d="M 0 0 H 68.1595 V 101.6194 L 33.0148 80.3195 L 0 101.6194 V 0 Z"
              />
              <text
                fontSize="24px"
                fontWeight="lighter"
                color="#FFFFFF"
                fill="#FFFFFF"
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
              >
                {props.song.rating.toFixed(2)}
              </text>
            </SvgIcon>
            <IconButton
              sx={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                color: "white",
              }}
              size="small"
              className="reset-icon"
              children={<RestartAltIcon />}
              onClick={(e) => {
                resetRating({
                  ...props.song,
                  rating: null,
                  reviewer: { ...userInfo },
                });
              }}
            />
          </>
        ) : (
          <RatingInputField
            sx={{
              position: "absolute",
              top: "35px",
              left: "-55px",
              width: "100px",
            }}
            selectedSong={props.song}
          />
        )}
      </Box>
      <Avatar
        src={`img/${props.ranking}.svg`}
        imgProps={{
          sx: { width: "75%", height: "75%" },
        }}
        sx={{
          bgcolor:
            props.ranking && props.allSongsRated ? "unset" : "secondary.main",
          color: "white",
          position: "absolute",
          fontWeight: "lighter",
          ...nameAvatarLocation,
        }}
      >
        {props.allSongsRated
          ? `${firstName.split("")[0]}${lastName.split("")[0]}`
          : "??"}
      </Avatar>
      {props.allSongsRated && (
        <Box sx={{ position: "absolute", bottom: "5px", right: "9px" }}>
          <Typography variant="subtitle2">{`${props.song?.user?.firstName} ${props.song?.user?.lastName}`}</Typography>
        </Box>
      )}
    </Paper>
  );
}

const SongTitle = ({ song }: IProps) => (
  <>
    {song.link ? (
      <Link
        noWrap
        sx={{ color: "inherit" }}
        href={song.link}
        variant="h6"
        target="_blank"
        rel="noreferrer"
        display="block"
      >
        {song.title}
      </Link>
    ) : (
      <Typography sx={{ m: 0 }} variant="h6" noWrap>
        {song.title}
      </Typography>
    )}
  </>
);

const SpotifyActions = ({
  song,
  toggleSaved,
  iconSize,
}: IProps & { iconSize: string }) => {
  const {
    state: { authorized },
    callSpotify,
  } = useSpotify();
  const [spotifyTrackId, isValid] = parseSpotifyId(song.link);
  const theme = useTheme();
  const { userInfo } = useUserState();

  const saveLike = async () => {
    try {
      song.likes?.map((m) => m.userId).indexOf(userInfo.id) > -1
        ? await call(LikesApi).apiLikesDelete({
            likeModel: {
              ...song.likes.filter((f) => f.userId === userInfo.id)[0],
            },
          })
        : await call(LikesApi).apiLikesPost({
            likeModel: { userId: userInfo.id, songId: song.id },
          });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isValid && authorized && (
        <>
          <IconButton
            disableRipple
            onClick={() =>
              callSpotify(SpotifyApi)
                .apiSpotifyPlayPut({
                  playContextRequest: {
                    uris: [`spotify:track:${spotifyTrackId}`],
                    positionMs: 0,
                  },
                })
                .catch(console.warn)
            }
            sx={{ "& svg": { fontSize: iconSize } }}
            children={<PlayArrowRounded />}
          />
          <IconButton
            disableRipple
            onClick={() => toggleSaved(spotifyTrackId, !song.saved)}
            sx={{ "& svg": { fontSize: iconSize } }}
            children={
              // song.saved === undefined ? null : song.saved ?
              false ? (
                <FavoriteRounded htmlColor={theme.palette.secondary.main} />
              ) : (
                <FavoriteBorderRounded />
              )
            }
          />
          <IconButton
            disableRipple
            onClick={() =>
              callSpotify(SpotifyApi)
                .apiSpotifyAddToQueueSpotifyIdPost({
                  spotifyId: spotifyTrackId,
                })
                .catch(console.warn)
            }
            sx={{ "& svg": { fontSize: iconSize } }}
            children={<AddRounded />}
          />
        </>
      )}
      <IconButton
        sx={{
          "& svg": { fontSize: iconSize },
          color:
            song.likes.map((m) => m.userId).indexOf(userInfo.id) > -1
              ? "secondary.main"
              : "",
        }}
        children={<ThumbUp />}
        onClick={saveLike}
      />
    </>
  );
};
