import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { useMutation } from "react-query";
import {
  CreatePlaylistRequest,
  PlaylistTrack,
  SpotifyApi,
  SpotifyPlaylist,
} from "../../../data/src";
import { format } from "date-fns";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { convertSecondsToLengthString } from "../../../utils";
import { useSpotify } from "../../../contexts/spotifyContext";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import MoreVertRounded from "@mui/icons-material/MoreVertRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
interface ICreatePlaylistProps {
  selected: number;
  open: boolean;
  request: CreatePlaylistRequest;
  handleClose: VoidFunction;
  handleCreate: VoidFunction;
  setRequest: React.Dispatch<React.SetStateAction<CreatePlaylistRequest>>;
}

export const CreatePlaylistDialog = ({
  selected,
  open,
  request,
  handleClose,
  handleCreate,
  setRequest,
}: ICreatePlaylistProps) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`${selected.toLocaleString(
        "en-US"
      )} tracks selected`}</DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <DialogContentText>
            Create a custom BassLines playlist. Your BassLines playlists will
            show here, and also on your Spotify account!
          </DialogContentText>
          <TextField
            autoFocus
            sx={{ width: "120px" }}
            value={request.name}
            margin="dense"
            id="name"
            label="Playlist Name"
            type="text"
            variant="standard"
            onChange={({ target: { value: name } }) =>
              setRequest((r) => ({ ...r, name }))
            }
          />
          <TextField
            value={request.description}
            margin="dense"
            id="name"
            label="Description"
            type="text"
            variant="outlined"
            multiline
            rows={3}
            onChange={({ target: { value: description } }) =>
              setRequest((r) => ({ ...r, description }))
            }
          />
          <FormControlLabel
            label="Public"
            control={
              <Checkbox
                value={request._public}
                onChange={(e, checked) =>
                  setRequest((r) => ({ ...r, _public: checked }))
                }
              />
            }
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const Playlist = ({
  id,
  name,
  owner,
  type,
  images,
  startOpen,
  refetch,
  ...p
}: SpotifyPlaylist & { refetch: VoidFunction; startOpen: boolean }) => {
  const { callSpotify } = useSpotify();
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(startOpen);
  const [hasMore, setHasMore] = React.useState<boolean>();
  const [focused, setFocused] = React.useState(-1);
  const [tracks, setTracks] = React.useState<
    (PlaylistTrack & { saved?: boolean })[]
  >([]);
  const theme = useTheme();
  const classes = useStyles(theme);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const actionsOpen = Boolean(anchorEl);
  const handleActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    focus();
  };
  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handlePlay = () =>
    callSpotify(SpotifyApi).apiSpotifyPlayPut({
      playContextRequest: { contextUri: `spotify:playlist:${id}` },
    });

  const options = [
    {
      label: "Play",
      onClick: handlePlay,
    },
    {
      label: "Copy link",
      onClick: () =>
        window.navigator.clipboard.writeText(p.externalUrls.spotify),
    },
    {
      label: (
        <Tooltip title="Playlist will remain available in your Spotify account">
          <div>Remove from BassLines</div>
        </Tooltip>
      ),
      onClick: () =>
        callSpotify(SpotifyApi)
          .apiSpotifyUpdatePlaylistPut({
            createPlaylistRequest: {
              ...p,
              name: name.replace("@basslines:", "").trim(), // remove playlist from basslines by removing basslines prefix
              id,
            },
          })
          .then(refetch),
    },
  ];

  const { mutateAsync: getPlaylistTracks, isLoading } = useMutation(() =>
    callSpotify(SpotifyApi)
      .apiSpotifyPlaylistTracksPlaylistIdGet({ page, playlistId: id })
      .then((res) => {
        setTracks((c) => {
          const aggregate = [...c, ...res.items];
          setHasMore(res.total > aggregate.length);
          return aggregate;
        });
        setPage((p) => p + 1);
      })
      .catch(async (e) => {
        console.warn(await e.json());
      })
  );

  React.useEffect(() => {
    page === 0 && getPlaylistTracks();
  }, [page]);

  const checkStartIndexRef = React.useRef(0);

  React.useEffect(() => {
    if (!tracks.length) return undefined;
    callSpotify(SpotifyApi)
      .apiSpotifyCheckSavedPost({
        requestBody: tracks
          .slice(checkStartIndexRef.current)
          .map((t) => t.track.id),
      })
      .then((res) =>
        setTracks((c) => {
          checkStartIndexRef.current = c.length;
          return c.map((track) => ({
            ...track,
            saved: (res.find((t) => t.id === track.track.id) ?? track).saved,
          }));
        })
      );
  }, [tracks.length]);

  const toggleSaved = (id: string, save: boolean) =>
    callSpotify(SpotifyApi)
      .apiSpotifySaveOrRemoveIdPut({ id, save })
      .then(() =>
        setTracks((c) =>
          c.map((track) => ({
            ...track,
            saved: track.track.id === id ? save : track.saved,
          }))
        )
      )
      .catch(console.warn);

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      pt={open ? 4 : 2}
    >
      <Grid
        container
        alignItems="center"
        direction="row"
        mt={open ? 3 : 1.5}
        width="fit-content"
      >
        <IconButton
          disableRipple
          sx={{ width: "fit-content", alignSelf: "cener" }}
          onClick={handlePlay}
          children={
            <PlayArrowRounded
              sx={{ fontSize: open ? "100px" : "40px" }}
              htmlColor={theme.palette.secondary.main}
            />
          }
        />
        <Box
          m="0 8px"
          component="img"
          src={images?.[0]?.url ?? "img/speaker.svg"}
          height={open ? "120px" : "50px"}
          width={open ? "120px" : "50px"}
        />

        <Grid>
          <Typography
            children={name.replace("@basslines:", "").trim()}
            variant={open ? "h4" : "h6"}
          />
          {open && (
            <>
              {!!p.description && (
                <Typography
                  variant="body2"
                  component="div"
                  children={p.description}
                />
              )}
              <Typography
                variant="caption"
                children={`${p.tracks.total.toLocaleString("en-US")} Songs`}
              />
              <IconButton
                className="icon"
                size="small"
                disableRipple
                sx={{ alignSelf: "center" }}
                children={<MoreVertRounded fontSize="small" />}
                aria-label="more"
                id="long-button"
                aria-controls={actionsOpen ? "long-menu" : undefined}
                aria-expanded={actionsOpen ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleActionsClick}
              />
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={actionsOpen}
                onClose={handleActionsClose}
              >
                {options.map(({ label, onClick }, i) => (
                  <MenuItem
                    key={i}
                    onClick={(e) => {
                      onClick();
                      handleActionsClose();
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Grid>
      </Grid>
      <ToggleSwitch open={open} toggle={() => setOpen((o) => !o)} />
      <Collapse
        mountOnEnter
        unmountOnExit
        in={open}
        sx={{ width: "100%", pt: open ? 3 : 0 }}
      >
        <PlaylistHeader id={name} />
        <Grid
          container
          flexWrap="nowrap"
          direction="column"
          overflow="auto"
          width="100%"
          className={classes.slimScrollbar}
          maxHeight="500px"
          id={`scroll-container-${id}`}
        >
          <InfiniteScroll
            hasMore={hasMore}
            next={() => {
              if (isLoading) return;
              getPlaylistTracks();
            }}
            dataLength={tracks.length}
            loader="Loading..."
            scrollableTarget={`scroll-container-${id}`}
            scrollThreshold="200px"
          >
            {tracks.map((pt, i) => (
              <PlaylistTrack
                playlistId={id}
                focus={() => setFocused(i)}
                clearFocus={() => setFocused(-1)}
                focused={i === focused}
                refresh={() => {
                  setPage(0);
                }}
                {...pt}
                index={i}
                key={i}
                toggleSaved={toggleSaved}
              />
            ))}
          </InfiniteScroll>
        </Grid>
      </Collapse>
    </Grid>
  );
};

const PlaylistTrack = ({
  track: { name, album, artists, id, ...track },
  index,
  saved,
  focused,
  playlistId,
  refresh,
  focus,
  clearFocus,
  toggleSaved,
  ...pt
}: PlaylistTrack & {
  index: number;
  saved?: boolean;
  focused?: boolean;
  playlistId: string;
  refresh: VoidFunction;
  focus: VoidFunction;
  clearFocus: VoidFunction;
  toggleSaved: (id: string, save: boolean) => void;
}) => {
  const { callSpotify } = useSpotify();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    focus();
  };
  const handleActionsClose = () => {
    setAnchorEl(null);
    clearFocus();
  };

  const options = [
    {
      label: "Remove from playlist",
      onClick: () =>
        callSpotify(SpotifyApi)
          .apiSpotifyPlaylistTracksPlaylistIdDelete({
            playlistId,
            trackUri: track.uri,
          })
          .then(refresh),
    },
    {
      label: "Add to queue",
      onClick: () =>
        callSpotify(SpotifyApi).apiSpotifyAddToQueueSpotifyIdPost({
          spotifyId: id,
        }),
    },
    {
      label: `Play ${artists[0].name} radio`,
      onClick: () =>
        callSpotify(SpotifyApi).apiSpotifyPlayPut({
          playContextRequest: { contextUri: artists[0].uri },
        }),
    },
    {
      label: "Play album",
      onClick: () =>
        callSpotify(SpotifyApi).apiSpotifyPlayPut({
          playContextRequest: { contextUri: album.uri },
        }),
    },
    {
      label: "Copy song link",
      onClick: () =>
        window.navigator.clipboard.writeText(track.externalUrls.spotify),
    },
  ];

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      id={`track-${name}`}
      sx={(theme) =>
        focused
          ? {
              backgroundColor: theme.palette.grey[isDarkMode ? 800 : 200],
              "& .track-number": { visibility: "hidden" },
              "& .icon": { visibility: "visible" },
            }
          : {
              "&.icon": { visibility: "hidden" },
              "&:hover": {
                backgroundColor: theme.palette.grey[isDarkMode ? 900 : 100],
                "& .icon": { visibility: "visible" },
                "& .track-number": { visibility: "hidden" },
              },
            }
      }
    >
      <Grid
        item
        xs={7}
        md={4}
        xl={5}
        container
        position="relative"
        direction="row"
        alignItems="center"
        flexWrap="nowrap"
        id="track-and-artist"
      >
        <Typography
          className="track-number"
          component="span"
          children={index + 1}
          textAlign="center"
          width="35px"
        />
        <IconButton
          className="icon"
          sx={{
            position: "absolute",
            visibility: "hidden",
            alignSelf: "center",
          }}
          onClick={() =>
            callSpotify(SpotifyApi).apiSpotifyPlayPut({
              playContextRequest: { uris: [track.uri] },
            })
          }
          children={
            <PlayArrowRounded
              sx={(theme) => ({
                color: theme.palette.secondary.main,
              })}
            />
          }
        />
        <Box
          m="0 8px"
          component="img"
          src={album.images[0].url ?? "img/speaker.svg"}
          height="40px"
          width="40px"
        />
        <Grid
          container
          item
          m="0 8px"
          justifyContent="center"
          direction="column"
          width="calc(100% - 110px)"
        >
          <Link
            href={track.externalUrls?.spotify || "#"}
            variant="h6"
            fontSize="15px"
            children={name}
            target="_blank"
            underline="hover"
            noWrap
            width="100%"
            color="text.primary"
          />
          <Box component="span" sx={{ position: "relative", top: "-5px" }}>
            {artists.map(({ name, externalUrls }, i, a) => (
              <React.Fragment key={i}>
                <Link
                  noWrap
                  underline="hover"
                  target="_blank"
                  children={name}
                  href={externalUrls.spotify || "#"}
                  variant="caption"
                  color="text.secondary"
                />
                {i !== a.length - 1 && ", "}
              </React.Fragment>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Grid
        item
        xs={false}
        md={3}
        xl={2}
        container
        direction="row"
        alignItems="center"
        id="album"
      >
        <Link
          children={
            <>
              <strong>{album.name}</strong>{" "}
              <Typography variant="caption">
                ({format(new Date(album.releaseDate), "yyyy")})
              </Typography>
            </>
          }
          href={album.externalUrls.spotify || "#"}
          variant="body2"
          noWrap
          target="_blank"
          color="text.secondary"
          underline="hover"
        />
      </Grid>
      <Grid
        item
        xs={false}
        md={3}
        xl={2}
        container
        direction="row"
        alignItems="center"
        id="date-added"
      >
        <Typography
          variant="body2"
          noWrap
          color="text.secondary"
          children={format(pt.addedAt, "M/d/yyyy")}
        />
      </Grid>
      <Grid
        item
        xs={5}
        xl={3}
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        id="length-and-actions"
      >
        <IconButton
          className="icon"
          disableRipple
          onClick={() => toggleSaved(id, !saved)}
          sx={{
            "& svg": { fontSize: 20 },
            visibility: saved ? "visible" : "hidden",
            alignSelf: "center",
          }}
          children={
            saved ? (
              <FavoriteRounded htmlColor={theme.palette.secondary.main} />
            ) : (
              <FavoriteBorderRounded />
            )
          }
        />
        <Typography
          variant="body2"
          color="text.secondary"
          m="0 18px"
          children={convertSecondsToLengthString(track.durationMs / 1000)}
        />
        <IconButton
          className="icon"
          disableRipple
          sx={{
            "& svg": { fontSize: 20 },
            visibility: "hidden",
            alignSelf: "center",
          }}
          children={<MoreVertRounded />}
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleActionsClick}
        />
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleActionsClose}
        >
          {options.map(({ label, onClick }) => (
            <MenuItem
              key={label}
              onClick={(e) => {
                onClick();
                handleActionsClose();
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Grid>
  );
};

const PlaylistHeader = ({ id }: SpotifyPlaylist) => (
  <Grid container direction="row" alignItems="center" id={id}>
    <Grid item xs={7} md={4} xl={5} id="track-and-artist-header">
      <Typography
        children="Track"
        variant="overline"
        sx={{ fontSize: 13, ml: 4 }}
      />
    </Grid>
    <Grid
      item
      xs={false}
      md={3}
      xl={2}
      container
      direction="row"
      alignItems="center"
      id="album-header"
    >
      <Typography children="Album" variant="overline" sx={{ fontSize: 13 }} />
    </Grid>
    <Grid
      item
      xs={false}
      md={3}
      xl={2}
      container
      direction="row"
      alignItems="center"
      id="date-added-header"
    >
      <Typography
        children="Date Added"
        variant="overline"
        sx={{ fontSize: 13 }}
      />
    </Grid>
    <Grid
      item
      xs={5}
      xl={3}
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      id="length-and-actions-header"
    >
      <Typography children="Length" variant="overline" sx={{ fontSize: 13 }} />
    </Grid>
    <Divider sx={{ width: "100%" }} />
  </Grid>
);

interface IToggleProps {
  open: boolean;
  toggle: VoidFunction;
}
export const ToggleSwitch = ({ open, toggle }: IToggleProps) => {
  return (
    <IconButton onClick={toggle} sx={{ alignSelf: "center" }}>
      {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
    </IconButton>
  );
};

const useStyles = makeStyles(() => {
  return {
    slimScrollbar: {
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
