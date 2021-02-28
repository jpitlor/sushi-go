import { store, actions, Game, Settings, rejoinGame } from "./store";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { PlayCardRequest } from "../types/props";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080";
const client = new Client({
  webSocketFactory: () => new SockJS(BASE_URL + "/websocket-server"),
});
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

export function connectToServer(uuid) {
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

export function startRound(code: string) {
  client.publish({ destination: `/app/games/${code}/start-round` });
}

export function startPlay(code: string) {
  client.publish({ destination: `/app/games/${code}/start-play` });
}

export function playCards(code: string, request: PlayCardRequest[]) {
  client.publish({
    destination: `/app/games/${code}/play-cards`,
    body: JSON.stringify(request),
  });
}
