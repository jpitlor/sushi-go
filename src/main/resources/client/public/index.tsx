import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { store } from "../data/store";
import App from "../structure/App";
import history from "../data/history";

import "animate.css/animate.min.css";

ReactDOM.render(
  <ChakraProvider>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </ChakraProvider>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept();
}
