import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import {
  Box,
  ButtonBase,
  Divider,
  Fab,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { call } from "../../data/callWrapper";
import { useMutation } from "react-query";
import { SongsApi, SongModel, UserModel, UserRole } from "../../data/src";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import {
  limitStringLength,
  MAX_LIMITED_FIELD_LENGTH,
} from "../../utils/textUtils";
import SongDialog from "./SongDialog";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import RateReviewIcon from "@mui/icons-material/RateReview";
import RatingPopover from "./RatingPopover";

const useStyles = makeStyles(() => {
  return {
    paddedGrid: {
      padding: "10px 15px",
    },
    vCenteredGrid: {
      display: "flex",
      alignItems: "center",
    },
  };
});

interface IHomeDashboardProps {
  userInfo: UserModel;
}

const HomeDashboard = (props: IHomeDashboardProps) => {
  const classes = useStyles();

  const theme = useTheme();

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );

  const [dailySongs, setDailySongs] = React.useState<SongModel[]>([]);
  const [songDialogOpen, setSongDialogOpen] = React.useState<boolean>(false);
  const [currentUserSong, setCurrentUserSong] = React.useState<SongModel>(null);
  const [ratingPopoverAnchor, setRatingPopoverAnchor] = React.useState(null);
  const [songToRate, setSongToRate] = React.useState<SongModel>(null);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

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
    getSongs();
  };

  const openRatingPopover = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setRatingPopoverAnchor(event.currentTarget);
  };

  const closeRatingPopover = () => {
    setRatingPopoverAnchor(null);
    getSongs();
  };

  React.useEffect(() => {
    if (dailySongs.length > 0) {
      setCurrentUserSong(
        dailySongs.filter(
          (f) => f.user?.username === props.userInfo?.username
        )[0]
      );
    }
  }, [dailySongs]);

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
      <Grid sx={{ marginBottom: "25px" }} container>
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
          <Typography color="primary" variant="h4">
            Daily Songs: {dailySongs.length}
          </Typography>
        </Grid>
        <Grid className={classes.vCenteredGrid} item xs={4}>
          <Typography color="primary" variant="h4">
            Daily Avg:{" "}
            {(
              dailySongs.reduce((a, b) => a + b.rating, 0) /
              (1.0 * dailySongs.length)
            ).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid
        className={classes.paddedGrid}
        sx={{ backgroundColor: theme.palette.primary.light, color: "white" }}
        container
      >
        <Grid item xs={3}>
          Title
        </Grid>
        <Grid item xs={3}>
          Artist
        </Grid>
        <Grid item xs={2}>
          Genre
        </Grid>
        <Grid item xs={2}>
          Submitter
        </Grid>
        <Grid item xs={1}>
          Rating
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Divider />
      {dailySongs
        .sort((a, b) => b.rating - a.rating)
        .map((song, i) => (
          <React.Fragment key={i}>
            <Divider />
            <Grid className={classes.paddedGrid} container>
              <Tooltip
                title={
                  song.title.length > MAX_LIMITED_FIELD_LENGTH ? song.title : ""
                }
              >
                <Grid container alignItems="center" item xs={3}>
                  {limitStringLength(song.title)}
                </Grid>
              </Tooltip>
              <Tooltip
                title={
                  song.artist.length > MAX_LIMITED_FIELD_LENGTH
                    ? song.artist
                    : ""
                }
              >
                <Grid container alignItems="center" item xs={3}>
                  {limitStringLength(song.artist)}
                </Grid>
              </Tooltip>
              <Grid container alignItems="center" item xs={2}>
                {song.genre.name}
              </Grid>
              <Grid container alignItems="center" item xs={2}>
                {song.user.username}
              </Grid>
              <Grid container alignItems="center" item xs={1}>
                <span>
                  {typeof song.rating === "number" ? song.rating : ""}
                </span>
                {(props.userInfo.role === UserRole.Administrator ||
                  props.userInfo.role === UserRole.Reviewer) && (
                  <IconButton
                    onClick={(event) => {
                      setSongToRate(song);
                      openRatingPopover(event);
                    }}
                    size="small"
                  >
                    <RateReviewIcon />
                  </IconButton>
                )}
              </Grid>
              <Grid container alignItems="center" item xs={1}>
                {song.user.username === props.userInfo?.username &&
                formattedDate === format(new Date(), "yyyy-MM-dd") &&
                typeof song.rating !== "number" ? (
                  <IconButton
                    size="small"
                    onClick={() => setSongDialogOpen(true)}
                  >
                    <EditIcon />
                  </IconButton>
                ) : null}
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Tooltip
          title={
            formattedDate !== format(new Date(), "yyyy-MM-dd")
              ? ""
              : "Submit Daily Song"
          }
        >
          <Fab
            sx={{ marginRight: "30px", marginTop: "30px" }}
            onClick={() => setSongDialogOpen(true)}
            color="primary"
            aria-label="add"
            disabled={
              formattedDate !== format(new Date(), "yyyy-MM-dd") ||
              dailySongs
                .map((m) => m.user?.username)
                .indexOf(props.userInfo?.username) > -1
            }
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  );
};

export default HomeDashboard;
