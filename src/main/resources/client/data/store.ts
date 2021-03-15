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
import { MoveCardRequest, PlayCardRequest, Player } from "../types/props";
import { Skins } from "../types/skins";
import * as api from "./api";
import history from "./history";
import { DragStart, DropResult, OnDragEndResponder } from "react-beautiful-dnd";

interface Settings {
  id: string;
  avatar: string;
  name: string;
  skin: Skins;
  connected: boolean;
}

interface Game {
  code: string;
  active: boolean;
  canStartRound: boolean;
  canStartPlay: boolean;
  admin: string;
  round: number;
  players: Player[];
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
  isDragging: boolean;
}
interface ThunkApi {
  state: State;
}

const goToLobby = createAsyncThunk<void, void, ThunkApi>(
  "goToLobby",
  (_, { getState }) => {
    const { settings } = getState();
    api.connectToServer(settings.id);
  }
);

const createAndJoinGame = createAsyncThunk<void, string, ThunkApi>(
  "createGame",
  (code, { getState }) => {
    const { settings } = getState();
    api.createGame(code);
    api.joinGame(code, settings);
  }
);

const joinGame = createAsyncThunk<void, string, ThunkApi>(
  "joinGame",
  (code, { getState }) => {
    const { settings } = getState();
    api.joinGame(code, settings);
  }
);

const saveSettings = createAsyncThunk<
  Partial<Settings>,
  Partial<Settings>,
  ThunkApi
>("saveSettings", (settings, { getState }) => {
  const {
    currentGame: { code },
    settings: oldSettings,
  } = getState();

  api.updateSettings(code, { ...oldSettings, ...settings });
  Object.entries(settings).forEach(([k, v]) => {
    if (typeof v === "string") localStorage.setItem(k, v);
  });

  return settings;
});

const rejoinGame = createAsyncThunk<void, string, ThunkApi>(
  "rejoinGame",
  (code, { getState }) => {
    const { settings } = getState();
    api.joinGame(code, settings, true);
    history.push("/game");
  }
);

const startRound = createAsyncThunk<void, void, ThunkApi>(
  "startRound",
  (_, { getState }) => {
    const { currentGame } = getState();
    api.startRound(currentGame.code);
  }
);

const startPlay = createAsyncThunk<void, void, ThunkApi>(
  "startPlay",
  (_, { getState }) => {
    const { currentGame } = getState();
    api.startPlay(currentGame.code);
  }
);

const playCards = createAsyncThunk<void, PlayCardRequest[], ThunkApi>(
  "playCard",
  (cards, { getState }) => {
    const { currentGame } = getState();
    api.playCards(currentGame.code, cards);
  }
);

// TODO: While this technically works, the delay even on a local dev setup
// TODO: is large and causes jitter. Card order needs a local cache
const moveCards = createAsyncThunk<void, MoveCardRequest, ThunkApi>(
  "moveCard",
  (request, { getState }) => {
    const { currentGame } = getState();
    api.moveCard(currentGame.code, request);
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
      admin: "",
    },
    settings: {
      id: localStorage.getItem("uuid"),
      avatar: localStorage.getItem("avatar"),
      name: localStorage.getItem("name"),
      skin: localStorage.getItem("skin") || "Default",
    },
    isDragging: false,
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
    handleOnDragStart: (state, action: PayloadAction<DragStart>) => {
      state.isDragging = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveSettings.fulfilled, (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    });
    builder.addCase(moveCards.fulfilled, (state) => {
      state.isDragging = false;
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
  createAndJoinGame,
  joinGame,
  saveSettings,
  rejoinGame,
  startRound,
  startPlay,
  playCards,
  moveCards,
  Game,
  Settings,
};
