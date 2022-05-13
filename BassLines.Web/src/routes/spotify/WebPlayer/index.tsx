declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: VoidFunction;
    Spotify: any;
  }
}

window.onSpotifyWebPlaybackSDKReady = window.onSpotifyWebPlaybackSDKReady;
window.Spotify = window.Spotify || {};

import * as React from "react";
import { useSpotify } from "../../../contexts/spotifyContext";

export default function useSpotifyWebPlayer() {
  const {
    state: {
      spotifyAuth: { accessToken },
      webPlayerState,
    },
    dispatch,
  } = useSpotify();

  React.useEffect(() => {
    (async () => {
      if (!window.onSpotifyWebPlaybackSDKReady) {
        window.onSpotifyWebPlaybackSDKReady = initializePlayer;
      } else {
        initializePlayer();
      }

      await loadSpotifyPlayer();
    })();
  }, [window.onSpotifyWebPlaybackSDKReady, accessToken]);

  const initializePlayer = () => {
    (() => {
      return new Promise<void>((resolve) => {
        if (window.Spotify) {
          const player = new window.Spotify.Player({
            getOAuthToken: (callback: any) => {
              callback(accessToken);
            },
            name: "BassLines",
            volume: 0.5,
          }) as any;

          
          player.addListener("ready", ({ device_id }) =>
          dispatch({
            type: "setWebPlayerState",
            payload: { ...webPlayerState, device_id },
          })
          );
          player.addListener("not_ready", (...args) =>
            console.log("not_ready", args)
            );
            player.addListener("player_state_changed", (...args) =>
            console.log(" player_state_changed", args)
            );
            player.addListener("initialization_error", (...error) =>
            console.warn("initialization_error", error)
            );
            player.addListener("authentication_error", (...error) =>
            console.warn("authentication_error", error)
          );
          player.addListener("account_error", (...error) =>
            console.warn("account_error", error)
          );
          player.addListener("playback_error", (...error) =>
          console.warn("playback_error", error)
          );
          
          console.log(player)
          player.connect();
        } else {
          window.onSpotifyWebPlaybackSDKReady = resolve;
        }
      });
    })();
  };
}

function loadSpotifyPlayer(): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    const scriptTag = document.getElementById("spotify-player");

    if (!scriptTag) {
      const script = document.createElement("script");

      script.id = "spotify-player";
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => resolve();
      script.onerror = (error: any) =>
        reject(new Error(`loadScript: ${error.message}`));

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}
