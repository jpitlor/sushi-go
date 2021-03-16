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
import { Card, MoveCardRequest, PlayCardRequest, Player } from "../types/props";
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
  dragAndDrop: {
    isDragging: boolean;
    round: number;
    lists: {
      hand: Card[];
      cardsPlayed: Card[];
      [k: string]: Card[];
    };
  };
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
      round: 0,
      canStartPlay: false,
      canStartRound: false,
    },
    settings: {
      id: localStorage.getItem("uuid"),
      avatar: localStorage.getItem("avatar"),
      name: localStorage.getItem("name"),
      skin: localStorage.getItem("skin") || "Default",
    },
    dragAndDrop: {
      isDragging: false,
      round: 0,
      lists: {
        hand: [],
        cardsPlayed: [],
      },
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

      if (action.payload.round > state.dragAndDrop.round) {
        state.dragAndDrop.lists.cardsPlayed = [];
        state.dragAndDrop.lists.hand = action.payload.players.find(
          (p) => p.id === state.settings.id
        ).hand;
      }
    },
    handleOnDragStart: (state, action: PayloadAction<DragStart>) => {
      state.dragAndDrop.isDragging = true;
    },
    handleOnDragEnd: (state, action: PayloadAction<DropResult>) => {
      const { source, destination } = action.payload;

      state.dragAndDrop.isDragging = false;

      if (!destination) {
        // Draggable was dropped outside of a droppable; it will reset
        return;
      }

      if (
        source.droppableId === destination.droppableId &&
        destination.droppableId !== "hand" &&
        destination.droppableId !== "cardsPlayed"
      ) {
        // This code should never be executed. The hand and cards played are the
        // only 2 droppables that should ever have >1 card. Something has gone
        // horribly wrong if this is not true
        return;
      }

      const maxCardsPlayedAllowed = state.currentGame.players
        .find((p) => p.id === state.settings.id)
        .cardsPlayed.some((c) => c.type === "chopsticks")
        ? 2
        : 1;
      if (
        destination.droppableId === "cardsPlayed" &&
        state.dragAndDrop.lists.cardsPlayed.length >= maxCardsPlayedAllowed
      ) {
        // TODO skin name
        state.toast = {
          id: state.toast.id + 1,
          title: "Illegal Move",
          description: `You can only play 1 card per turn (or 2 if you have Chopsticks)`,
          status: "error",
        };
        return;
      }

      // Draggable was dropped somewhere else. "cardsPlayed" and "hand" are self
      // explanatory, else it is a card ID
      const [oldCard] = state.dragAndDrop.lists[source.droppableId].splice(
        source.index,
        1
      );
      state.dragAndDrop.lists[destination.droppableId].splice(
        destination.index,
        0,
        oldCard
      );
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
  createAndJoinGame,
  joinGame,
  saveSettings,
  rejoinGame,
  startRound,
  startPlay,
  playCards,
  Game,
  Settings,
};
