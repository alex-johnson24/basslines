import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Fab,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Snackbar,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { call } from "../../data/callWrapper";
import { useMutation } from "react-query";
import {
  SongsApi,
  SongModel,
  UserModel,
  SongModelFromJSON,
  ReviewersApi,
  SpotifyApi,
  TrackSavedReference,
  SpotifyTrackDetails,
} from "../../data/src";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import SongDialog from "./SongDialog";
import RatingPopover from "./RatingPopover";
import SongCard from "./SongCard";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import HeadphoneIcon from "./HeadphoneIcon";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useUserState } from "../../contexts";
import { useSongDispatch, useSongState } from "../../contexts/songContext";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { getListOfSpotifyUris, parseSpotifyId } from "../../utils";
import { useSpotify } from "../../contexts/spotifyContext";
import SpotifyLogo from "../spotify/spotifyLogo";
import { PlayArrowRounded } from "@material-ui/icons";

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

  const { userInfo, userCanReview } = useUserState();

  const [reviewerQueue, setReviewerQueue] = React.useState<UserModel[]>([]);
  const [currentReviewer, setCurrentReviewer] = React.useState<UserModel>(null);
  const [songDialogOpen, setSongDialogOpen] = React.useState<boolean>(false);
  const [currentUserSong, setCurrentUserSong] = React.useState<SongModel>(null);
  const [ratingPopoverAnchor, setRatingPopoverAnchor] = React.useState(null);
  const [songToRate, setSongToRate] = React.useState<SongModel>(null);
  const [localReviewerNotes, setLocalReviewerNotes] =
    React.useState<string>("");
  const [tracksDetails, setTracksDetails] = React.useState<SpotifyTrackDetails[]>(
    []
  );

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
      if (authorized && songsResults.length) {
        savedArr = await callSpotify(SpotifyApi).checkSavedPost({
          requestBody: songsResults.reduce((a, { link }) => {
            const [spotifyId, valid] = parseSpotifyId(link);
            valid && a.push(spotifyId);
            return a;
          }, []),
        });
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
      const { saved, id } = await callSpotify(SpotifyApi).saveOrRemoveIdPut({
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

  const closeRatingPopover = () => {
    setRatingPopoverAnchor(null);
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
      connection.on("ReceiveSongEvent", (song: SongModel) => {
        dispatch({
          type: "receiveSongEvent",
          payload: song,
        });
      });
      connection.on("ReceiveNoteEvent", (notes: string) => {
        dispatch({
          type: "setReviewerNotes",
          payload: notes,
        });
        setLocalReviewerNotes(notes);
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
        .tracksPost({
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
      <RatingPopover
        anchorEl={ratingPopoverAnchor}
        handleClose={closeRatingPopover}
        selectedSong={songToRate}
        setSelectedSong={setSongToRate}
      />
      <SongDialog
        open={songDialogOpen}
        handleClose={handleSongDialogClose}
        userInfo={userInfo}
        userSong={currentUserSong}
      />
      <Container maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            marginBottom: 2,
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
          <FormControl style={{ width: "100%" }} variant="filled">
            <InputLabel style={{ fontSize: "16px" }}>Reviewer Notes</InputLabel>
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
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Post Note">
                      <IconButton
                        onClick={putReviewerNotes}
                        sx={{ marginRight: "5px" }}
                        edge="end"
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }
            />
          </FormControl>
        </Box>
        {profile?.premium && (
          <Button
            variant="contained"
            disabled={!uris.length}
            sx={{ color: "#50d292" }}
            onClick={async () => {
              callSpotify(SpotifyApi)
                .playPut({
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
        <Box
          sx={{ height: "calc(100vh - 312px)", overflowY: "auto" }}
          className={classes.scrollbar}
        >
          {sortedSongs.map((m: SongModel, i: number) => (
            <SongCard
              key={i}
              song={m}
              allSongsRated={allSongsRated}
              setSelectedSong={setSongToRate}
              setRatingAnchor={setRatingPopoverAnchor}
              refreshSongs={getSongs}
              setEditSongDialogOpen={setSongDialogOpen}
              ranking={getSongRanking(m)}
              toggleSaved={toggleSaved}
              trackDetails={tracksDetails.find(({ spotifyId }) =>
                m.link?.includes(spotifyId)
              )}
            />
          ))}
          <Box sx={{ position: "absolute", top: "90%", left: "95%" }}>
            <Tooltip
              title={
                formattedDate !== format(new Date(), "yyyy-MM-dd")
                  ? ""
                  : "Submit Daily Song"
              }
            >
              <span>
                <Fab
                  onClick={() => setSongDialogOpen(true)}
                  color="primary"
                  size="medium"
                  disabled={
                    formattedDate !== format(new Date(), "yyyy-MM-dd") ||
                    dailySongs
                      .map((m) => m.user?.username)
                      .indexOf(userInfo?.username) > -1
                  }
                >
                  <AddIcon />
                </Fab>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </>
  );
});

export default HomeDashboard;
