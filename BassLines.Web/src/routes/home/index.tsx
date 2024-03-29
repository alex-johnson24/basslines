import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";
import Send from "@mui/icons-material/Send";
import Refresh from "@mui/icons-material/Refresh";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { call } from "../../data/callWrapper";
import { useMutation } from "react-query";
import {
  SongsApi,
  SongModel,
  UserModel,
  ReviewersApi,
  SpotifyApi,
  TrackSavedReference,
  SpotifyTrackDetails,
} from "../../data/src";
import { format } from "date-fns";
import SongDialog from "./SongDialog";
import HeadphoneIcon from "./HeadphoneIcon";
import { useUserState } from "../../contexts";
import { useSongDispatch, useSongState } from "../../contexts/songContext";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { getListOfSpotifyUris, parseSpotifyId } from "../../utils";
import { useSpotify } from "../../contexts/spotifyContext";
import SpotifyLogo from "../spotify/spotifyLogo";
import Grid from "@mui/material/Grid";
import ReviewerQueueEntry from "./ReviewerQueueEntry";
import useMediaQuery from "@mui/material/useMediaQuery";
import SongCard from "./SongCard";

const useStyles = makeStyles(() => {
  return {
    header: {
      backgroundColor: (theme: Theme) => theme.palette.primary.light,
      color: "white",
    },
    paddedGrid: {
      padding: "10px 15px",
    },
    vCenteredGrid: {
      display: "flex",
      alignItems: "center",
    },
    scrollbar: {
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

export interface ActionMenuItem {
  label: string;
  id: string | any;
  onClick?: (id: string | any) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface IHomeDashboardProps {
  selectedDate: Date;
}

const HomeDashboard = React.memo((props: IHomeDashboardProps) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { userInfo, userCanReview } = useUserState();
  const [reviewerQueue, setReviewerQueue] = React.useState<UserModel[]>([]);
  const [currentReviewer, setCurrentReviewer] = React.useState<UserModel>(null);
  const [songDialogOpen, setSongDialogOpen] = React.useState<boolean>(false);
  const [currentUserSong, setCurrentUserSong] = React.useState<SongModel>(null);
  const [songToRate, setSongToRate] = React.useState<SongModel>(null);
  const [localReviewerNotes, setLocalReviewerNotes] =
    React.useState<string>("");
  const [tracksDetails, setTracksDetails] = React.useState<
    SpotifyTrackDetails[]
  >([]);

  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");

  const {
    state: { profile, authorized },
    callSpotify,
  } = useSpotify();

  const dispatch = useSongDispatch();

  const { dailySongs, reviewerNotes, connection } = useSongState();

  const uniqueDailyRatings = [...new Set(dailySongs.map((m) => m.rating))].sort(
    (a, b) => b - a
  );

  const formattedDate = format(props.selectedDate, "yyyy-MM-dd");

  const { allSongsRated } = useSongState();

  const getSongRanking = (song: SongModel) => {
    if (uniqueDailyRatings.filter((f) => f == null).length > 0) return null;
    if (song.rating === uniqueDailyRatings[0]) {
      return "first";
    } else if (song.rating === uniqueDailyRatings[1]) {
      return "second";
    } else if (song.rating === uniqueDailyRatings[2]) {
      return "third";
    } else return null;
  };

  const { mutateAsync: getSongs, status: songsStatus } = useMutation(
    async () => {
      const songsResults = await call(
        SongsApi
      ).apiSongsSubmissionDateSubmitDateStringGet({
        submitDateString: formattedDate,
      });
      let savedArr: TrackSavedReference[];
      try {
        if (authorized && songsResults.length) {
          const requestBody = songsResults.reduce((a, { link }) => {
            const [spotifyId, valid] = parseSpotifyId(link);
            valid && a.push(spotifyId);
            return a;
          }, []);
          if (requestBody.length) {
            savedArr = await callSpotify(SpotifyApi).apiSpotifyCheckSavedPost({
              requestBody,
            });
          }
        }
      } catch (er) {
        console.warn(er);
      }
      dispatch({
        type: "setDailySongs",
        payload: songsResults.map((s) => ({
          ...s,
          saved: savedArr?.find(({ id }) => s.link?.includes(id))?.saved,
        })),
      });
    }
  );

  const toggleSaved = async (spotifyId: string, save: boolean) => {
    try {
      const { saved, id } = await callSpotify(
        SpotifyApi
      ).apiSpotifySaveOrRemoveIdPut({
        id: spotifyId,
        save,
      });
      dispatch({
        type: "setDailySongs",
        payload: dailySongs.map((s) => ({
          ...s,
          saved: s?.link?.includes(id) ? saved : s.saved,
        })),
      });
    } catch (ex) {
      console.warn(ex);
    }
  };

  const getReviewerNotes = async () => {
    const results = await call(ReviewersApi).apiReviewersNotesGet();
    setLocalReviewerNotes(results);
    dispatch({ type: "setReviewerNotes", payload: results });
  };

  React.useEffect(() => {
    (async () => {
      try {
        setCurrentReviewer(await call(ReviewersApi).apiReviewersActiveGet());
        setReviewerQueue(
          await call(ReviewersApi).apiReviewersGetReviewerQueueGet()
        );
        await getReviewerNotes();
      } catch (e) {}
    })();
  }, []);

  React.useEffect(() => {
    getSongs();
  }, [props.selectedDate]);

  const handleSongDialogClose = () => {
    setSongDialogOpen(false);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const putReviewerNotes = async () => {
    try {
      await call(ReviewersApi).apiReviewersNotesPut({
        reviewerNotesModel: {
          notes: localReviewerNotes,
        },
      });
      dispatch({
        type: "setReviewerNotes",
        payload: localReviewerNotes,
      });
      setSnackbarMessage("Note posted!");
      setSnackbarOpen(true);
    } catch (ex) {
      console.log(ex);
    }
  };

  const registerSongEvents = async () => {
    if (connection) {
      connection.on("ReceiveSongEvent", (song: SongModel, studioId: string) => {
        if (studioId === userInfo.studioId) {
          dispatch({
            type: "receiveSongEvent",
            payload: song,
          });
        }
      });
      connection.on("ReceiveNoteEvent", (notes: string, studioId: string) => {
        if (studioId === userInfo.studioId) {
          dispatch({
            type: "setReviewerNotes",
            payload: notes,
          });
          setLocalReviewerNotes(notes);
        }
      });
    }
  };

  React.useEffect(() => {
    registerSongEvents();
  }, [connection]);

  React.useEffect(() => {
    if (dailySongs.length > 0) {
      setCurrentUserSong(
        dailySongs.filter((f) => f.user?.username === userInfo?.username)[0]
      );
    } else {
      setCurrentUserSong(null);
    }
  }, [dailySongs]);

  const sortedSongs = dailySongs.sort((a, b) =>
    allSongsRated
      ? b.rating - a.rating
      : b.createdatetime.getTime() - a.createdatetime.getTime()
  );

  const uris = getListOfSpotifyUris(sortedSongs.map(({ link }) => link));

  React.useEffect(() => {
    !!uris?.length &&
      callSpotify(SpotifyApi)
        .apiSpotifyTracksPost({
          requestBody: sortedSongs
            .map(({ link }) => {
              const [id, valid] = parseSpotifyId(link);
              return valid ? id : undefined;
            })
            .filter(Boolean),
        })
        .then(setTracksDetails)
        .catch(console.warn);
  }, [sortedSongs]);

  const disableSubmission =
    formattedDate !== format(new Date(), "yyyy-MM-dd") ||
    dailySongs.map((m) => m.user?.username).indexOf(userInfo?.username) > -1;

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <SongDialog
        open={songDialogOpen}
        handleClose={handleSongDialogClose}
        userInfo={userInfo}
        userSong={currentUserSong}
      />
      <Container maxWidth={isSmallScreen ? "xl" : false}>
        <Grid container>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
            }}
          >
            <HeadphoneIcon
              style={{ height: "54px", width: "54px", marginRight: "20px" }}
              reviewerQueue={reviewerQueue}
            />
            <Box sx={{ minWidth: "250px" }}>
              <Typography sx={{ fontSize: "16px", color: "text.textColor" }}>
                Current Reviewer
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  paddingLeft: currentReviewer?.firstName ? "unset" : "55px",
                }}
                noWrap
              >
                {currentReviewer?.firstName
                  ? `${currentReviewer?.firstName} ${currentReviewer?.lastName}`
                  : "--"}
              </Typography>
            </Box>
          </Grid>
          {isSmallScreen && (
            <Grid
              sx={{
                display: "inline-flex",
                flexWrap: "nowrap",
                marginBottom: "10px",
              }}
              item
              xs={12}
            >
              {reviewerQueue.map((m, i) => (
                <ReviewerQueueEntry index={i + 1} reviewer={m} />
              ))}
            </Grid>
          )}
          <Grid item xs={12} xl={9}>
            <FormControl style={{ width: "100%" }} variant="filled">
              <InputLabel style={{ fontSize: "16px" }}>
                Reviewer Notes
              </InputLabel>
              <FilledInput
                style={{
                  fontSize: "20px",
                  caretColor: userCanReview ? "unset" : "transparent",
                }}
                fullWidth
                value={localReviewerNotes}
                onChange={(event) => setLocalReviewerNotes(event.target.value)}
                disableUnderline
                readOnly={!userCanReview}
                tabIndex={userCanReview ? 0 : -1}
                autoFocus={userCanReview}
                multiline
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    putReviewerNotes();
                  }
                }}
                endAdornment={
                  userCanReview && (
                    <InputAdornment position="end">
                      {reviewerNotes !== localReviewerNotes && (
                        <Tooltip title="Reset">
                          <IconButton
                            onClick={getReviewerNotes}
                            sx={{ marginRight: "5px" }}
                            edge="end"
                          >
                            <Refresh />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Post Note">
                        <IconButton
                          onClick={putReviewerNotes}
                          sx={{ marginRight: "5px" }}
                          edge="end"
                        >
                          <Send />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        {profile?.premium && !!uris.length && (
          <Button
            variant="contained"
            sx={{
              color: "#50d292",
              mt: 1,
              zIndex: 1,
              width: { xs: "100%", sm: "fit-content" },
              position: { xs: "sticky", sm: "unset" },
              top: { xs: "32px", sm: "unset" },
            }}
            onClick={async () => {
              callSpotify(SpotifyApi)
                .apiSpotifyPlayPut({
                  playContextRequest: {
                    uris,
                    positionMs: 0,
                  },
                })
                .catch((ex) => {});
            }}
          >
            <PlayArrowRounded fontSize="small" /> Play todays BassLines{" "}
            <SpotifyLogo
              fill={"#50d292"}
              style={{ height: 18, marginLeft: 8 }}
            />
          </Button>
        )}
        <Box className={classes.scrollbar} sx={{ pb: 2 }}>
          {!disableSubmission && (
            <AddSongCard onClick={() => setSongDialogOpen(true)} />
          )}
          {sortedSongs.map((m: SongModel, i: number) => (
            <SongCard
              key={i}
              song={m}
              allSongsRated={allSongsRated}
              setSelectedSong={setSongToRate}
              refreshSongs={getSongs}
              setEditSongDialogOpen={setSongDialogOpen}
              ranking={getSongRanking(m)}
              toggleSaved={toggleSaved}
              trackDetails={tracksDetails.find(({ spotifyId }) =>
                m.link?.includes(spotifyId)
              )}
            />
          ))}
        </Box>
      </Container>
    </>
  );
});

export default HomeDashboard;

const AddSongCard = (props: ButtonProps) => (
  <Button
    sx={{
      mt: 1,
      p: "20px 16px 20px 16px",
      position: "relative",
      cursor: "pointer",
      ":hover": {
        border: "1px solid #50d29260",
      },
      ":focus": {
        border: "1px solid #50d29260",
      },
      fontSize: "20px",
      textTransform: "none",
      color: "#50d292",
    }}
    variant="outlined"
    fullWidth
    {...{
      autoFocus: true,
      disableTouchRipple: true,
      disableRipple: true,
      disableFocusRipple: true,
    }}
    {...props}
  >
    <Typography variant="h6" sx={{ textAlign: "center" }}>
      Submit a Song
    </Typography>
  </Button>
);
