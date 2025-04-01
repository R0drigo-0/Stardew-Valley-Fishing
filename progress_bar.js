import {
  computeProgressBarCurrentPosition,
  PROGRESS_BAR_INITIAL_POSITION,
  PROGRESS_BAR_TICK_FREQUENCY,
} from "./public/globals.js";

import {
  timeForProgressBarToReachLimit,
  computeCatchBarCurrentPosition,
  computeFishCurrentPosition,
  catchBarAndFishTouch,
} from "./public/globals.js";

export default function ProgressBar(fishSpeed, finishCallback) {
  let lastSwapPosition = undefined;
  let lastSwapAt = undefined;
  let direction = undefined; // up or down
  let state = undefined; // in_progress, successful or failed

  // Store fish info
  let fishDirection = undefined;
  let fishLastSwapAt = undefined;
  let fishLastSwapPosition = undefined;

  // Store catch bar info
  let catchBarDirection = undefined;
  let catchBarLastSwapAt = undefined;
  let catchBarLastSwapPosition = undefined;

  const start = () => {
    lastSwapPosition = PROGRESS_BAR_INITIAL_POSITION;
    lastSwapAt = Date.now();
    direction = "down";
    state = "in_progress";

    let t1 = undefined;
    let t2 = undefined;

    // Para repetir menos codigo
    const setUpt1Timer = () => {
      const timeToReachLimit = timeForProgressBarToReachLimit(
        direction,
        lastSwapPosition,
        fishSpeed
      );

      t1 = setTimeout(() => {
        state = direction === "up" ? "successful" : "failed";

        if (t2 != undefined) clearInterval(t2);

        finishCallback();
      }, timeToReachLimit);
    };

    setUpt1Timer();

    t2 = setInterval(() => {
      let currentPositionCathBar = computeCatchBarCurrentPosition(
        catchBarDirection,
        catchBarLastSwapAt,
        catchBarLastSwapPosition
      );
      
      let currentPositionFish = computeFishCurrentPosition(
        fishDirection,
        fishLastSwapAt,
        fishLastSwapPosition,
        fishSpeed
      );

      let isBarAndFIshTouching = catchBarAndFishTouch(
        currentPositionFish,
        currentPositionCathBar
      );

      if (
        (direction === "down" && isBarAndFIshTouching) ||
        (direction === "up" && !isBarAndFIshTouching)
      ) {
        lastSwapPosition = computeProgressBarCurrentPosition(
          direction,
          lastSwapAt,
          lastSwapPosition
        );
        direction = direction === "up" ? "down" : "up";
        lastSwapAt = Date.now();

        clearTimeout(t1);
        setUpt1Timer();
      }
    }, PROGRESS_BAR_TICK_FREQUENCY);
  };

  const fishSwappedDirection = (
    newFishDirection,
    newFishLastSwapAt,
    newFishLastSwapPosition
  ) => {
    fishDirection = newFishDirection;
    fishLastSwapAt = newFishLastSwapAt;
    fishLastSwapPosition = newFishLastSwapPosition;
  };

  const catchBarSwappedDirection = (
    newCatchBarDirection,
    newCatchBarLastSwapAt,
    newCatchBarLastSwapPosition
  ) => {
    catchBarDirection = newCatchBarDirection;
    catchBarLastSwapAt = newCatchBarLastSwapAt;
    catchBarLastSwapPosition = newCatchBarLastSwapPosition;
  };

  const getInfo = () => {
    return {
      direction,
      lastSwapAt,
      lastSwapPosition,
      state,
    };
  };

  return {
    start,
    fishSwappedDirection,
    catchBarSwappedDirection,
    getInfo,
  };
}
