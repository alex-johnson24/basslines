import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  CircularProgress,
  Container,
  Fab,
  Icon,
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

interface IHomeDashboardProps {
  userInfo: UserModel;
  selectedDate: Date;
}

const HomeDashboard = (props: IHomeDashboardProps) => {
  const theme = useTheme();

  const classes = useStyles(theme);

  const [dailySongs, setDailySongs] = React.useState<SongModel[]>([]);
  const [reviewerQueue, setReviewerQueue] = React.useState<UserModel[]>([]);
  const [currentReviewer, setCurrentReviewer] = React.useState<UserModel>(null);
  const [songDialogOpen, setSongDialogOpen] = React.useState<boolean>(false);
  const [currentUserSong, setCurrentUserSong] = React.useState<SongModel>(null);
  const [ratingPopoverAnchor, setRatingPopoverAnchor] = React.useState(null);
  const [songToRate, setSongToRate] = React.useState<SongModel>(null);
  const [connection, setConnection] = React.useState<HubConnection>(null);

  const uniqueDailyRatings = [...new Set(dailySongs.map((m) => m.rating))].sort(
    (a, b) => b - a
  );

  const formattedDate = format(props.selectedDate, "yyyy-MM-dd");

  const allSongsRated =
    dailySongs.filter((f) => typeof f.rating !== "number").length === 0;

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
      setDailySongs(songsResults);
    }
  );

  React.useEffect(() => {
    (async () => {
      try {
        setCurrentReviewer(await call(ReviewersApi).apiReviewersActiveGet());
        setReviewerQueue(
          await call(ReviewersApi).apiReviewersGetReviewerQueueGet()
        );
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

  const registerSongEvents = async () => {
    if (connection) {
      await connection.start();
      connection.on("ReceiveSongEvent", (song: SongModel) => {
        setDailySongs((current) => [
          ...current.filter((f) => f.id !== song.id),
          SongModelFromJSON(song),
        ]);
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
        dailySongs.filter(
          (f) => f.user?.username === props.userInfo?.username
        )[0]
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
      <RatingPopover
        anchorEl={ratingPopoverAnchor}
        handleClose={closeRatingPopover}
        selectedSong={songToRate}
        setSelectedSong={setSongToRate}
      />
      <SongDialog
        open={songDialogOpen}
        handleClose={handleSongDialogClose}
        userInfo={props.userInfo}
        userSong={currentUserSong}
      />
      <Container
        sx={{ height: "calc(100vh - 228px)", overflowY: "auto" }}
        maxWidth={false}
        className={classes.scrollbar}
      >
        <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 4 }}>
          <HeadphoneIcon
            sx={{ height: "54px", width: "54px", marginRight: "20px" }}
            reviewerQueue={reviewerQueue}
          />
          <Box>
            <Typography sx={{ fontSize: "16px", color: "text.textColor" }}>
              Current Reviewer
            </Typography>
            <Typography sx={{ fontSize: "20px" }}>
              {currentReviewer?.firstName ? (
                `${currentReviewer?.firstName} ${currentReviewer?.lastName}`
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                  }}
                >
                  --
                </div>
              )}
            </Typography>
          </Box>
        </Box>
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
              userInfo={props.userInfo}
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
                    .indexOf(props.userInfo?.username) > -1
                }
              >
                <AddIcon />
              </Fab>
            </span>
          </Tooltip>
        </Box>
      </Container>
    </>
  );
};

export default HomeDashboard;
