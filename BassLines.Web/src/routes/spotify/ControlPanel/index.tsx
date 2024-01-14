import * as React from "react";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import ShuffleRounded from "@mui/icons-material/ShuffleRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Slider, { SliderThumb } from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useSpotify } from "../../../contexts/spotifyContext";
import { Device, SpotifyApi, SpotifyPlaybackState } from "../../../data/src";
import { convertSecondsToLengthString } from "../../../utils";
import { SongItem } from "../SongAutocomplete";
import SpotifyLogo from "../spotifyLogo";
import useSpotifyWebPlayer from "../WebPlayer";
import { SvgIconProps, Theme, Tooltip, useMediaQuery } from "@mui/material";

//******AUTHORIZED FOR SPOTIFY******//
export default React.memo(function ControlPanel() {
  const {
    callSpotify,
    dispatch,
    state: { player },
  } = useSpotify();
  const theme = useTheme();

  const { playerState, setPlayerState, deviceId } = useSpotifyWebPlayer();

  const { position, duration, paused, context, track_window } =
    playerState || {};

  interface CurrentTrackInfo {
    id?: string;
    saved?: boolean;
  }

  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const [playbackState, setPlaybackState] =
    React.useState<SpotifyPlaybackState>();
  const [currentTrack, setCurrentTrack] = React.useState<CurrentTrackInfo>();
  const [transferPromptOpen, setTransferPromptOpen] = React.useState(false);
  const [currentDevice, setCurrentDevice] = React.useState("");
  const [volumeSliderAnchor, setVolumeSliderAnchor] = React.useState(null);
  const [volumeSliderPosition, setVolumeSliderPosition] = React.useState(50);
  const [transferStateMenuOpen, setTransferStateMenuOpen] =
    React.useState(false);
  const [trackPosition, setTrackPosition] = React.useState(
    (position / duration) * 100
  );

  const transferPlayerStateHere = async (cb?: () => void | Promise<void>) => {
    await callSpotify(SpotifyApi)
      .apiSpotifyPlayerPut({
        transferStateRequest: { deviceIds: [deviceId] },
      })
      .catch(console.warn);
    if (cb) await cb();
  };

  const timer = React.useRef<NodeJS.Timer>(null);
  const interval = React.useRef<NodeJS.Timer>(null);

  const hydratePlaybackState = () => {
    callSpotify(SpotifyApi)
      .apiSpotifyPlaybackStateGet()
      .then(setPlaybackState)
      .catch(console.warn);
  };

  const hydratePlayerState = () =>
    player.getCurrentState().then(setPlayerState).catch(console.warn);

  React.useEffect(() => {
    if (player) {
      const playing =
        playerState?.track_window?.current_track ?? playbackState?.item;

      if (playing && playing?.id !== currentTrack?.id) {
        (async () => {
          const likeArray = await callSpotify(
            SpotifyApi
          ).apiSpotifyCheckSavedPost({
            requestBody: [playing?.id],
          });
          setCurrentTrack({
            id: playing.id,
            saved: likeArray?.[0]?.saved ?? false,
          });
        })();
      }

      if (paused) {
        return undefined;
      }

      timer.current = setTimeout(hydratePlayerState, 1000);
    }

    setTrackPosition((position / duration) * 100);

    return () => (timer.current ? clearTimeout(timer.current) : undefined);
  }, [playerState, playbackState]);

  React.useEffect(() => {
    if (player && !playerState) {
      hydratePlayerState();
    }
  }, [player, playerState]);

  React.useEffect(() => {
    hydratePlaybackState();

    interval.current = setInterval(() => {
      hydratePlaybackState();
    }, 15000);

    return () => clearInterval(interval.current);
  }, []);

  React.useEffect(() => {
    if (!deviceId) return undefined;

    dispatch({ type: "setDeviceId", payload: deviceId }),
      (async () => {
        const { devices } = await callSpotify(
          SpotifyApi
        ).apiSpotifyDevicesGet();
        const anotherDeviceActive = devices.some(
          (d) => d.isActive && d.id !== deviceId && d.name !== "BassLines"
        );

        setVolumeSliderPosition(
          devices?.find((d) => d.name === "BassLines")?.volumePercent || 50
        );

        if (!anotherDeviceActive) {
          await transferPlayerStateHere();
        } else {
          //ask user if they want to play here
          setCurrentDevice(devices.find((d) => d.isActive).name);
          setTransferPromptOpen(true);
        }
      })();
  }, [deviceId]);

  const playingExternally =
    paused == undefined || playerState?.track_window?.current_track == null;

  const shuffling =
    (playingExternally && playbackState?.shuffleState) || playerState?.shuffle;

  const controlIconProps: SvgIconProps = {
    fontSize: isSmall ? "large" : "inherit",
  };

  const prevButton = () => (
    <IconButton
      disabled={
        !playingExternally &&
        !playerState?.track_window?.previous_tracks?.length
      }
      sx={{ p: "2px 0 0" }}
      children={<SkipPreviousRounded {...controlIconProps} />}
      onClick={async () => {
        playingExternally
          ? callSpotify(SpotifyApi)
              .apiSpotifyNextOrPreviousNextOrPreviousPost({
                nextOrPrevious: "previous",
              })
              .then(() => hydratePlaybackState())
              .catch(console.warn)
          : position <= 2000
          ? await player.previousTrack()
          : await player.seek(0);
      }}
      disableRipple
    />
  );
  const playButton = () => (
    <IconButton
      disabled={playingExternally && !playbackState}
      sx={{ p: "2px 0 0" }}
      children={
        !playingExternally ? (
          paused ? (
            <PlayArrowRounded fontSize="large" />
          ) : (
            <PauseRounded fontSize="large" />
          )
        ) : playbackState?.isPlaying ? (
          <PauseRounded fontSize="large" />
        ) : (
          <PlayArrowRounded fontSize="large" />
        )
      }
      onClick={async () =>
        !playingExternally
          ? await player.togglePlay()
          : playbackState.isPlaying
          ? callSpotify(SpotifyApi)
              .apiSpotifyPausePut()
              .then(() => hydratePlaybackState())
              .catch(console.warn)
          : callSpotify(SpotifyApi)
              .apiSpotifyPlayPut({ playContextRequest: {} })
              .then(() => hydratePlaybackState())
              .catch(console.warn)
      }
      disableRipple
    />
  );

  const nextButton = () => (
    <IconButton
      disabled={
        !playingExternally && !playerState?.track_window?.next_tracks?.length
      }
      sx={{ p: "2px 0 0" }}
      children={<SkipNextRounded {...controlIconProps} />}
      onClick={async () => {
        playingExternally
          ? callSpotify(SpotifyApi)
              .apiSpotifyNextOrPreviousNextOrPreviousPost({
                nextOrPrevious: "next",
              })
              .then(() => hydratePlaybackState())
              .catch(console.warn)
          : await player.nextTrack();
      }}
      disableRipple
    />
  );

  return !player ? (
    <></>
  ) : (
    <>
      <Grid
        component="aside"
        container
        style={{
          minHeight: "75px",
          position: "fixed",
          bottom: "-4px",
          padding: "5px",
          width: isSmall ? "100vw" : "calc(100vw - 240px)",
          left: isSmall ? 0 : "240px",
          transition: ".1666s all ease-in-out",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,.9)"
              : "rgba(248,248,248,.9)",
        }}
      >
        <Grid item xs={12} md={4}>
          {track_window || playbackState ? (
            <Grid container justifyContent="space-between">
              <SongItem
                icon={
                  currentTrack && (
                    <IconButton
                      disableRipple
                      sx={{ p: "2px 0 0" }}
                      onClick={() =>
                        callSpotify(SpotifyApi)
                          .apiSpotifySaveOrRemoveIdPut({
                            id: currentTrack?.id,
                            save: !currentTrack?.saved,
                          })
                          .then(setCurrentTrack)
                          .catch(console.warn)
                      }
                      children={
                        currentTrack?.saved ? (
                          <Tooltip title="Remove from your Spotify library">
                            <FavoriteRounded
                              fontSize="small"
                              style={{ color: theme.palette.secondary.main }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Add to your Spotify library">
                            <FavoriteBorderRounded fontSize="small" />
                          </Tooltip>
                        )
                      }
                    />
                  )
                }
                style={{
                  width: "fit-content",
                  marginRight: "8px",
                  maxWidth: "100%",
                }}
                song={{
                  title: (track_window?.current_track ?? playbackState?.item)
                    ?.name,
                  artist: (track_window?.current_track ?? playbackState?.item)
                    ?.artists?.[0]?.name,
                  images: (track_window?.current_track ?? playbackState?.item)
                    ?.album?.images,
                }}
                element="div"
              />
              {isSmall && (
                <Grid item container sx={{ width: "fit-content" }}>
                  {prevButton()}
                  {playButton()}
                  {nextButton()}
                </Grid>
              )}
            </Grid>
          ) : playerState?.loading ? (
            <CircularProgress size={28} />
          ) : (
            <Box width={"180px"} />
          )}

          {isSmall && (
            <Grid container>
              <Slider
                sx={{ flexGrow: 1, padding: "6px 0 0" }}
                color="secondary"
                size="medium"
                disabled={playingExternally}
                components={{
                  Thumb: (props) => (
                    <SliderThumb {...props} sx={{ display: "none" }} />
                  ),
                }}
                onChange={(e, n: number) => setTrackPosition(n)}
                onChangeCommitted={(e, numOutOf100: number) => {
                  setTrackPosition(numOutOf100);
                  player.seek(duration * (numOutOf100 / 100));
                }}
                value={trackPosition || 0}
              />
            </Grid>
          )}
        </Grid>

        {!isSmall && (
          <Grid
            container
            item
            xs={12}
            md={4}
            sx={{
              padding: "0 16px",
              marginTop: "3px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container justifyContent="center">
              {prevButton()}
              {playButton()}
              {nextButton()}
            </Grid>
            <Grid container alignItems="center" wrap="nowrap">
              <Typography
                paragraph={false}
                children={
                  playingExternally
                    ? ""
                    : convertSecondsToLengthString(position / 1000)
                }
                fontSize={".7rem"}
                mr={1.5}
              />
              <Slider
                sx={{ flexGrow: 1 }}
                color="secondary"
                size="small"
                disabled={playingExternally}
                onChange={(e, n: number) => setTrackPosition(n)}
                onChangeCommitted={(e, numOutOf100: number) => {
                  setTrackPosition(numOutOf100);
                  player.seek(duration * (numOutOf100 / 100));
                }}
                value={trackPosition || 0}
              />
              <Typography
                paragraph={false}
                children={
                  playingExternally
                    ? ""
                    : convertSecondsToLengthString(duration / 1000)
                }
                fontSize={".7rem"}
                ml={1.5}
              />
            </Grid>
          </Grid>
        )}

        {!isSmall && (
          <Grid
            container
            justifyContent="flex-end"
            item
            md={4}
            sx={{ "& button": { margin: "0 3px" } }}
          >
            <IconButton
              disabled={playingExternally}
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
              disabled={playbackState?.shuffleState == undefined}
              sx={{ p: "2px 0 0" }}
              onClick={() =>
                callSpotify(SpotifyApi)
                  .apiSpotifyShufflePut({
                    shuffle: !shuffling,
                  })
                  .then(() => hydratePlaybackState())
                  .catch(console.warn)
              }
              children={
                <ShuffleRounded
                  style={{
                    color: shuffling ? theme.palette.secondary.main : "inherit",
                  }}
                />
              }
            />
            <IconButton
              disableRipple
              sx={{ p: "2px 0 0" }}
              onClick={() => setTransferStateMenuOpen(true)}
              children={
                <Box
                  component="img"
                  sx={{
                    width: "100%",
                    height: "23px",
                    mt: "1px",
                    ml: "4px",
                  }}
                  src={`img/speaker.svg`}
                />
              }
            />
          </Grid>
        )}
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
        {playingExternally &&
          playbackState?.device?.name &&
          playbackState?.device?.name !== "BassLines" && (
            <Grid
              bgcolor={theme.palette.secondary.main + "88"}
              width="100%"
              display="flex"
              justifyContent="center"
            >
              <Typography variant="caption" p={1} fontSize=".87rem">
                Playing on {playbackState?.device?.name}
              </Typography>
            </Grid>
          )}
      </Grid>
      <TransferStatePrompt
        open={transferPromptOpen}
        currentDevice={currentDevice}
        onClose={() => {
          setTransferPromptOpen(false);
          hydratePlaybackState();
        }}
        onAccept={() => {
          transferPlayerStateHere(() => hydratePlaybackState());
        }}
      />
      {transferStateMenuOpen && (
        <TransferStateAllDevices
          onClose={() => {
            setTransferStateMenuOpen(false);
            hydratePlaybackState();
          }}
        />
      )}
    </>
  );
});

interface ITransferStatePromptProps {
  open?: boolean;
  currentDevice?: string;
  onClose: VoidFunction;
  onAccept?: VoidFunction;
  onDeviceSelect?: (deviceId: string) => Promise<void>;
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
              <strong>{currentDevice}</strong>!
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

const TransferStateAllDevices = ({ onClose }: ITransferStatePromptProps) => {
  const theme = useTheme();

  const { callSpotify } = useSpotify();

  const [devices, setDevices] = React.useState<Device[]>();

  React.useEffect(() => {
    callSpotify(SpotifyApi)
      .apiSpotifyDevicesGet()
      .then((data) => setDevices(data.devices))
      .catch((e) => {
        console.warn(e);
        onClose();
      });
  }, []);

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ elevation: 1, sx: { borderRadius: "10px" } }}
    >
      <Grid
        p={6}
        container
        width={"100%"}
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
          fontSize="1.6rem"
          textAlign="center"
          children="Connect to a device"
        />
        <Box component={"ul"} sx={{ paddingInlineStart: 0 }}>
          {!devices ? (
            <CircularProgress size={20} />
          ) : (
            devices.map((d, i, a) => (
              <Grid
                key={d.id}
                component={"li"}
                sx={{
                  mb: i !== a.length - 1 ? 1.5 : 0,
                  p: "12px 0",
                  listStyle: "none",
                  borderRadius: "7px",
                  display: "flex",
                  bgcolor: d.isActive
                    ? theme.palette.secondary.light + "40" // 40 lightens hex value
                    : "",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  await callSpotify(SpotifyApi)
                    .apiSpotifyPlayerPut({
                      transferStateRequest: { deviceIds: [d.id] },
                    })
                    .then(() => onClose())
                    .catch(console.warn);
                }}
              >
                <Grid item xs={3} justifyContent="center" alignItems={"center"}>
                  <Box
                    component="img"
                    sx={{
                      width: "100%",
                      height: "36px",
                      ml: 3,
                    }}
                    src={`img/speaker.svg`}
                  />
                </Grid>
                <Grid item xs={9} display="flex" flexDirection="column">
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    children={
                      d.isActive ? "Listening on" : d.name + ": " + d.type
                    }
                  />
                  <Typography
                    variant="caption"
                    children={d.isActive ? d.name : "Spotify Connect"}
                  />
                </Grid>
              </Grid>
            ))
          )}
        </Box>
      </Grid>
    </Dialog>
  );
};
