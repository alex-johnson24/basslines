import { Box, Button, Dialog, Grid } from "@mui/material";
import * as React from "react";
import { useSpotify } from "../../../contexts/spotifyContext";
import { call } from "../../../data/callWrapper";
import { SpotifyApi } from "../../../data/src";
import { getCookieByName } from "../../../utils/textUtils";

export default function SpotifyHandler() {
  const {
    handleSpotifyAuth,
    dispatch,
    state: { authorized },
  } = useSpotify();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(authorized === undefined), [authorized]);

  React.useEffect(() => {
    const spotifyCookie = getCookieByName("spotify_auth");
    if (spotifyCookie) {
      handleSpotifyAuth(spotifyCookie);
    } else dispatch({ type: "clearAuthorization" });
  }, []);

  return (
    <>
      <Dialog open={open} PaperProps={{ elevation: 1 }}>
        <Grid
          container
          display="flex"
          flexDirection="column"
          p={4}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            component="img"
            src="https://seeklogo.com/images/S/spotify-2015-logo-560E071CB7-seeklogo.com.png"
            sx={{ height: 95, width: 95, mb: 2.4 }}
          />
          <Button
            variant="contained"
            color="primary"
            children={"Login to Spotify"}
            onClick={() =>
              call(SpotifyApi)
                .spotifyGet()
                .then((uri) => (window.location.href = uri))
                .catch(console.error)
            }
            style={{ marginBottom: 24 }}
          />
          <Button
            variant="text"
            style={{ color: "theme.text" }}
            children={"No thanks, I don't need your awesome features"}
            onClick={() => setOpen(false)}
          />
        </Grid>
      </Dialog>
    </>
  );
}
