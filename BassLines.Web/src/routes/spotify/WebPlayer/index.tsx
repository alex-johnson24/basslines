declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: VoidFunction;
    Spotify: any;
  }
}

type Callback<T> = (o?: T) => void;
type ReadyObject = { device_id?: string };
type ErrorObject = { message?: string };
export interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (
    event: string,
    cb:
      | Callback<SpotifyPlayerState>
      | Callback<ReadyObject>
      | Callback<ErrorObject>
  ) => boolean;
  removeListener: (event: string, cb: Callback<undefined>) => boolean;
  getCurrentState: () => Promise<SpotifyPlayerState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (v: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  activateElement: () => Promise<void>;
}

window.onSpotifyWebPlaybackSDKReady = window.onSpotifyWebPlaybackSDKReady;
window.Spotify = window.Spotify || {};

import * as React from "react";
import { useSpotify } from "../../../contexts/spotifyContext";
import { SpotifyPlayerState } from "./types";

export default function useSpotifyWebPlayer() {
  const [playerState, setPlayerState] = React.useState<SpotifyPlayerState>();
  const [deviceId, setDeviceId] = React.useState<string>();
  const {
    dispatch,
    state: {
      spotifyAuth: { accessToken },
      authorized,
    },
  } = useSpotify();

  React.useEffect(() => {
    if (!authorized) return undefined;

    (() => {
      if (!window.onSpotifyWebPlaybackSDKReady) {
        window.onSpotifyWebPlaybackSDKReady = initializePlayer;
      } else {
        initializePlayer();
      }
    })();

    loadSpotifyPlayer();
  }, [accessToken, authorized]);

  function initializePlayer() {
    (() => {
      return new Promise<void>((resolve) => {
        if (window.Spotify) {
          const player: SpotifyPlayer = new window.Spotify.Player({
            getOAuthToken: (callback) => {
              callback(accessToken);
            },
            name: "BassLines",
            volume: 0.8,
          }) as SpotifyPlayer;

          player.connect();

          dispatch({ type: "setPlayer", payload: player });

          player.addListener("ready", async ({ device_id }) => {
            setDeviceId(device_id)
          });
          player.addListener("not_ready", (arg) =>
            console.log("not_ready", arg)
          );
          player.addListener("player_state_changed", setPlayerState);
          player.addListener("initialization_error", ({ message }) =>
            console.warn("initialization_error", message)
          );
          player.addListener("authentication_error", ({ message }) =>
            console.warn("authentication_error", message)
          );
          player.addListener("account_error", ({ message }) =>
            console.warn("account_error", message)
          );
          player.addListener("playback_error", ({ message }) =>
            console.warn("playback_error", message)
          );
        } else {
          window.onSpotifyWebPlaybackSDKReady = resolve;
        }
      });
    })();
  }

  return { playerState, setPlayerState, deviceId };
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
        reject(new Error(`loadSpotifyPlayer: ${error.message}`));

      document.getElementById("spotifyPlayer").appendChild(script);
    } else {
      resolve();
    }
  });
}
