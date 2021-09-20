import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useUserState } from "../contexts";
import Login from "./login";

export default function Root() {
  const { userInfo } = useUserState();

  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={() => <div>logged in</div>} />
      </Switch>
      {!userInfo ? <Redirect to="/login" /> : null}
    </>
  );
}
