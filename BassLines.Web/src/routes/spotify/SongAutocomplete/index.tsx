import * as React from "react";
import TextField from "@mui/material/TextField";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SongModel, SpotifyApi, SongBaseWithImages } from "../../../data/src";
import { useSpotify } from "../../../contexts/spotifyContext";

const useStyles = makeStyles(() => {
  return {
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

interface ISongAutocompleteProps {
  setSong: (value: React.SetStateAction<SongModel>) => void;
  handleChange: (e: React.SyntheticEvent<Element, Event>, s: SongBaseWithImages) => void;
}

export default function SongAutoComplete({
  setSong,
  handleChange,
}: ISongAutocompleteProps) {
  const { callSpotify } = useSpotify();
  const classes = useStyles();

  const [query, setQuery] = React.useState("");
  const [songsOpen, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly SongBaseWithImages[]>([]);
  const [loading, setLoading] = React.useState(false);

  const getOptions = async (query: string) => {
    setLoading(true);
    try {
      if (!query) return undefined;
      const songs = await callSpotify(SpotifyApi).searchGet({ query });
      setOptions(
        songs.filter(
          (s, i, a) =>
            a.findIndex(
              ({ title, artist, link }) =>
                title === s.title && artist === s.artist
            ) === i
        )
      );
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleSongInputChange = (
    e: React.SyntheticEvent<Element, Event>,
    title: string
  ) => {
    setQuery(title);
    !title && setOptions([]);
    setSong((current) => ({ ...current, title }));
  };

  React.useEffect(() => {
    getOptions(query);
  }, [query]);

  return (
    <Autocomplete
      id="song-picker"
      freeSolo
      autoComplete
      autoHighlight
      open={songsOpen}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={handleSongInputChange}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) =>
        option.title === value.title && option.artist === value.artist
      }
      // @ts-ignore
      getOptionLabel={(option: SongBaseWithImages) => option.title || option || ""}
      options={options}
      fullWidth
      loading={loading}
      ListboxProps={{ className: classes.scrollbar }}
      renderOption={(props, song) => (
        <SongItem {...props} key={props.id} song={song} />
      )}
      renderInput={({ InputProps, ...params }) => (
        // @ts-ignore
        <TextField
          {...params}
          autoFocus
          margin="dense"
          label="Song Title"
          color="secondary"
          variant="standard"
          InputProps={{
            ...InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

export const SongItem = ({
  song,
  element,
  ...props
}: React.HTMLAttributes<HTMLElement> & { song: SongBaseWithImages, element?: React.ElementType }) => {
  const imgHeight = "65px";

  return (
    <Box
    component={element ?? "li"}
    key={props.id}
    sx={{
      height: imgHeight,
      display: "flex",
      width: "100%",
      p: 0,
    }}
    {...props}
    >
      <Box
        component="img"
        src={song.images?.sort((a, b) => a.height - b.height)?.[0]?.url}
        height={imgHeight}
        p="2px 8px 2px 0"
      />
      <Grid
        display="flex"
        flexDirection="column"
        width={`calc(100% - ${imgHeight})`}
      >
        <Typography noWrap children={song.title} />
        <Typography
          noWrap
          variant="caption"
          fontWeight={300}
          children={song.artist}
        />
      </Grid>
    </Box>
  );
};
