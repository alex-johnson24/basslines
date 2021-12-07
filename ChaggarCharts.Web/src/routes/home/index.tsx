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
  Pagination,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { call } from "../../data/callWrapper";
import { useMutation } from "react-query";
import { SongsApi, SongModel, UserModel } from "../../data/src";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import SongDialog from "./SongDialog";
import RatingPopover from "./RatingPopover";
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
  };
});

interface IHomeDashboardProps {
  userInfo: UserModel;
}

const SONG_PAGE_SIZE = 9;

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
  const [page, setPage] = React.useState<number>(1);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const allSongsRated =
    dailySongs.filter((f) => typeof f.rating !== "number").length === 0;

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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

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
    } else {
      setCurrentUserSong(null);
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
      <Container maxWidth="xl">
        {dailySongs
          .sort((a, b) => b.rating - a.rating)
          .slice((page - 1) * SONG_PAGE_SIZE, page * SONG_PAGE_SIZE)
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
            />
          ))}
        <Box sx={{ display: "flex", mt: "20px", alignItems: "center" }}>
          <Pagination
            sx={{ ml: "auto" }}
            count={Math.ceil(dailySongs?.length / SONG_PAGE_SIZE)}
            color="secondary"
            page={page}
            onChange={handlePageChange}
          />
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
                size="small"
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
