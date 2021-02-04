import { PayloadAction } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { store } from "./store";
import Socket = SocketIOClient.Socket;

let socket: Socket;

export function connectToServer(url: string = process.env.SERVER_URL) {
  if (socket) {
    socket.close();
  }

  socket = io(`ws://${url}`);

  // This method exists...not sure why it isn't in the typings
  // @ts-ignore
  socket.onAny((type, payload) => store.dispatch({ type, payload }));
}

export function serverDispatch(action: PayloadAction<any>) {
  socket?.emit(action.type, action.payload);
}
