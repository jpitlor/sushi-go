import { store, actions, moveCards } from "./store";
import { DragStart, DropResult } from "react-beautiful-dnd";

export function onDragStart(start: DragStart) {
  store.dispatch(actions.handleOnDragStart(start));
}

export function onDragEnd(result: DropResult) {
  if (!result.destination) {
    // The draggable was dropped outside of a droppable,
    // so it will just go back to where it started
    return;
  }

  if (result.source.droppableId === result.destination.droppableId) {
    // It moved in the array
    store.dispatch(
      moveCards({
        oldIndex: result.source.index,
        newIndex: result.destination.index,
      })
    );
    return;
  }

  // It went somewhere else
}
