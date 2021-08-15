import {
  configureStore,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as gamekit from "@piticent123/gamekit-client";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";
import { Card, PlayCardRequest, Player } from "../types/props";
import { Skins } from "../types/skins";
import history from "./history";
import { DragStart, DropResult } from "react-beautiful-dnd";
import skins from "../skins";

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
  (_, { getState, dispatch }) => {
    const { settings } = getState();
    gamekit.connectToServer({
      profile: settings,
      dispatch,
      onGamesList: actions.handleGamesListMessage,
      onGameUpdate: actions.handleGameUpdate,
      onClientError: actions.handleRequestException,
      onServerError: actions.handleServerException,
      onSuccess: actions.handleSuccess,
    });
  }
);

const createAndJoinGame = createAsyncThunk<void, string, ThunkApi>(
  "createGame",
  async (gameCode, { getState, dispatch }) => {
    const { settings } = getState();
    gamekit.createGame(gameCode);
    await gamekit.joinGame({
      gameCode,
      dispatch,
      profile: settings,
      onGameUpdate: actions.handleGameUpdate,
    });
  }
);

const joinGame = createAsyncThunk<void, string, ThunkApi>(
  "joinGame",
  async (gameCode, { getState, dispatch }) => {
    const { settings } = getState();
    await gamekit.joinGame({
      gameCode,
      dispatch,
      profile: settings,
      onGameUpdate: actions.handleGameUpdate,
    });
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

  gamekit.updateProfile(code, { ...oldSettings, ...settings });
  Object.entries(settings).forEach(([k, v]) => {
    localStorage.setItem(k, v.toString());
  });

  return settings;
});

const rejoinGame = createAsyncThunk<void, string, ThunkApi>(
  "rejoinGame",
  async (gameCode, { dispatch, getState }) => {
    if (!gameCode) return;

    const { settings } = getState();
    await gamekit.joinGame({
      gameCode,
      dispatch,
      profile: settings,
      onGameUpdate: actions.handleGameUpdate,
    });
    history.push("/game");
  }
);

const startRound = createAsyncThunk<void, void, ThunkApi>(
  "startRound",
  (_, { getState }) => {
    const { currentGame } = getState();

    gamekit.sendEvent({
      route: `/app/games/${currentGame.code}/start-round`,
    });
  }
);

const startPlay = createAsyncThunk<void, void, ThunkApi>(
  "startPlay",
  (_, { getState }) => {
    const { currentGame } = getState();

    gamekit.sendEvent({
      route: `/app/games/${currentGame.code}/start-play`,
    });
  }
);

const playCards = createAsyncThunk<void, PlayCardRequest[], ThunkApi>(
  "playCard",
  (cards, { getState }) => {
    const { currentGame } = getState();

    gamekit.sendEvent({
      route: `/app/games/${currentGame.code}/play-cards`,
      data: cards,
    });
  }
);

const becomeAdmin = createAsyncThunk<void, void, ThunkApi>(
  "becomeAdmin",
  (_, { getState }) => {
    const { currentGame } = getState();
    gamekit.becomeAdmin(currentGame.code);
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
      id: localStorage.getItem("id"),
      avatar: localStorage.getItem("avatar"),
      name: localStorage.getItem("name"),
      skin: localStorage.getItem("skin") || "Default",
    },
    dragAndDrop: {
      isDragging: false,
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
      const { id } = state.settings;
      const { players } = action.payload;
      const player = players.find((p) => p.id === id);
      const totalCardsPlayed = Object.entries(state.dragAndDrop.lists)
        .filter(([key]) => key !== "hand")
        .map(([, list]) => list.length)
        .reduce((a, b) => a + b);

      if (Object.values(state.dragAndDrop.lists).every((l) => l.length === 0)) {
        state.dragAndDrop.lists = {
          hand: player.hand.filter(
            (c) => !player.currentCard.map((cc) => cc.card.id).includes(c.id)
          ),
          cardsPlayed: player.currentCard
            .filter((c) => !c.wasabi)
            .map((r) => r.card),
        };

        player.currentCard
          .filter((c) => c.wasabi)
          .forEach((c) => {
            state.dragAndDrop.lists[c.wasabi] = [c.card];
          });
      }

      if (
        totalCardsPlayed > 0 &&
        action.payload.players.every((p) => p.currentCard.length === 0)
      ) {
        Object.keys(state.dragAndDrop.lists).forEach((list) => {
          state.dragAndDrop.lists[list] = [];
        });

        state.dragAndDrop.lists.hand = player.hand;
      }

      state.currentGame = action.payload;
    },
    handleOnDragStart: (state, action: PayloadAction<DragStart>) => {
      state.dragAndDrop.isDragging = true;
    },
    handleOnDragEnd: (state, action: PayloadAction<DropResult>) => {
      const { source, destination } = action.payload;

      const skin = skins[state.settings.skin];
      const cardsPlayed = state.currentGame.players.find(
        (p) => p.id === state.settings.id
      ).cardsPlayed;
      const hasChopsticks = cardsPlayed.some((c) => c.type === "chopsticks");
      const totalCardsPlayed = Object.entries(state.dragAndDrop.lists)
        .filter(([key]) => key !== "hand")
        .map(([, cards]) => cards.length)
        .reduce((a, b) => a + b);
      const cardPlayed =
        state.dragAndDrop.lists[source.droppableId][source.index];

      state.dragAndDrop.isDragging = false;
      if (!state.dragAndDrop.lists[destination.droppableId]) {
        state.dragAndDrop.lists[destination.droppableId] = [];
      }

      if (!destination) {
        // Draggable was dropped outside of a droppable; it will reset
        return;
      }

      if (
        source.droppableId !== destination.droppableId &&
        !["hand", "cardsPlayed"].includes(destination.droppableId) &&
        state.dragAndDrop.lists[destination.droppableId].length === 1
      ) {
        state.toast = {
          id: state.toast.id + 1,
          title: "Illegal Move",
          description: `You can only put 1 ${skin.nigiri.name} on a ${skin.wasabi.name}`,
          status: "error",
        };
        return;
      }

      if (
        !["hand", "cardsPlayed"].includes(destination.droppableId) &&
        !cardPlayed.type.includes("nigiri")
      ) {
        state.toast = {
          id: state.toast.id + 1,
          title: "Illegal Move",
          description: `You can only use ${skin.nigiri.name} on a ${skin.wasabi.name}`,
          status: "error",
        };
        return;
      }

      if (
        source.droppableId === "hand" &&
        destination.droppableId !== "hand" &&
        !hasChopsticks &&
        totalCardsPlayed === 1
      ) {
        state.toast = {
          id: state.toast.id + 1,
          title: "Illegal Move",
          description: `You can only play 1 card per turn without a ${skin.chopsticks.name}`,
          status: "error",
        };
        return;
      }

      if (
        source.droppableId === "hand" &&
        destination.droppableId !== "hand" &&
        hasChopsticks &&
        totalCardsPlayed === 2
      ) {
        // This is a vague part of the rules - having a specific error message for it
        // is probably helpful
        const description =
          cardsPlayed.filter((c) => c.type === "chopsticks").length > 1
            ? `You can only use 1 ${skin.chopsticks.name} per turn for a total of 2 cards`
            : `You can only play 2 cards per turn using ${skin.chopsticks.name}`;

        state.toast = {
          id: state.toast.id + 1,
          title: "Illegal Move",
          description,
          status: "error",
        };
        return;
      }

      // Draggable was dropped somewhere valid. "cardsPlayed" and "hand" are self
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
  becomeAdmin,
  Game,
  Settings,
};
