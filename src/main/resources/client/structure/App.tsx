import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { goToLobby, useSelector } from "../data/store";
import Game from "../pages/Game";
import Home from "../pages/Home";
import Lobby from "../pages/Lobby";
import { useDispatch } from "react-redux";

export default function App() {
  const toastData = useSelector((state) => state.toast);
  const toast = useToast();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname !== "/") {
      dispatch(goToLobby());
    }
  }, [location.pathname]);

  useEffect(() => {
    const { title, description, status } = toastData;
    if (!title && !description) return;

    toast({
      title,
      description,
      status,
      duration: 2000,
      position: "bottom-right",
    });
  }, [toastData.id]);

  return (
    <Switch>
      <Route path="/game">
        <Game />
      </Route>
      <Route path="/lobby">
        <Lobby />
      </Route>
      <Route path="/" exact>
        <Home />
      </Route>
    </Switch>
  );
}
