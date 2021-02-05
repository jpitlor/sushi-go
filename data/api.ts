import { PayloadAction } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { store } from "./store";

const socket = io(`http://${process.env.SERVER_URL}`);
socket.onAny((type, payload) => store.dispatch({ type, payload }));

export function serverDispatch(action: PayloadAction<any>) {
  socket?.emit(action.type, action.payload);
}
