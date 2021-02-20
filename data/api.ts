import { store, actions, Game, Settings, rejoinGame } from "./store";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { v4 as uuidv4 } from "uuid";

const client = new Client();
client.onConnect = () => {
  client.subscribe("/topic/rejoin-game", ({ body }) => {
    store.dispatch(rejoinGame(body));
  });

  client.subscribe("/topic/games", ({ body }) => {
    const response = JSON.parse(body) as string[];
    store.dispatch(actions.handleGamesListMessage(response));
  });

  client.subscribe(`/user/topic/errors/client`, ({ body }) => {
    store.dispatch(actions.handleRequestException(body));
  });

  client.subscribe(`/user/topic/errors/server`, ({ body }) => {
    store.dispatch(actions.handleServerException(body));
  });

  client.subscribe(`/user/topic/successes`, ({ body }) => {
    store.dispatch(actions.handleSuccess(body));
  });
};

export function connectToServer(serverUrl) {
  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem("uuid", uuid);
  }

  // This is word for word the example in the docs, not sure why it's an error
  // @ts-ignore
  client.webSocketFactory = () => new SockJS(serverUrl);
  client.connectHeaders = { uuid };
  client.activate();
}

export function createGame(code: string) {
  client.publish({ destination: `/app/games/${code}/create` });
}

export function joinGame(
  code: string,
  settings: Settings,
  rejoining: boolean = false
) {
  if (!rejoining) {
    client.publish({
      destination: `/app/games/${code}/join`,
      body: JSON.stringify(settings),
    });
  }
  client.subscribe(`/topic/games/${code}`, ({ body }) => {
    const response = JSON.parse(body) as Game;
    store.dispatch(actions.handleGameUpdate(response));
  });
}

export function updateSettings(code: string, settings: Settings) {
  if (!code) return;

  client.publish({
    destination: `/app/games/${code}/update`,
    body: JSON.stringify(settings),
  });
}
