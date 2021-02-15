import { store, actions } from "./store";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { v4 as uuidv4 } from "uuid";

const client = new Client();
client.onConnect = () => {
  client.subscribe("/topic/games", ({ body }) => {
    const response = JSON.parse(body) as { games: string[] };
    store.dispatch(actions.handleGamesListMessage(response.games));
  });

  client.subscribe(`/user/topic/errors/client`, ({ body }) => {
    const response = JSON.parse(body) as { message: string };
    store.dispatch(actions.handleRequestException(response.message));
  });

  client.subscribe(`/user/topic/errors/server`, ({ body }) => {
    const response = JSON.parse(body) as { message: string };
    store.dispatch(actions.handleServerException(response.message));
  });

  client.subscribe(`/user/topic/successes`, ({ body }) => {
    const response = JSON.parse(body) as { message: string };
    store.dispatch(actions.handleSuccess(response.message));
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
  client.publish({
    destination: "/app/games/create",
    body: JSON.stringify({ code }),
  });
}
