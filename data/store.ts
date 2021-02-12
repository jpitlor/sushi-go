import {
  configureStore,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";
import * as api from "./api";

interface State {
  skin: "Default" | "Camp Fitch";
  openGames: string[];
  toast: {
    id: number;
    title: string;
    description: string;
    status: "info" | "warning" | "success" | "error";
  };
}

const goToLobby = createAsyncThunk<void, string>("goToLobby", (serverUrl) => {
  api.connectToServer(serverUrl);
});

const createGame = createAsyncThunk<void, string>("createGame", (code) => {
  api.createGame(code);
});

const joinGame = createAsyncThunk<void, string>("joinGame", (code) => {});

const { actions, reducer } = createSlice({
  name: "app",
  initialState: {
    skin: "Default",
    openGames: [],
    toast: { id: 0, title: "", description: "", status: "success" },
  } as State,
  reducers: {
    handleRequestException: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id + 1,
        title: "Bad Request",
        description: action.payload,
        status: "error",
      };
    },
    handleServerException: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id + 1,
        title: "Server Error",
        description: action.payload,
        status: "error",
      };
    },
    handleSuccess: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id + 1,
        title: action.payload,
        description: "",
        status: "success",
      };
    },
    handleGamesListMessage: (state, action: PayloadAction<string[]>) => {
      state.openGames = [...action.payload];
    },
  },
});

const store = configureStore({ reducer });

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export {
  actions,
  reducer,
  store,
  useSelector,
  goToLobby,
  createGame,
  joinGame,
};
