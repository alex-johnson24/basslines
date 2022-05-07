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
    handleSpotifyAuth,
    dispatch,
    state: { authorized },
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

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      PaperProps={{ elevation: 1, sx: { borderRadius: "10px" } }}
    >
      <Grid
        p={4}
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
