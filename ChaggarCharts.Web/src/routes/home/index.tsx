import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import { Divider, Grid, Tooltip, Typography } from "@mui/material";
import { call } from "../../data/callWrapper";
import { useMutation } from "react-query";
import { SongsApi, SongModel } from "../../data/src";
import { format } from "date-fns";
import { limitStringLength, MAX_LIMITED_FIELD_LENGTH } from "../../utils/textUtils";


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
  //
}

const HomeDashboard = () => {
  const classes = useStyles();

  const theme = useTheme();

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );

  const [dailySongs, setDailySongs] = React.useState<SongModel[]>([]);

  const { mutateAsync: songs, status: songsStatus } = useMutation(
    async () => {
      const songsResults = await call(
        SongsApi
      ).songsSubmissionDateSubmitDateStringGet({
        submitDateString: format(selectedDate, "yyyy-MM-dd"),
      });
      setDailySongs(songsResults);
    },
  );

  React.useEffect(() => {
    songs();
  }, [selectedDate]);

  return (
    <>
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
      </Grid>
      <Divider />
      {dailySongs
        .sort((a, b) => b.rating - a.rating)
        .map((song) => (
        <>
          <Divider />
          <Grid className={classes.paddedGrid} container>
            <Tooltip title={song.title.length > MAX_LIMITED_FIELD_LENGTH ? song.title : ""}>
              <Grid item xs={3}>
                {limitStringLength(song.title)}
              </Grid>
            </Tooltip>
            <Tooltip title={song.artist.length > MAX_LIMITED_FIELD_LENGTH ? song.artist : ""}>
              <Grid item xs={3}>
                {limitStringLength(song.artist)}
              </Grid>
            </Tooltip>
            <Grid item xs={2}>
              {song.genre.name}
            </Grid>
            <Grid item xs={2}>
              {song.user.username}
            </Grid>
            <Grid item xs={1}>
              {song.rating}
            </Grid>
          </Grid>
        </>
      ))}
    </>
  );
};

export default HomeDashboard;
