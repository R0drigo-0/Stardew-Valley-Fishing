import CatchingMinigame from "./catching_minigame.js";
import {
  FISH_BIT_TIMEOUT_MS,
  PULL_ROD_TIMEOUT_MS,
  ATTEMPTS_DIFFICULTY,
} from "./public/globals.js";

import {} from "./public/globals.js";

export default function Game() {
  let playerState = "standing"; // "standing", "line_cast", "fish_bit", "playing_minigame"
  let attemptNumber = 0; // 0 < ATTEMPTS_DIFFICULTY[difficulty].length
  let catchingMinigame = CatchingMinigame(() => {
    playerState = "standing";
  });

  let waitingForBiteResolve = undefined;
  let waitingForBiteReject = undefined;
  let fishEscapeTimer = undefined;
  let fishBitTimer = undefined;

  const castLine = () => {
    if (playerState !== "standing") {
      return playerState;
    }

    playerState = "line_cast";

    fishBitTimer = setTimeout(() => {
      playerState = "fish_bit";

      waitingForBiteResolve();
      waitingForBiteResolve = null; // Para evitar que se pueda ejecutar multiples veces
      fishEscapeTimer = setTimeout(() => {
        playerState = "standing";
        waitingForBiteReject();
      }, PULL_ROD_TIMEOUT_MS);
    }, FISH_BIT_TIMEOUT_MS);

    return playerState;
  };

  const waitForBite = () => {
    return new Promise((resolve, reject) => {
      if (playerState !== "line_cast") {
        reject(playerState);
        return;
      }
      waitingForBiteResolve = resolve;
      waitingForBiteReject = reject;
    });
  };

  const reelIn = () => {
    if (playerState === "line_cast") {
      playerState = "standing";

      // Reject the promise
      if (waitingForBiteReject) {
        waitingForBiteReject(playerState);
        waitingForBiteReject = null;
        waitingForBiteResolve = null;
      }

      if (fishBitTimer) {
        clearTimeout(fishBitTimer);
        fishBitTimer = null;
      }

      return { errorCode: playerState };
    }

    if (playerState === "fish_bit") {
      playerState = "playing_minigame";

      const selectedDifficulty = ATTEMPTS_DIFFICULTY[attemptNumber];

      attemptNumber = (attemptNumber + 1) % ATTEMPTS_DIFFICULTY.length;

      if (fishEscapeTimer) {
        clearTimeout(fishEscapeTimer);
        fishEscapeTimer = null;
      }

      try {
        catchingMinigame.start(selectedDifficulty);
        return { difficulty: selectedDifficulty };
      } catch (error) {
        return { errorCode: playerState };
      }
    }

    return { errorCode: playerState };
  };

  const updateCatchBarDirection = (direction) => {
    if (playerState === "playing_minigame")
      catchingMinigame.updateCatchBarDirection(direction);
    //catchingMinigame.updateCatchBarDirection(
    //  catchingMinigame.getInfo().catchBar.getInfo().direction
    //);
  };

  const getCatchingMiniGameInfo = () => {
    if (playerState === "playing_minigame") {
      return catchingMinigame.getInfo();
    }
    return null;
  };

  return {
    castLine,
    waitForBite,
    reelIn,
    updateCatchBarDirection,
    getCatchingMiniGameInfo,
  };
}
