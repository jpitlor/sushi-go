import React from "react";
import { Route, Switch } from "react-router-dom";
import Game from "../pages/Game";
import Home from "../pages/Home";

export default function App() {
  return (
    <div>
      <Switch>
        <Route path="/game/:code">
          <Game />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}
