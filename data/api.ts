import { store, actions } from "./store";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const client = new Client({
  webSocketFactory: () => new SockJS(`http://localhost:8080/`),
  // webSocketFactory: () => new SockJS(`http://${process.env.SERVER_URL}/`),
  debug: console.log,
});
client.onConnect = () => {
  client.subscribe("/topic/games", ({ body }) => {
    const response = JSON.parse(body) as { games: string[] };
    store.dispatch(actions.handleGamesListMessage(response.games));
  });

  const [, userId] = /ws:\/\/[^/]+\/[^/]+\/([^/]+)/.exec(
    client._stompHandler._webSocket._transport.url
  );
  client.subscribe(`/topic/errors/client-user${userId}`, ({ body }) => {
    const response = JSON.parse(body) as { message: string };
    store.dispatch(actions.requestException(response.message));
  });

  client.subscribe(`/topic/errors/server-user${userId}`, ({ body }) => {
    const response = JSON.parse(body) as { message: string };
    store.dispatch(actions.serverException(response.message));
  });
};
client.activate();

export function createGame(code: string) {
  client.publish({
    destination: "/app/games/create",
    body: JSON.stringify({ code }),
  });
}
