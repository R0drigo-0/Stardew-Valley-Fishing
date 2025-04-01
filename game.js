import CatchingMinigame from "./catching_minigame.js";
import {
  FISH_BIT_TIMEOUT_MS,
  PULL_ROD_TIMEOUT_MS,
  ATTEMPTS_DIFFICULTY,
} from "./public/globals.js";

export default function Game() {
  let playerState = "standing"; // "standing", "line_cast", "fish_bit", "playing_minigame"
  let attemptNumber = 0; // Cycles through 0 to ATTEMPTS_DIFFICULTY.length-1
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

      if (waitingForBiteResolve) {
        waitingForBiteResolve();
        waitingForBiteResolve = null; // Prevent multiple executions
      }

      fishEscapeTimer = setTimeout(() => {
        playerState = "standing";
        if (waitingForBiteReject) {
          waitingForBiteReject(playerState);
          waitingForBiteReject = null;
        }
      }, PULL_ROD_TIMEOUT_MS);
    }, FISH_BIT_TIMEOUT_MS);

    return null;
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
    const currentState = playerState;
  
    if (playerState === "line_cast") {
      playerState = "standing";
  
      if (waitingForBiteReject) {
        waitingForBiteReject(currentState);
        waitingForBiteReject = null;
        waitingForBiteResolve = null;
      }
  
      if (fishBitTimer) {
        clearTimeout(fishBitTimer);
        fishBitTimer = null;
      }
  
      return { errorCode: currentState };
    }
  
    if (playerState === "fish_bit") {
      playerState = "playing_minigame";
  
      const selectedDifficulty = ATTEMPTS_DIFFICULTY[attemptNumber];
      attemptNumber = (attemptNumber + 1) % ATTEMPTS_DIFFICULTY.length;
  
      if (fishEscapeTimer) {
        clearTimeout(fishEscapeTimer);
        fishEscapeTimer = null;
      }
  
      catchingMinigame.start(selectedDifficulty);
      return { difficulty: selectedDifficulty };
    }
  
    return { errorCode: currentState };
  };

  const updateCatchBarDirection = (direction) => {
    if (playerState === "playing_minigame") {
      catchingMinigame.updateCatchBarDirection(direction);
    }
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
