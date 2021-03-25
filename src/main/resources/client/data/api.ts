import { store, actions, Game, Settings, rejoinGame } from "./store";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { MoveCardRequest, PlayCardRequest } from "../types/props";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${window.location.host}`
    : "http://localhost:8080";
console.log(process.env.NODE_ENV);
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

export async function joinGame(
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

  // A race condition happens where if we dont wait 1ms, the subscription may happen first
  // giving an error that the game doesn't exist
  await new Promise((resolve) => setTimeout(resolve, 1));

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

export function moveCard(code: string, request: MoveCardRequest) {
  client.publish({
    destination: `/app/games/${code}/move-card`,
    body: JSON.stringify(request),
  });
}
