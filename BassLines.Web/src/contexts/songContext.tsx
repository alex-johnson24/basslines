import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import * as React from "react";
import { SongModel, SongModelFromJSON } from "../data/src";

// TODO: moving the add song fab to the toolbar will require the song dialog disconnected from the home page
// put those properties here
type Action =
  | { type: "setDailySongs"; payload: SongModel[] | null }
  | { type: "setSelectedDate"; payload: Date }
  | { type: "setDraftSong"; payload: SongModel }
  | { type: "setSongDialogOpen"; payload: boolean }
  | { type: "setReviewerNotes"; payload: string }
  | { type: "receiveSongEvent"; payload: SongModel }
  | { type: "setConnection"; payload: HubConnection };

type Dispatch = (action: Action) => void;

type State = {
  dailySongs: (SongModel & { saved?: boolean })[];
  selectedDate: Date;
  draftSong?: SongModel;
  songDialogOpen: boolean;
  reviewerNotes: string;
  connection?: HubConnection;
  allSongsRated: boolean;
};

type SongProviderProps = { children: React.ReactNode };

const SongStateContext = React.createContext<State | undefined>(undefined);
const SongDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);

function songReducer(state: State, action: Action): State {
  switch (action.type) {
    case "setDailySongs": {
      return {
        ...state,
        dailySongs: [...action.payload],
        allSongsRated:
          [...action.payload.filter((f) => typeof f.rating !== "number")]
            .length === 0,
      };
    }
    case "setSelectedDate": {
      return {
        ...state,
        selectedDate: action.payload,
      };
    }
    case "setDraftSong": {
      return {
        ...state,
        draftSong: { ...action.payload },
      };
    }
    case "setSongDialogOpen": {
      return {
        ...state,
        songDialogOpen: action.payload,
      };
    }
    case "setReviewerNotes": {
      return {
        ...state,
        reviewerNotes: action.payload,
      };
    }
    case "receiveSongEvent": {
      return {
        ...state,
        dailySongs: [
          ...state.dailySongs.filter((f) => f.id !== action.payload.id),
          SongModelFromJSON(action.payload),
        ],
        allSongsRated:
          [
            ...[
              ...state.dailySongs.filter((f) => f.id !== action.payload.id),
              SongModelFromJSON(action.payload),
            ].filter((f) => typeof f.rating !== "number"),
          ].length === 0,
      };
    }
    case "setConnection": {
      return {
        ...state,
        connection: action.payload,
      };
    }
    default: {
      // eslint-disable-nextline @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const SongProvider = React.memo(function ({ children }: SongProviderProps) {
  const [state, dispatch] = React.useReducer(songReducer, {
    dailySongs: [],
    selectedDate: new Date(),
    draftSong: null,
    songDialogOpen: false,
    reviewerNotes: "",
    connection: undefined,
    allSongsRated: false,
  });

  React.useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("songHub")
      .withAutomaticReconnect()
      .build();

    newConnection.start();
    dispatch({ type: "setConnection", payload: newConnection });
  }, []);

  return (
    <SongStateContext.Provider value={state}>
      <SongDispatchContext.Provider value={dispatch}>
        {children}
      </SongDispatchContext.Provider>
    </SongStateContext.Provider>
  );
});

function useSongState() {
  const context = React.useContext(SongStateContext);
  if (context === undefined) {
    throw new Error("useSongState must be used within a SongProvider");
  }
  return context;
}

function useSongDispatch() {
  const context = React.useContext(SongDispatchContext);
  if (context === undefined) {
    throw new Error("useSongDispatch must be used within a SongProvider");
  }
  return context;
}

export { SongProvider, useSongState, useSongDispatch };
