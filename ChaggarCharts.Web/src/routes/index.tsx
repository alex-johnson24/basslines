import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import MiniDrawer from "../toolbar";
import { useUserState } from "../contexts";
import Login from "./login";
import HomeDashboard from "./home";
import Songs from "./songs";
import MyCharts from "./mycharts";

interface IRootProps {
  basepath: string;
}

export default function Root(props: IRootProps) {
  const { userInfo } = useUserState();

  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        {userInfo ? (
          <>
            <Route
              path="/home"
              component={() => (
                <MiniDrawer basepath={props.basepath} content={<HomeDashboard userInfo={userInfo} />} />
              )}
            />
            <Route
              path="/allsongs"
              component={() => <MiniDrawer basepath={props.basepath} content={<Songs />} />}
            />
            <Route
              path="/mycharts"
              component={() => <MiniDrawer basepath={props.basepath} content={<MyCharts />} />}
            />
          </>
        ) : null}
      </Switch>
      {!userInfo ? <Redirect to="/login" /> : null}
    </>
  );
}
