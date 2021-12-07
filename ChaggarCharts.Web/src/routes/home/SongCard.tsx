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
} from "@mui/material";
import * as React from "react";
import { LikesApi, SongModel, UserModel, UserRole } from "../../data/src";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { format } from "date-fns";
import { call } from "../../data/callWrapper";

interface ISongCardProps {
  song: SongModel;
  allSongsRated: boolean;
  setSelectedSong: React.Dispatch<React.SetStateAction<SongModel>>;
  setRatingAnchor: React.Dispatch<React.SetStateAction<unknown>>;
  userInfo: UserModel;
  refreshSongs: () => void;
  setEditSongDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongCard = (props: ISongCardProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const firstName = props.song?.user?.firstName;
  const lastName = props.song?.user?.lastName;

  const songIsRated = typeof props.song.rating === "number";
  const isUserSong = props.song.user.username === props.userInfo?.username;
  const isCurrentSubmissionDate =
    format(props.song.submitteddate, "yyyy-MM-dd") ===
    format(new Date(), "yyyy-MM-dd");

  const saveLike = async () => {
    try {
      await call(LikesApi).likesPost({
        likeModel: { userId: props.userInfo.id, songId: props.song.id },
      });
      props.refreshSongs();
    } catch (err) {
      console.log(err);
    }
  };

  const userCanReview =
    props.userInfo.role === UserRole.Administrator ||
    props.userInfo.role === UserRole.Reviewer;

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
        </Grid>
        <Grid container alignItems="center" item xs={5} md={4}>
          <Grid container alignItems="center" item xs={12}>
            {props.song.link ? (
              <Link
                noWrap
                sx={{ color: "inherit" }}
                href={props.song.link}
                variant="h6"
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
              sx={{ m: 0, color: "primary.light" }}
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
          justifyContent="space-evenly"
          item
          xs={3}
          md={2}
        >
          {isUserSong && (
            <IconButton
              disabled={songIsRated || !isCurrentSubmissionDate}
              size="small"
              onClick={() => props.setEditSongDialogOpen(true)}
            >
              <EditIcon />
            </IconButton>
          )}
          {!isUserSong && (
            <IconButton
              onClick={saveLike}
              disabled={
                props.song.likes
                  .map((m) => m.userId)
                  .indexOf(props.userInfo.id) > -1
              }
              size="small"
            >
              <ThumbUpIcon />
            </IconButton>
          )}
          <Chip
            size={isSmallScreen ? "small" : "medium"}
            color="secondary"
            label={props.song.likes?.length || 0}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SongCard;
