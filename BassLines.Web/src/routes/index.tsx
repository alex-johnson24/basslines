import * as React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MiniDrawer from "../toolbar";
import { useUserDispatch, useUserState } from "../contexts";
import jwt_decode from "jwt-decode";
import { getCookieByName } from "../utils/textUtils";
import { SpotifyApi, UserModel } from "../data/src";
import SpotifyRedirect from "./spotify/Redirect";
import SpotifyHandler from "./spotify/Handler";
import { useSpotify } from "../contexts/spotifyContext";
import ControlPanel from "./spotify/ControlPanel";
import Login from "./login";
import Leaderboard from "./leaderboard";
import HomeDashboard from "./home";
import MyCharts from "./mycharts";
import Songs from "./songs";

interface IRootProps {
  basepath: string;
  version: string;
}

interface Jwt extends UserModel {
  exp: number;
}

export default React.memo(function Root(props: IRootProps) {
  const { userInfo } = useUserState();
  const history = useHistory();
  const dispatch = useUserDispatch();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const {
    state: { authorized, profile },
    callSpotify,
    dispatch: spotifyDispatch,
  } = useSpotify();

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

  React.useEffect(() => {
    if (!authorized) return undefined;
    callSpotify(SpotifyApi)
      .meGet()
      .then((payload) => spotifyDispatch({ type: "setProfile", payload }))
      .catch(console.warn);
  }, [authorized]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      {userInfo ? (
        <MiniDrawer
          basepath={props.basepath}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          version={props.version}
          content={
            <>
              <Route
                path="/home"
                component={() => <HomeDashboard selectedDate={selectedDate} />}
              />
              <Route path="/allsongs" component={Songs} />
              <Route path="/mycharts" component={MyCharts} />
              <Route path="/leaderboard" component={Leaderboard} />
              <SpotifyHandler />
              {profile?.premium && <ControlPanel />}
            </>
          }
        />
      ) : null}
      <Route path="/redirect" component={SpotifyRedirect} />
      {!userInfo ? <Redirect to="/login" /> : null}
    </Switch>
  );
});
