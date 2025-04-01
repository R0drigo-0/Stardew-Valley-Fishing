import {
  FISH_MAX_POS,
  computeFishTimeToNextSwap,
  computeFishCurrentPosition,
} from "./public/globals.js";

export default function Fish(speed, swappedDirectionCallback) {
  let lastSwapPosition = undefined;
  let lastSwapAt = undefined;
  let direction = undefined;
  let timer = undefined;

  const swapDirection = () => {
    lastSwapPosition = computeFishCurrentPosition(
      direction,
      lastSwapAt,
      lastSwapPosition,
      speed
    );
    lastSwapAt = Date.now();
    direction = direction === "up" ? "down" : "up";
    swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    timer = setTimeout(swapDirection, computeFishTimeToNextSwap(direction, lastSwapPosition, speed));
  };

  const start = () => {
    direction = "down";
    lastSwapAt = Date.now();
    lastSwapPosition = Math.random() * FISH_MAX_POS;

    swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);

    timer = setTimeout(swapDirection, computeFishTimeToNextSwap(direction, lastSwapPosition, speed));
  };

  const getInfo = () => {
    return {
      direction,
      lastSwapAt,
      lastSwapPosition,
    };
  };

  const finish = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return {
    start,
    getInfo,
    finish,
  };
}
