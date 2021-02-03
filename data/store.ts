import { configureStore, createSlice } from "@reduxjs/toolkit";

interface State {}

const { actions, reducer } = createSlice({
  name: "app",
  initialState: {},
  reducers: {},
});

const store = configureStore({ reducer });
