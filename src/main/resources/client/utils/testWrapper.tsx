import React from "react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../data/store";
import history from "../data/history";
import { DragDropContext } from "react-beautiful-dnd";
import { ChakraProvider } from "@chakra-ui/react";
import { onDragEnd, onDragStart } from "../data/drag-drop-handlers";

type testWrapperProps = { children: React.ReactNode };
export default function testWrapper({ children }: testWrapperProps) {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <Router history={history}>
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            {children}
          </DragDropContext>
        </Router>
      </Provider>
    </ChakraProvider>
  );
}
