import {
  PauseRounded,
  PlayArrowRounded,
  SkipNextRounded,
  SkipPreviousRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Popover,
  Slider,
} from "@mui/material";
import * as React from "react";
import { useSpotify } from "../../../contexts/spotifyContext";
import { SpotifyApi } from "../../../data/src";
import { SongItem } from "../SongAutocomplete";
import useSpotifyWebPlayer from "../WebPlayer";

//******AUTHORIZED FOR SPOTIFY******//
export default React.memo(function ControlPanel() {
  const { callSpotify, dispatch } = useSpotify();

  const { player, playerState, setPlayerState, deviceId } =
    useSpotifyWebPlayer();

  const { position, duration, paused, context, track_window } =
    playerState || {};

  const [volumeSliderAnchor, setVolumeSliderAnchor] = React.useState(null);
  const [volumeSliderPosition, setVolumeSliderPosition] = React.useState(50);
  const [trackPosition, setTrackPosition] = React.useState(
    (position / duration) * 100
  );

  const timer = React.useRef<NodeJS.Timer>(null);

  React.useEffect(() => {
    if (paused) {
      return undefined;
    }

    if (player) {
      timer.current = setTimeout(() => {
        player.getCurrentState()?.then(setPlayerState);
      }, 1000);
    }

    setTrackPosition((position / duration) * 100);

    return () => (timer.current ? clearTimeout(timer.current) : undefined);
  }, [playerState]);

  React.useEffect(
    () => dispatch({ type: "setDeviceId", payload: deviceId }),
    [deviceId]
  );

  React.useEffect(() => {
    if (!deviceId) return undefined;

    (async () => {
      const { devices } = await callSpotify(SpotifyApi).devicesGet();
      const anotherDeviceActive = devices.some(
        (d) => d.isActive && d.id !== deviceId
      );

      console.log(devices, anotherDeviceActive);

      if (!anotherDeviceActive) {
        await callSpotify(SpotifyApi)
          .playerPut({
            transferStateRequest: { deviceIds: [deviceId] },
          })
          .catch(console.warn);
      } else {
        //ask user if they want to play here?
      }
    })();
  }, [deviceId]);

  React.useEffect(() => {
    if (!player) return undefined;
    // dispatch({ type: "setWebPlayer", payload: player });
  }, [player]);

  const disabled = paused == undefined;

  return !player ? (
    <></>
  ) : (
    <Grid
      style={{
        // background: (theme) => theme.palette.success.main + 70,
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
      <Grid sx={{ padding: "0 16px", marginTop: "3px" }}>
        <Slider
          sx={{ width: "240px" }}
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
      </Grid>
      <Grid>
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
          sx: { height: "170px", padding: "18px 4px", overflow: "hidden" },
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
    </Grid>
  );
});
