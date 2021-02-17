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
import { Card } from "../types/props";
import { Skins } from "../types/skins";
import * as api from "./api";

interface Settings {
  id: string;
  image: string;
  name: string;
  skin: Skins;
  server: string;
}

interface Game {
  code: string;
  active: boolean;
  admin: string;
  players: {
    name: string;
    id: string;
    connected: boolean;
    cardsPlayed: Card[];
    cardsLeft: number;
  }[];
  roundScores: { [k: string]: number }[];
}

interface State {
  openGames: string[];
  toast: {
    id: number;
    title: string;
    description: string;
    status: "info" | "warning" | "success" | "error";
  };
  settings: Settings;
  currentGame: Game;
}

const goToLobby = createAsyncThunk<void, string>("goToLobby", (serverUrl) => {
  api.connectToServer(serverUrl);
});

const createGame = createAsyncThunk<void, string>("createGame", (code) => {
  api.createGame(code);
});

const joinGame = createAsyncThunk<void, string>("joinGame", (code) => {});

const saveSettings = createAsyncThunk<Partial<Settings>, Partial<Settings>>(
  "saveSettings",
  (settings) => {
    Object.entries(settings).forEach(([k, v]) => localStorage.setItem(k, v));
    return settings;
  }
);

const { actions, reducer } = createSlice({
  name: "app",
  initialState: {
    openGames: [],
    toast: { id: 0, title: "", description: "", status: "success" },
    currentGame: {
      active: false,
      code: "",
      players: [],
      roundScores: [],
      admin: "",
    },
    settings: {
      id: localStorage.getItem("uuid"),
      image: localStorage.getItem("image"),
      name: localStorage.getItem("name"),
      skin: localStorage.getItem("skin") || "Default",
      server: localStorage.getItem("server") || "",
    },
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
    handleGameUpdate: (state, action: PayloadAction<Game>) => {
      state.currentGame = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveSettings.fulfilled, (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    });
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
  saveSettings,
  Game,
};
