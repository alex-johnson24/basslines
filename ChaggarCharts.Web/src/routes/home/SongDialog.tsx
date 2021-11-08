import * as React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Grid } from "@mui/material";
import { call } from "../../data/callWrapper";
import {
  GenresApi,
  GenreModel,
  UserModel,
  SongModel,
  SongsApi,
} from "../../data/src";
import { useMutation } from "react-query";

const useStyles = makeStyles((theme) => {
  return {
    centeredBox: {
      display: "flex",
      alignItems: "center",
    },
  };
});

interface ISongDialogProps {
  open: boolean;
  handleClose: () => void;
  userInfo: UserModel;
  userSong: SongModel;
}

const SongDialog = (props: ISongDialogProps) => {
  const classes = useStyles();

  const [genres, setGenres] = React.useState<GenreModel[]>([]);
  const [userSong, setUserSong] = React.useState<SongModel>();

  const { mutateAsync: getGenres, status: getGenresStatus } = useMutation(
    async () => {
      const genreResult = await call(GenresApi).genresGet();
      setGenres(genreResult);
    }
  );

  const submitSong = async () => {
    const songResult = userSong.id
      ? await call(SongsApi).songsPut({ songModel: userSong })
      : await call(SongsApi).songsPost({ songModel: userSong });
    if (songResult === null) {
      console.log("POST FAILED");
    } else {
      props.handleClose();
    }
  };

  React.useEffect(() => {
    if (props.open) {
      getGenres();
      if (props.userSong !== null) {
        setUserSong(props.userSong);
      } else {
        setUserSong({
          id: null,
          user: {
            id: props.userInfo?.id,
            username: props.userInfo?.username,
          },
          genre: {
            id: null,
            name: null,
          },
          title: "",
          artist: "",
        });
      }
    }
  }, [props.open]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={props.open}
      sx={{ minHeight: "300px" }}
    >
      <DialogTitle>Submit Daily Song</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} className={classes.centeredBox}>
            <TextField
              autoFocus
              margin="dense"
              label="Song Title"
              fullWidth
              variant="standard"
              value={userSong?.title}
              onChange={(e) => {
                const val = e.target?.value;
                setUserSong((current) => ({
                  ...current,
                  title: val || "",
                }));
              }}
            />
          </Grid>
          <Grid item xs={12} md={4} className={classes.centeredBox}>
            <TextField
              margin="dense"
              label="Artist"
              fullWidth
              variant="standard"
              value={userSong?.artist}
              onChange={(e) => {
                const val = e.target?.value;
                setUserSong((current) => ({
                  ...current,
                  artist: val || "",
                }));
              }}
            />
          </Grid>
          <Grid item xs={12} md={3} className={classes.centeredBox}>
            <Autocomplete
              value={userSong?.genre?.name}
              onChange={(e, newValue) =>
                setUserSong((current) => ({
                  ...current,
                  genre: {
                    ...current.genre,
                    name: newValue,
                    id:
                      genres[genres.map((m) => m.name).indexOf(newValue)]?.id ||
                      "",
                  },
                }))
              }
              options={genres.map((m) => m.name)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Genre"
                  variant="standard"
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={submitSong}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SongDialog;
