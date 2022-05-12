import * as React from "react";
import Box from "@mui/material/Box";
import { SpotifyApi } from "../../../data/src";
import { getQueryParams } from "../../../utils";
import { call } from "../../../data/callWrapper";
import { useSpotify } from "../../../contexts/spotifyContext";

export function SpotifyIcon() {
  return (
    <Box
      component="img"
      src="https://seeklogo.com/images/S/spotify-2015-logo-560E071CB7-seeklogo.com.png"
      sx={{ ml: "3px", height: 20 }}
    />
  );
}

/**
 * Used to capture the unique code from Spotify for code flow authorization of the Spotify API.
 * @returns React.Fragment
 */
export default function SpotifyRedirect() {
  const { code } = getQueryParams();
  const {
    dispatch,
    state: { handleSpotifyAuth },
  } = useSpotify();

  React.useEffect(() => {
    dispatch({ type: "clearAuthorization" });
    const authorize = async () => {
      try {
        await call(SpotifyApi)
          .withPostMiddleware(async (ctx) => {
            await handleSpotifyAuth(ctx.response.headers.get("spotify_auth"));
          })
          .modelGet({ code });
      } catch (e) {
        console.error(e);
      }
    };
    authorize();
  }, []);

  return <></>;
}
