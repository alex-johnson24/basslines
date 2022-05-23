import {
  FavoriteBorderRounded,
  FavoriteRounded,
  ShuffleRounded,
} from "@material-ui/icons";
import {
  PauseRounded,
  PlayArrowRounded,
  ShuffleOnRounded,
  SkipNextRounded,
  SkipPreviousRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Popover,
  Slider,
  Typography,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { useSpotify } from "../../../contexts/spotifyContext";
import { SpotifyApi } from "../../../data/src";
import { convertSecondsToLengthString } from "../../../utils";
import { SongItem } from "../SongAutocomplete";
import SpotifyLogo from "../spotifyLogo";
import useSpotifyWebPlayer from "../WebPlayer";

//******AUTHORIZED FOR SPOTIFY******//
export default React.memo(function ControlPanel() {
  const {
    callSpotify,
    dispatch,
    state: { player, deviceId },
  } = useSpotify();
  const theme = useTheme();

  const { playerState, setPlayerState } = useSpotifyWebPlayer();

  const { position, duration, paused, context, track_window } =
    playerState || {};

  interface CurrentTrackInfo {
    id?: string;
    saved?: boolean;
  }
  const [currentTrack, setCurrentTrack] = React.useState<CurrentTrackInfo>();
  const [transferPromptOpen, setTransferPromptOpen] = React.useState(false);
  const [currentDevice, setCurrentDevice] = React.useState("");
  const [volumeSliderAnchor, setVolumeSliderAnchor] = React.useState(null);
  const [volumeSliderPosition, setVolumeSliderPosition] = React.useState(50);
  const [trackPosition, setTrackPosition] = React.useState(
    (position / duration) * 100
  );

  const transferPlayerState = async () => {
    await callSpotify(SpotifyApi)
      .playerPut({
        transferStateRequest: { deviceIds: [deviceId] },
      })
      .catch(console.warn);
  };

  const timer = React.useRef<NodeJS.Timer>(null);

  React.useEffect(() => {
    if (paused) {
      return undefined;
    }

    if (player) {
      const playing = playerState?.track_window?.current_track;
      if (playing.id !== currentTrack?.id) {
        (async () => {
          const likeArray = await callSpotify(SpotifyApi).checkSavedPost({
            requestBody: [playing?.id],
          });
          setCurrentTrack({
            id: playing.id,
            saved: likeArray?.[0]?.saved ?? false,
          });
        })();
      }

      timer.current = setTimeout(() => {
        player.getCurrentState().then(setPlayerState).catch(console.warn);
      }, 1000);
    }

    setTrackPosition((position / duration) * 100);

    return () => (timer.current ? clearTimeout(timer.current) : undefined);
  }, [playerState]);

  React.useEffect(() => {
    if (!deviceId) return undefined;

    dispatch({ type: "setDeviceId", payload: deviceId }),
      (async () => {
        const { devices } = await callSpotify(SpotifyApi).devicesGet();
        const anotherDeviceActive = devices.some(
          (d) => d.isActive && d.id !== deviceId && d.name !== "BassLines"
        );

        if (!anotherDeviceActive) {
          await transferPlayerState();
        } else {
          //ask user if they want to play here
          setCurrentDevice(devices.find((d) => d.isActive).name);
          setTransferPromptOpen(true);
        }
      })();
  }, [deviceId]);

  const disabled = paused == undefined;

  return !player ? (
    <></>
  ) : (
    <>
      <Box
        component="aside"
        style={{
          minHeight: true ? "75px" : "150px",
          position: "fixed",
          bottom: false ? "-100px" : "-4px",
          padding: "5px",
          width: "calc(100vw - 240px)",
          left: "240px",
          transition: ".1666s all ease-in-out",
          display: "flex",
          alignItems: "center",
          opacity: disabled ? 0 : 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,.9)"
              : "rgba(248,248,248,.9)",
        }}
      >
        {track_window ? (
          <SongItem
            style={{ width: "180px" }}
            song={{
              title: track_window.current_track?.name,
              artist: track_window.current_track?.artists?.[0]?.name,
              images: track_window.current_track?.album?.images,
            }}
            element="div"
          />
        ) : playerState?.loading ? (
          <CircularProgress size={28} />
        ) : (
          <Box width={"180px"} />
        )}
        <Grid width="fit-content">
          <IconButton
            disabled={disabled}
            sx={{ p: "2px 0 0" }}
            children={<SkipPreviousRounded />}
            onClick={async () => {
              position <= 2000
                ? await player.previousTrack()
                : await player.seek(0);
            }}
            disableRipple
          />
          <IconButton
            disabled={disabled}
            sx={{ p: "2px 0 0" }}
            children={paused ? <PlayArrowRounded /> : <PauseRounded />}
            onClick={async () => await player.togglePlay()}
            disableRipple
          />
          <IconButton
            disabled={disabled}
            sx={{ p: "2px 0 0" }}
            children={<SkipNextRounded />}
            onClick={async () => {
              await player.nextTrack();
            }}
            disableRipple
          />
        </Grid>
        <Grid
          sx={{
            padding: "0 16px",
            marginTop: "3px",
            width: "240px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Slider
            sx={{ width: "100%" }}
            color="secondary"
            size="small"
            disabled={disabled}
            onChange={(e, n: number) => setTrackPosition(n)}
            onChangeCommitted={(e, numOutOf100: number) => {
              setTrackPosition(numOutOf100);
              player.seek(duration * (numOutOf100 / 100));
            }}
            value={trackPosition || 0}
          />
          <Grid
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              fontSize: ".7rem",
            }}
          >
            <Typography
              paragraph={false}
              children={convertSecondsToLengthString(position / 1000)}
              fontSize={".7rem"}
            />
            <Typography
              paragraph={false}
              children={convertSecondsToLengthString(duration / 1000)}
              fontSize={".7rem"}
            />
          </Grid>
        </Grid>
        <Grid>
          <IconButton
            disableRipple
            sx={{ p: "2px 0 0" }}
            onClick={() =>
              callSpotify(SpotifyApi)
                .saveOrRemoveIdPut({
                  id: currentTrack?.id,
                  save: !currentTrack?.saved,
                })
                .then(setCurrentTrack)
                .catch(console.warn)
            }
            children={
              currentTrack?.saved ? (
                <FavoriteRounded
                  fontSize="small"
                  style={{ color: theme.palette.secondary.main }}
                />
              ) : (
                <FavoriteBorderRounded fontSize="small" />
              )
            }
          />
          <IconButton
            disabled={disabled}
            sx={{ p: "2px 0 0" }}
            children={<VolumeUpRounded />}
            onClick={(e) => {
              e.persist();
              setVolumeSliderAnchor(e.target);
            }}
            disableRipple
          />
          <IconButton
            disableRipple
            sx={{ p: "2px 0 0" }}
            onClick={() =>
              callSpotify(SpotifyApi)
                .shufflePut({ shuffle: !playerState?.shuffle })
                .catch(console.warn)
            }
            children={
              <ShuffleRounded
                style={{
                  color: playerState?.shuffle
                    ? theme.palette.secondary.main
                    : "inherit",
                }}
              />
            }
          />
        </Grid>
        <Popover
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          PaperProps={{
            sx: { height: "120px", padding: "18px 4px", overflow: "hidden" },
          }}
          open={Boolean(volumeSliderAnchor)}
          onClose={() => setVolumeSliderAnchor(null)}
          anchorEl={volumeSliderAnchor}
          children={
            <Slider
              size="small"
              onChange={(e, numOutOf100: number) => {
                player.setVolume(numOutOf100 / 100);
                setVolumeSliderPosition(numOutOf100);
              }}
              color="secondary"
              onChangeCommitted={() => setVolumeSliderAnchor(null)}
              orientation="vertical"
              value={volumeSliderPosition}
              aria-label="volume"
              sx={{
                '& input[type="range"]': {
                  WebkitAppearance: "slider-vertical",
                },
              }}
            />
          }
        />
      </Box>
      <TransferStatePrompt
        open={transferPromptOpen}
        currentDevice={currentDevice}
        onClose={() => setTransferPromptOpen(false)}
        onAccept={transferPlayerState}
      />
    </>
  );
});

interface ITransferStatePromptProps {
  open?: boolean;
  currentDevice?: string;
  onClose: VoidFunction;
  onAccept: VoidFunction;
}
const TransferStatePrompt = ({
  open,
  currentDevice,
  onClose,
  onAccept,
}: ITransferStatePromptProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{ elevation: 1, sx: { borderRadius: "10px" } }}
    >
      <Grid
        p={6}
        container
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <SpotifyLogo
          role="img"
          height="56px"
          fill={theme.palette.success.main}
          style={{ marginBottom: 14 }}
        />
        <Typography
          variant="caption"
          maxWidth={200}
          textAlign="center"
          children={
            <>
              It looks like you're already listening on{" "}
              <strong>${currentDevice}</strong>!
            </>
          }
        />
        <Button
          variant="contained"
          color="success"
          children={"Play on BassLines"}
          style={{ margin: "14px 0" }}
          onClick={() => {
            onAccept();
            onClose();
          }}
        />
        <Button
          variant="text"
          children={`Keep playing on ${currentDevice}`}
          sx={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.palette.text.primary,
          }}
          onClick={onClose}
        />
      </Grid>
    </Dialog>
  );
};
