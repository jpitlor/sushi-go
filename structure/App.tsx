import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "../data/store";
import Game from "../pages/Game";
import Home from "../pages/Home";

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
      duration: 3000,
      position: "bottom-right",
    });
  }, [toastData.id]);

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
