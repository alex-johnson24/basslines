import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import {
  Box,
  Container,
  Fab,
  Grid,
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
} from "../../data/src";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import SongDialog from "./SongDialog";
import RatingPopover from "./RatingPopover";
import SongCard from "./SongCard";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

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
}

const HomeDashboard = (props: IHomeDashboardProps) => {
  const theme = useTheme();

  const classes = useStyles(theme);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );

  const [dailySongs, setDailySongs] = React.useState<SongModel[]>([]);
  const [songDialogOpen, setSongDialogOpen] = React.useState<boolean>(false);
  const [currentUserSong, setCurrentUserSong] = React.useState<SongModel>(null);
  const [ratingPopoverAnchor, setRatingPopoverAnchor] = React.useState(null);
  const [songToRate, setSongToRate] = React.useState<SongModel>(null);
  const [connection, setConnection] = React.useState<HubConnection>(null);

  const uniqueDailyRatings = [...new Set(dailySongs.map((m) => m.rating))].sort(
    (a, b) => b - a
  );

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

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
      ).songsSubmissionDateSubmitDateStringGet({
        submitDateString: formattedDate,
      });
      setDailySongs(songsResults);
    }
  );

  React.useEffect(() => {
    getSongs();
  }, [selectedDate]);

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
      <Grid sx={{ marginBottom: "10px" }} container>
        <Grid item xs={4}>
          <DatePicker
            label="Submission Date"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid className={classes.vCenteredGrid} item xs={4}>
          <Typography color="inherit" variant="h4">
            Daily Songs: {dailySongs.length}
          </Typography>
        </Grid>
        <Grid className={classes.vCenteredGrid} item xs={4}>
          <Typography color="inherit" variant="h4">
            Daily Avg:{" "}
            {(
              dailySongs.reduce((a, b) => a + b.rating, 0) /
              (1.0 * dailySongs.length)
            ).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
      <Container
        sx={{ height: "calc(100vh - 228px)", overflowY: "auto" }}
        maxWidth="xl"
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
