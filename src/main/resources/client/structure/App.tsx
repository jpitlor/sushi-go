import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "../data/store";
import Game from "../pages/Game";
import Home from "../pages/Home";
import Lobby from "../pages/Lobby";

export default function App() {
  const toastData = useSelector((state) => state.toast);
  const toast = useToast();

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
