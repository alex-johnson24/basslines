import * as React from "react";
import { UserModel, UserRole } from "../data/src";

type Action = { type: "signIn"; payload: UserModel } | { type: "logOut" };

type Dispatch = (action: Action) => void;

type State = {
  userInfo?: UserModel;
  userCanReview?: boolean;
};

type UserProviderProps = { children: React.ReactNode };

const UserStateContext = React.createContext<State | undefined>(undefined);
const UserDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case "signIn": {
      return {
        ...state,
        userInfo: {
          ...action.payload,
        },
        userCanReview: action.payload.role === UserRole.Administrator || action.payload.role === UserRole.Reviewer
      };
    }
    case "logOut": {
      return {
        ...state,
        userInfo: undefined,
        userCanReview: false
      };
    }
    default: {
      // eslint-disable-nextline @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const UserProvider = React.memo(function ({ children }: UserProviderProps) {
  const [state, dispatch] = React.useReducer(userReducer, {
    userInfo: undefined,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
})

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch };
