import * as React from "react";
import { ApiConstructor, call } from "../data/callWrapper";
import { BaseAPI, SpotifyApi } from "../data/src";
import jwt_decode from "jwt-decode";

export type SpotifyClientAuth = {
  accessToken?: string;
  expiryTime?: number;
  refreshToken?: string;
};

export type WebPlayerState = {
  device_id?: string;
};

type Action = {
  type: "authorize" | "clearAuthorization" | "setWebPlayerState";
  payload?: any;
};

type Dispatch = (action: Action) => void;

type State = {
  spotifyAuth?: SpotifyClientAuth;
  authorized?: boolean;
  expireTime?: Date;
  webPlayerState: WebPlayerState;
  handleSpotifyRefresh: (refreshToken: string) => Promise<void>;
  handleSpotifyAuth: (spotifyJwt: string) => Promise<void>;
};

const SpotifyStateContext = React.createContext<State>(undefined);
const SpotifyDispatchContext = React.createContext<Dispatch>(undefined);

function spotifyReducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case "clearAuthorization": {
      return { ...state, authorized: undefined };
    }
    case "authorize": {
      return {
        ...state,
        spotifyAuth: payload,
        authorized:
          payload.accessToken && payload.expiryTime > new Date().getTime(),
        expireTime: payload.expiryTime
          ? new Date(payload.expiryTime)
          : undefined,
      };
    }
    case "setWebPlayerState":
      return {
        ...state,
        webPlayerState: payload,
      };

    default: {
      // eslint-disable-nextline @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

type SpotifyProviderProps = { children: React.ReactNode };

function SpotifyProvider({ children }: SpotifyProviderProps) {
  const initalState: State = {
    spotifyAuth: {},
    authorized: false,
    webPlayerState: {},
    handleSpotifyAuth,
    handleSpotifyRefresh,
  };

  const [state, dispatch] = React.useReducer(spotifyReducer, initalState);

  /**
   * refreshes spotify access token
   */
  async function handleSpotifyRefresh(refreshToken: string) {
    let payload: SpotifyClientAuth;
    try {
      await call(SpotifyApi)
        .withMiddleware({
          pre(ctx) {
            ctx.init.headers["refresh_token"] = refreshToken;
            return Promise.resolve(ctx);
          },
          post(ctx) {
            payload = jwt_decode(ctx.response.headers.get("spotify_auth"));
            return Promise.resolve(ctx.response);
          },
        })
        .refreshGet();
      dispatch({
        type: "authorize",
        payload: {
          accessToken: payload.accessToken,
          expiryTime: parseInt(payload.expiryTime.toString()),
          refreshToken,
        },
      });
    } catch (e) {
      console.error("Could not refresh your token ", e);
    }
  }

  /**
   * authorizes spotify with raw jwt
   */
  async function handleSpotifyAuth(spotifyJwt: string) {
    const auth = jwt_decode(spotifyJwt) as any;
    localStorage.setItem("refreshToken", auth.refreshToken);
    const expiryTime = parseInt(auth.expiryTime);
    dispatch({
      type: "authorize",
      payload: {
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        expiryTime,
      },
    });
  }

  return (
    <SpotifyStateContext.Provider value={state}>
      <SpotifyDispatchContext.Provider value={dispatch}>
        {children}
      </SpotifyDispatchContext.Provider>
    </SpotifyStateContext.Provider>
  );
}

function useSpotify() {
  const dispatch = React.useContext(SpotifyDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSpotifyDispatch must be used within a SpotifyProvider");
  }

  const state = React.useContext(SpotifyStateContext);
  if (state === undefined) {
    throw new Error("useSpotifyState must be used within a SpotifyProvider");
  }

  const {
    spotifyAuth: { accessToken },
    handleSpotifyRefresh,
    authorized,
  } = state;

  /**
   * adds middleware to call wrapper to attach base64 encoded spotify access token as request header
   */
  function callSpotify<T extends BaseAPI>(api: ApiConstructor<T>) {
    return call(api).withMiddleware({
      pre(context) {
        context.init.headers["spotify_token"] = window.btoa(accessToken);
        return Promise.resolve(context);
      },
    });
  }

  return {
    state,
    dispatch,
    callSpotify,
  };
}

export { SpotifyProvider, useSpotify };
