import {
  Avatar,
  Paper,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Tooltip,
  Link,
  Box,
  Stack,
  Badge,
  styled,
} from "@mui/material";
import * as React from "react";
import { LikesApi, SongModel, UserModel, UserRole } from "../../data/src";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { format } from "date-fns";
import { call } from "../../data/callWrapper";
import { parseSpotifyId } from "../../utils";
import { useSpotify } from "../../contexts/spotifyContext";
import { useUserState } from "../../contexts";
import { useHistory } from "react-router-dom";

interface ISongCardProps {
  song: SongModel;
  allSongsRated: boolean;
  setSelectedSong: React.Dispatch<React.SetStateAction<SongModel>>;
  setRatingAnchor: React.Dispatch<React.SetStateAction<unknown>>;
  refreshSongs: () => void;
  setEditSongDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ranking?: "first" | "second" | "third";
  playing: boolean;
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const SongCard = (props: ISongCardProps) => {
  const { userInfo, userCanReview } = useUserState();
  const {
    dispatch: spotifyDispatch,
    state: { authorized, deviceId, player },
  } = useSpotify();

  const theme = useTheme();
  const firstName = props.song?.user?.firstName;
  const lastName = props.song?.user?.lastName;
  const history = useHistory();

  const songIsRated = typeof props.song.rating === "number";
  const isUserSong = props.song.user.username === userInfo?.username;
  const isCurrentSubmissionDate =
    format(props.song.submitteddate, "yyyy-MM-dd") ===
    format(new Date(), "yyyy-MM-dd");

  const saveLike = async () => {
    try {
      props.song.likes?.map((m) => m.userId).indexOf(userInfo.id) > -1
        ? await call(LikesApi).apiLikesDelete({
            likeModel: {
              ...props.song.likes.filter((f) => f.userId === userInfo.id)[0],
            },
          })
        : await call(LikesApi).apiLikesPost({
            likeModel: { userId: userInfo.id, songId: props.song.id },
          });
      props.refreshSongs();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Paper sx={{ mt: "8px", p: "4px" }} variant="outlined">
      <Grid container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          item
          xs={2}
          md={1}
        >
          <Badge
            overlap="rectangular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={<SmallAvatar src={`${props.ranking}.svg`} />}
            invisible={!props.ranking}
          >
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                color: "primary.main",
              }}
            >
              {props.allSongsRated
                ? `${firstName.split("")[0]}${lastName.split("")[0]}`
                : "??"}
            </Avatar>
          </Badge>
        </Grid>
        <Grid container alignItems="center" item xs={5} md={4}>
          <Grid container alignItems="center" item xs={12}>
            {props.song.link ? (
              <Link
                noWrap
                sx={{ color: "inherit" }}
                href={props.song.link}
                variant="h6"
                target="_blank"
                rel="noreferrer"
              >
                {props.song.title}
              </Link>
            ) : (
              <Typography sx={{ m: 0 }} variant="h6" noWrap>
                {props.song.title}
              </Typography>
            )}
          </Grid>
          <Grid container alignItems="center" item xs={12}>
            <Typography
              sx={{ m: 0, color: "text.textColor" }}
              variant="subtitle1"
              noWrap
            >
              {props.song.artist}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          sx={{ display: { xs: "none", md: "flex" } }}
          container
          alignItems="center"
          item
          xs={2}
        >
          <Grid container alignItems="end" item xs={12}>
            <Typography variant="body2">Genre</Typography>
          </Grid>
          <Grid container alignItems="center" item xs={12}>
            <Typography variant="subtitle1">
              {props.song.genre?.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          sx={{ display: { xs: "none", md: "flex" } }}
          container
          alignItems="center"
          item
          xs={2}
        >
          <Grid container alignItems="end" item xs={12}>
            <Typography variant="body2">User</Typography>
          </Grid>
          <Grid container alignItems="center" item xs={12}>
            <Typography variant="subtitle1">
              {props.allSongsRated
                ? `${props.song.user.firstName} ${props.song.user.lastName}`
                : "--"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" item xs={1}>
          <Tooltip title={userCanReview ? "Click to rate" : ""}>
            <Typography
              sx={{ cursor: userCanReview ? "pointer" : "unset" }}
              color="secondary"
              variant="h5"
              onClick={(e) => {
                if (userCanReview) {
                  props.setRatingAnchor(e.currentTarget);
                  props.setSelectedSong(props.song);
                }
              }}
            >
              {props.song.rating || "--"}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          item
          xs={2}
          md={1}
        >
          <Stack>
            <Box>
              <IconButton onClick={saveLike} disabled={isUserSong} size="small">
                <ThumbUpIcon
                  sx={{
                    color: isUserSong
                      ? "disabled"
                      : props.song.likes
                          .map((m) => m.userId)
                          .indexOf(userInfo.id) > -1
                      ? "secondary.main"
                      : "",
                  }}
                />
              </IconButton>
            </Box>
            <Tooltip
              title={
                props.song.likes?.length > 0 ? (
                  <span style={{ whiteSpace: "pre-line" }}>
                    {props.song.likes?.map(
                      (m) => `${m.user?.firstName} ${m.user?.lastName}\n`
                    )}
                  </span>
                ) : (
                  ""
                )
              }
            >
              <Typography
                textAlign="center"
                variant="subtitle2"
                color="text.secondary"
              >
                {props.song.likes?.length || 0}
              </Typography>
            </Tooltip>
          </Stack>
          {isUserSong && (
            <IconButton
              sx={{ marginRight: "20px" }}
              disabled={songIsRated || !isCurrentSubmissionDate}
              size="small"
              onClick={() => props.setEditSongDialogOpen(true)}
            >
              <EditIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SongCard;

//TODO: add listener on home route to player, keep track of currently playing track and style card differently thusly
//TODO: add profile get endpoint with saved tracks and acct type, among other things?
//TODO: like a track endpoint
//TODO: add track to playback queue