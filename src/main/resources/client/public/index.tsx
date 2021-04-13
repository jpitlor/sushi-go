import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { store } from "../data/store";
import App from "../structure/App";
import history from "../data/history";
import * as dragDropHandlers from "../data/drag-drop-handlers";

import { DragDropContext } from "react-beautiful-dnd";

ReactDOM.render(
  <ChakraProvider>
    <Provider store={store}>
      <Router history={history}>
        <DragDropContext
          onDragEnd={dragDropHandlers.onDragEnd}
          onDragStart={dragDropHandlers.onDragStart}
        >
          <App />
        </DragDropContext>
      </Router>
    </Provider>
  </ChakraProvider>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept();
}
