import {
  Box,
  Button,
  Checkbox,
  Color,
  Dialog,
  FormControlLabel,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { useSpotify } from "../../../contexts/spotifyContext";
import { call } from "../../../data/callWrapper";
import { SpotifyApi } from "../../../data/src";
import { getCookieByName } from "../../../utils/textUtils";
import SpotifyLogo from "../spotifyLogo";

export default function SpotifyHandler() {
  const {
    dispatch,
    state: {
      authorized,
      handleSpotifyAuth,
      handleSpotifyRefresh,
      spotifyAuth: { expiryTime, refreshToken },
    },
  } = useSpotify();

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  React.useEffect(
    () =>
      setOpen(
        authorized === undefined &&
          localStorage.getItem("useSpotify") !== "false"
      ),
    [authorized]
  );

  React.useEffect(() => {
    const spotifyCookie = getCookieByName("spotify_auth");

    if (spotifyCookie) {
      handleSpotifyAuth(spotifyCookie);
    } else dispatch({ type: "clearAuthorization" });
  }, []);

  // using refs to prevent stale closure in interval
  const expiryRef = React.useRef(expiryTime);
  const tokenRef = React.useRef(refreshToken);
  const fiveMinutesLater = React.useRef(new Date().getTime() + 1000 * 60 * 5);

  React.useEffect(() => {
    expiryRef.current = expiryTime;
    tokenRef.current = refreshToken;
    fiveMinutesLater.current = new Date().getTime() + 1000 * 60 * 5;
  });

  /**
   * checks spotify authorization every 30 seconds, refreshes token if set to expire
   */
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (expiryRef.current <= fiveMinutesLater.current && tokenRef.current) {
        handleSpotifyRefresh(tokenRef.current);
      }
    }, 1000 * 30);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          children="To access all the features BassLines has to offer, please log in to your Spotify account"
        />
        <Button
          variant="contained"
          color="success"
          children={"Authorize Spotify"}
          style={{ margin: "14px 0" }}
          onClick={() =>
            call(SpotifyApi)
              .spotifyGet()
              .then((uri) => (window.location.href = uri))
              .catch(console.error)
          }
        />
        <Button
          variant="text"
          children={"No thanks"}
          color="primary"
          sx={{ fontSize: theme.typography.caption.fontSize }}
          onClick={handleClose}
        />
        <FormControlLabel
          label={<Typography variant="caption" children="Don't ask me again" />}
          control={
            <Checkbox
              size="small"
              onChange={(e, checked) =>
                localStorage.setItem("useSpotify", String(!checked))
              }
            />
          }
        />
      </Grid>
    </Dialog>
  );
}
