import { store, actions } from "./store";
import { DragStart, DropResult } from "react-beautiful-dnd";

export function onDragStart(start: DragStart) {
  store.dispatch(actions.handleOnDragStart(start));
}

export function onDragEnd(result: DropResult) {
  store.dispatch(actions.handleOnDragEnd(result));
}
