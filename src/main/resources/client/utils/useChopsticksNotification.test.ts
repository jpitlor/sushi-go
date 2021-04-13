import { store, actions, saveSettings, Game } from "../data/store";
import { act, renderHook } from "@testing-library/react-hooks";
import useChopsticksNotification from "./useChopsticksNotification";
import wrapper from "./testWrapper";
import { PlayCardRequest } from "../types/props";

const game = {
  active: true,
  admin: "",
  canStartPlay: true,
  canStartRound: true,
  code: "",
  round: 1,
};

const player = {
  id: "",
  canDrag: false,
  cardsPlayed: [],
  hand: [],
  puddingCount: 0,
  scores: [],
  settings: null,
  startOfTimeOffline: null,
};

function makeGame(currentCard: PlayCardRequest[]): Game {
  return {
    ...game,
    players: [{ ...player, currentCard }],
  };
}

describe("Use Chopsticks Notification", function () {
  beforeEach(async () => {
    await store.dispatch(saveSettings({ id: "" }));
    store.dispatch(actions.handleGameUpdate(makeGame([])));
  });

  it("is closed when a chopsticks wasn't played", () => {
    const { result } = renderHook(() => useChopsticksNotification(""), {
      wrapper,
    });

    act(() => {
      store.dispatch(
        actions.handleGameUpdate(
          makeGame([{ card: { id: "", type: "dumpling" } }])
        )
      );
      store.dispatch(actions.handleGameUpdate(makeGame([])));
    });
    expect(result.current).toBe(false);
  });

  it("is open when a chopsticks was played", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useChopsticksNotification(""),
      {
        wrapper,
      }
    );

    store.dispatch(
      actions.handleGameUpdate(
        makeGame([
          { card: { id: "", type: "dumpling" } },
          { card: { id: "", type: "dumpling" } },
        ])
      )
    );
    store.dispatch(actions.handleGameUpdate(makeGame([])));
    await waitForNextUpdate();

    expect(result.current).toBe(true);
  });

  it("closes after 1.5 seconds", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useChopsticksNotification(""),
      {
        wrapper,
      }
    );

    store.dispatch(
      actions.handleGameUpdate(
        makeGame([
          { card: { id: "", type: "dumpling" } },
          { card: { id: "", type: "dumpling" } },
        ])
      )
    );
    store.dispatch(actions.handleGameUpdate(makeGame([])));
    await waitForNextUpdate();
    await waitForNextUpdate({ timeout: 1600 });
    await expect(result.current).toBe(false);
  });
});
