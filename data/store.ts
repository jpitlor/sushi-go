import { configureStore, createSlice } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";

interface State {
  skin: string;
}

const { actions, reducer } = createSlice({
  name: "app",
  initialState: {} as State,
  reducers: {},
});

const store = configureStore({ reducer });

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export { actions, reducer, store, useSelector };
