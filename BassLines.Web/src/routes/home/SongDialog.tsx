import * as React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import { call } from "../../data/callWrapper";
import {
  GenresApi,
  GenreModel,
  UserModel,
  SongModel,
  SongsApi,
  SongBaseWithImages,
} from "../../data/src";
import { useMutation } from "react-query";
import { useSpotify } from "../../contexts/spotifyContext";
import SongAutoComplete from "../spotify/SongAutocomplete";

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

const SongDialog = React.memo((props: ISongDialogProps) => {
  const {
    state: { authorized },
  } = useSpotify();
  const classes = useStyles();

  const [genres, setGenres] = React.useState<GenreModel[]>([]);
  const [userSong, setUserSong] = React.useState<SongModel>();

  const { mutateAsync: getGenres, status: getGenresStatus } = useMutation(
    async () => {
      const genreResult = await call(GenresApi).apiGenresGet();
      setGenres(genreResult);
    }
  );

  const { mutateAsync: updateSong, status: getUpdateStatus } = useMutation(
    async () => {
      call(SongsApi).apiSongsPut({ songModel: userSong });
    }
  );

  const { mutateAsync: submitSong, status: getSubmitStatus } = useMutation(
    async () => {
      await call(SongsApi).apiSongsPost({ songModel: userSong });
    }
  );

  const submitData = async () => {
    const songResult = userSong.id ? await updateSong() : await submitSong();
    if (songResult === null) {
      console.log("POST FAILED");
    } else {
      props.handleClose();
    }
  };

  React.useEffect(() => {
    if (props.open) {
      getGenres();
      if (props.userSong?.id) {
        setUserSong(props.userSong);
      } else {
        setUserSong({
          id: null,
          user: {
            ...props.userInfo,
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

  const genreRef = React.useRef<HTMLInputElement>(null);
  const handleSongChange = (
    e: React.SyntheticEvent<Element, Event>,
    { title, artist, link }: SongBaseWithImages
  ) => {
    setUserSong((current) => ({ ...current, title, artist, link }));
    genreRef.current.focus();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={props.open}
      sx={{ minHeight: "300px", color: "secondary.main" }}
    >
      <DialogTitle>Submit Daily Song</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} className={classes.centeredBox}>
            {authorized ? (
              <SongAutoComplete
                setSong={setUserSong}
                handleChange={handleSongChange}
              />
            ) : (
              <TextField
                autoFocus
                margin="dense"
                label="Song Title"
                color="secondary"
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
            )}
          </Grid>
          <Grid item xs={12} md={4} className={classes.centeredBox}>
            <TextField
              margin="dense"
              label="Artist"
              fullWidth
              color="secondary"
              variant="standard"
              value={userSong?.artist ?? ""}
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
              color="secondary"
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
              options={genres.map((m) => m.name).sort()}
              sx={{ width: 300 }}
              renderInput={(params) => (
                // @ts-ignore
                <TextField
                  {...params}
                  inputRef={genreRef}
                  fullWidth
                  color="secondary"
                  label="Genre"
                  variant="standard"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={8} className={classes.centeredBox}>
            <TextField
              margin="dense"
              label="Link (Spotify, YouTube, etc)"
              fullWidth
              variant="standard"
              color="secondary"
              value={userSong?.link ?? ""}
              onChange={(e) => {
                const val = e.target?.value;
                setUserSong((current) => ({
                  ...current,
                  link: val || "",
                }));
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={submitData}
          variant="contained"
          color="primary"
          disabled={
            getSubmitStatus === "loading" || getUpdateStatus === "loading"
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default SongDialog;
