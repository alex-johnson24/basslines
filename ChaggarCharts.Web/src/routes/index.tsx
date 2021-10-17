import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import MiniDrawer from "../toolbar";
import { useUserState } from "../contexts";
import Login from "./login";
import HomeDashboard from "./home";

export default function Root() {
  const { userInfo } = useUserState();

  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route
          path="/home"
          component={() => <MiniDrawer content={<HomeDashboard />} />}
        />
      </Switch>
      {!userInfo ? <Redirect to="/login" /> : null}
    </>
  );
}
