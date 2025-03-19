import { CATCH_BAR_INITIAL_POSITION } from "./public/globals.js";

import { computeCatchBarCurrentPosition } from "./public/globals.js";

export default function CatchBar() {
  let lastSwapAt = undefined; // Timestamp
  let lastSwapPosition = undefined; // Globals
  let direction = undefined; // up or down

  const start = () => {
    lastSwapAt = Date.now();
    lastSwapPosition = CATCH_BAR_INITIAL_POSITION;
    direction = "down";
  };

  const updateDirection = (newDirection) => {
    if (newDirection === direction) {
      return;
    }
    lastSwapAt = Date.now();
    direction = newDirection;
    lastSwapPosition = computeCatchBarCurrentPosition(
      direction,
      lastSwapAt,
      lastSwapPosition,
      "catchBar" + direction
    );
  };

  const getInfo = () => {
    return {
      direction,
      lastSwapAt,
      lastSwapPosition,
    };
  };

  return {
    start,
    updateDirection,
    getInfo,
  };
}
