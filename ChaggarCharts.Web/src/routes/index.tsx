import * as React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MiniDrawer from "../toolbar";
import Login from "./login/index";
import HomeDashboard from "./home";
import Songs from "./songs";
import MyCharts from "./mycharts";
import { useUserDispatch, useUserState } from "../contexts";
import jwt_decode from "jwt-decode";
import { getCookieByName } from "../utils/textUtils";
import { UserModel } from "../data/src";

interface IRootProps {
  basepath: string;
}

interface Jwt extends UserModel {
  exp: number;
}

export default function Root(props: IRootProps) {
  const { userInfo } = useUserState();
  const history = useHistory();
  const dispatch = useUserDispatch();

  React.useEffect(() => {
    const token = getCookieByName("access_token");
    if (token !== undefined) {
      const user = jwt_decode(token) as Jwt;
      if (Date.now() < user.exp * 1000) {
        dispatch({ type: "signIn", payload: user });
        history.push("/home");
      }
    }
  }, []);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      {userInfo ? (
        <MiniDrawer
          basepath={props.basepath}
          content={
            <>
              <Route
                path="/home"
                component={() => <HomeDashboard userInfo={userInfo} />}
              />
              <Route path="/allsongs" component={Songs} />
              <Route path="/mycharts" component={MyCharts} />
            </>
          }
        />
      ) : null}
      {!userInfo ? <Redirect to="/login" /> : null}
    </Switch>
  );
}
