import { store, actions } from "./store";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

// const socket = new SockJS(`http://${process.env.SERVER_URL}/`);
const socket = new SockJS(`http://localhost:8080/`);
const client = Stomp.over(socket);
client.connect({}, () => {
  client.subscribe("/topic/games", ({ body }) => {
    console.log(body);
    const gamesList = JSON.parse(body) as { games: string[] };
    console.log(gamesList.games);
    store.dispatch(actions.handleGamesListMessage(gamesList.games));
  });
});

export function createGame(code: string) {
  const body = JSON.stringify({ code });
  client.send("/app/games/create", {}, body);
}
