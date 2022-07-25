import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTheme, styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import * as React from "react";
import {
  LikesApi,
  SongModel,
  SpotifyApi,
  SpotifyTrackDetails,
} from "../../data/src";
import { format } from "date-fns";
import { call } from "../../data/callWrapper";
import { parseSpotifyId } from "../../utils";
import { useSpotify } from "../../contexts/spotifyContext";
import { useUserState } from "../../contexts";
import AddRounded from "@mui/icons-material/AddRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import Edit from "@mui/icons-material/Edit";
import ThumbUp from "@mui/icons-material/ThumbUp";
import RatingInputField from "./RatingInputField";

interface ISongCardProps {
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
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const SongCard = React.memo((props: ISongCardProps) => {
  const { userInfo, userCanReview } = useUserState();
  const theme = useTheme();
  const firstName = props.song?.user?.firstName;
  const lastName = props.song?.user?.lastName;
  const {
    state: { authorized },
    callSpotify,
  } = useSpotify();

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

  const [spotifyTrackId, isValid] = parseSpotifyId(props.song.link);

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
            badgeContent={<SmallAvatar src={`img/${props.ranking}.svg`} />}
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
            {isValid && authorized && (
              <>
                <IconButton
                  disableRipple
                  onClick={() =>
                    callSpotify(SpotifyApi)
                      .playPut({
                        playContextRequest: {
                          uris: [`spotify:track:${spotifyTrackId}`],
                          positionMs: 0,
                        },
                      })
                      .catch(console.warn)
                  }
                  sx={{ "& svg": { fontSize: "14px" } }}
                  children={<PlayArrowRounded />}
                />
                <IconButton
                  disableRipple
                  onClick={() =>
                    props.toggleSaved(spotifyTrackId, !props.song.saved)
                  }
                  sx={{ "& svg": { fontSize: "14px" } }}
                  children={
                    props.song.saved === undefined ? null : props.song.saved ? (
                      <FavoriteRounded
                        htmlColor={theme.palette.secondary.main}
                      />
                    ) : (
                      <FavoriteBorderRounded />
                    )
                  }
                />
                <IconButton
                  disableRipple
                  onClick={() =>
                    callSpotify(SpotifyApi)
                      .addToQueueSpotifyIdPost({
                        spotifyId: spotifyTrackId,
                      })
                      .catch(console.warn)
                  }
                  sx={{ "& svg": { fontSize: "14px" } }}
                  children={<AddRounded />}
                />
              </>
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
        <Grid container item xs={1} alignItems="center">
          <RatingInputField selectedSong={props.song} />
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
                <ThumbUp
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
              <Edit />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
});

export default SongCard;
