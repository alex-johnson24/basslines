import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import {
  Avatar,
  Box,
  ButtonBase,
  Container,
  Divider,
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
  UserRole,
  GenreModel,
} from "../../data/src";
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
import {
  DataGrid,
  GridColDef,
  GridSortModel
} from "@mui/x-data-grid";

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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "_",
      flex: 0.25,
      sortable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => {
        const firstName = (params.getValue(params.id, "user") as UserModel)
          .firstName;
        const lastName = (params.getValue(params.id, "user") as UserModel)
          .lastName;
        return (
          <Avatar
            sx={{
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
            }}
          >
            {allSongsRated
              ? `${firstName.split("")[0]}${lastName.split("")[0]}`
              : "??"}
          </Avatar>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "artist",
      headerName: "Artist",
      flex: 1,
    },
    {
      field: "genreName",
      headerName: "Genre",
      flex: 0.75,
      valueGetter: (params) => {
        return (params.getValue(params.id, "genre") as GenreModel).name;
      },
    },
    {
      field: "submitter",
      headerName: "Submitter",
      flex: 0.5,
      renderCell: (params) => {
        const firstName = (params.getValue(params.id, "user") as UserModel)
          .firstName;
        const lastName = (params.getValue(params.id, "user") as UserModel)
          .lastName;
        return <span>{allSongsRated ? `${firstName} ${lastName}` : "--"}</span>;
      },
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.5,
      renderCell: (params) => {
        const rating = params.getValue(params.id, "rating");
        return (
          <div style={{ display: "flex", width: "100%" }}>
            <span>{typeof rating === "number" ? rating : ""}</span>
            {(props.userInfo.role === UserRole.Administrator ||
              props.userInfo.role === UserRole.Reviewer) && (
              <IconButton
                onClick={(event) => {
                  setSongToRate(params.row);
                  openRatingPopover(event);
                }}
                size="small"
              >
                <RateReviewIcon />
              </IconButton>
            )}
            {params.row.user.username === props.userInfo?.username &&
            formattedDate === format(new Date(), "yyyy-MM-dd") &&
            typeof rating !== "number" ? (
              <IconButton
                style={{ marginLeft: "auto" }}
                size="small"
                onClick={() => setSongDialogOpen(true)}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
        );
      },
    },
  ];

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: "rating",
      sort: "desc",
    },
  ]);

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
      <Container maxWidth="xl">
        <DataGrid
          autoHeight
          classes={{ columnHeader: classes.header }}
          rows={dailySongs}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          componentsProps={{
            columnMenu: { background: theme.palette.secondary },
          }}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
        />
      </Container>
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
