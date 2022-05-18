import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  Box,
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

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface IHomeDashboardProps {
  selectedDate: Date;
}

const HomeDashboard = (props: IHomeDashboardProps) => {
  const theme = useTheme();

  const classes = useStyles(theme);

  const { userInfo, userCanReview } = useUserState();

  const [reviewerQueue, setReviewerQueue] = React.useState<UserModel[]>([]);
  const [currentReviewer, setCurrentReviewer] = React.useState<UserModel>(null);
  const [songDialogOpen, setSongDialogOpen] = React.useState<boolean>(false);
  const [currentUserSong, setCurrentUserSong] = React.useState<SongModel>(null);
  const [ratingPopoverAnchor, setRatingPopoverAnchor] = React.useState(null);
  const [songToRate, setSongToRate] = React.useState<SongModel>(null);
  const [connection, setConnection] = React.useState<HubConnection>(null);
  const [localReviewerNotes, setLocalReviewerNotes] =
    React.useState<string>("");

  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");

  const dispatch = useSongDispatch();

  const { dailySongs, reviewerNotes } = useSongState();

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
      dispatch({ type: "setDailySongs", payload: songsResults });
    }
  );

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
      await connection.start();
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
    const newConnection = new HubConnectionBuilder()
      .withUrl("songHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  React.useEffect(() => {
    if (dailySongs.length > 0) {
      setCurrentUserSong(
        dailySongs.filter((f) => f.user?.username === userInfo?.username)[0]
      );
    } else {
      setCurrentUserSong(null);
    }
  }, [dailySongs]);

  React.useEffect(() => {
    registerSongEvents();
  }, [connection]);

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
        <Box
          sx={{ height: "calc(100vh - 312px)", overflowY: "auto" }}
          className={classes.scrollbar}
        >
          {dailySongs
            .sort((a, b) =>
              allSongsRated
                ? b.rating - a.rating
                : b.createdatetime.getTime() - a.createdatetime.getTime()
            )
            .map((m: SongModel, i: number) => (
              <SongCard
                key={i}
                song={m}
                allSongsRated={allSongsRated}
                setSelectedSong={setSongToRate}
                setRatingAnchor={setRatingPopoverAnchor}
                refreshSongs={getSongs}
                setEditSongDialogOpen={setSongDialogOpen}
                ranking={getSongRanking(m)}
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
};

export default HomeDashboard;
