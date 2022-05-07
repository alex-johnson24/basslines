import * as React from "react";
import { ApiConstructor, call } from "../data/callWrapper";
import {
  BaseAPI,
  SpotifyApi,
  SpotifyClientAuth,
} from "../data/src";
import jwt_decode from "jwt-decode";

type SpotifyClientInitialAuth = SpotifyClientAuth & { refreshToken?: string };

type Action = {
  type: "authorize" | "clearAuthorization";
  payload?: SpotifyClientInitialAuth;
};

type Dispatch = (action: Action) => void;

type State = {
  spotifyAuth?: SpotifyClientInitialAuth;
  authorized: boolean;
  expireTime?: Date;
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
  };

  const [state, dispatch] = React.useReducer(spotifyReducer, initalState);

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

  const handleSpotifyAuth = async (spotifyJwt: string) => {
    const auth = jwt_decode(spotifyJwt) as SpotifyClientInitialAuth;
    const authorized = auth.expiryTime < new Date().getTime();
    if (!authorized) {
      handleSpotifyRefresh(auth.refreshToken);
    } else dispatch({ type: "authorize", payload: auth });
  };

  const handleSpotifyRefresh = async (refreshToken: string) => {
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
  };

  function callSpotify<T extends BaseAPI>(api: ApiConstructor<T>) {
    return call(api).withMiddleware({
      pre(context) {
        context.init.headers["spotify_token"] = window.btoa(
          state.spotifyAuth.accessToken
        );
        return Promise.resolve(context);
      },
    });
  }

  // using refs to prevent stale closure in interval
  const expiryRef = React.useRef(state.spotifyAuth.expiryTime);
  const tokenRef = React.useRef(state.spotifyAuth.refreshToken);

  React.useEffect(() => {
    expiryRef.current = state.spotifyAuth.expiryTime;
    tokenRef.current = state.spotifyAuth.refreshToken;
  }, [state.spotifyAuth.refreshToken]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (
        expiryRef.current <= new Date().getTime() + 1000 * 60 * 5 && // refresh when it expires within 5 minutes
        tokenRef.current
      ) {
        handleSpotifyRefresh(tokenRef.current);
      }
    }, 1000 * 30);

    return () => clearInterval(interval);
  }, []);

  return {
    state,
    dispatch,
    callSpotify,
    handleSpotifyAuth,
    handleSpotifyRefresh,
  };
}

export { SpotifyProvider, useSpotify };
