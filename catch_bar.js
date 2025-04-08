import { CATCH_BAR_INITIAL_POSITION, computeCatchBarCurrentPosition } from "./public/globals.js";

export default function CatchBar(swappedDirectionCallback) {
  let lastSwapAt = undefined; // Timestamp
  let lastSwapPosition = undefined; // Valor inicial de posición
  let direction = undefined; // "up" o "down"

  const start = () => {
    lastSwapAt = Date.now();
    lastSwapPosition = CATCH_BAR_INITIAL_POSITION;
    direction = "down";

    if (swappedDirectionCallback) {
      swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    }
  };

  const updateDirection = (newDirection) => {
  
    if (newDirection === direction) {
      return;
    }
    const currentPosition = computeCatchBarCurrentPosition(
      direction,
      lastSwapAt,
      lastSwapPosition
    );
    lastSwapPosition = currentPosition;
    lastSwapAt = Date.now();
    direction = newDirection;

    if (swappedDirectionCallback) {
      swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    }
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
