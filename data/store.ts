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
import { serverDispatch } from "./api";

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

const createGame = createAsyncThunk<void, string>(
  "createGame",
  (code, thunkAPI) => {
    serverDispatch({ type: "create_game", payload: code });
    thunkAPI.dispatch(getGames());
  }
);

const getGames = createAsyncThunk("getGames", () => {
  serverDispatch({ type: "get_game_list", payload: null });
});

const { actions, reducer } = createSlice({
  name: "app",
  initialState: {
    skin: "Default",
    openGames: [],
    toast: { id: 0, title: "", description: "", status: "success" },
  } as State,
  reducers: {
    requestException: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id++,
        title: "Bad Request",
        description: action.payload,
        status: "error",
      };
    },
    serverException: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id++,
        title: "Server Error",
        description: action.payload,
        status: "error",
      };
    },
    getGameListResponse: (state, action: PayloadAction<string[]>) => {
      state.openGames = [...action.payload];
    },
    createGameResponse: (state) => {
      state.toast = {
        id: state.toast.id++,
        title: "Game Created",
        description: "",
        status: "success",
      };
    },
  },
});

const store = configureStore({ reducer });

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export { actions, reducer, store, useSelector, createGame, getGames };
