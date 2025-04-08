import CatchingMinigame from './catching_minigame.js';
import {
  FISH_BIT_TIMEOUT_MS,
  PULL_ROD_TIMEOUT_MS,
  ATTEMPTS_DIFFICULTY
} from './public/globals.js';

export default function Game() {
  let playerState = "standing"; // "standing", "line_cast", "fish_bit", "playing_minigame"
  let attemptNumber = 0; // Cycles through 0 to ATTEMPTS_DIFFICULTY.length-1
  let catchingMinigame = CatchingMinigame(() => {
    console.log("FinishGame callback called");
    playerState = "standing";
  });

  let waitingForBiteResolve = undefined;
  let waitingForBiteReject = undefined;
  let fishEscapeTimer = undefined;
  let fishBitTimer = undefined;
  
  const castLine = () => {
      if (playerState != "standing") {
          return playerState;
      }
      playerState = "line_cast";

      fishBitTimer = setTimeout(() => {
          playerState = "fish_bit";

          if (waitingForBiteResolve) { 
              waitingForBiteResolve();
          }

          fishEscapeTimer = setTimeout(() => {
              playerState = "standing";
          }, PULL_ROD_TIMEOUT_MS);
          
      }, FISH_BIT_TIMEOUT_MS);

      return null;
  }

  const waitForBite = () => {
      return new Promise((resolve, reject) => {
          waitingForBiteResolve = resolve;
          waitingForBiteReject = reject;
      });
  }

  const reelIn = () => { 
      if (playerState !== "fish_bit") {
          let lastState = playerState;
          
          playerState = "standing";
          

          if (waitingForBiteReject) { //Mirar si ya esta creada el promise de waitForBite().
              if (lastState === "line_cast") {
                  waitingForBiteReject(playerState);
              }
              else {
                  waitingForBiteReject(lastState);
              }
          }

          if (fishBitTimer) {
              clearTimeout(fishBitTimer);
          }

          if (lastState === "line_cast") {
              return { errorCode: playerState }; 
          }
          else {
              return { errorCode: lastState };
          }
          
      }
      else if (playerState === "fish_bit") {
          playerState = "playing_minigame";
          
          let diff = ATTEMPTS_DIFFICULTY[attemptNumber];
          catchingMinigame.start(diff);

          attemptNumber = attemptNumber === ATTEMPTS_DIFFICULTY.length - 1 ? 0 : attemptNumber + 1;

          if (fishEscapeTimer) {
              clearTimeout(fishEscapeTimer);
          }

          return {difficulty: diff};
      }
  }

  const updateCatchBarDirection = (newDirection) => {
      catchingMinigame.updateCatchBarDirection(newDirection);
  }

  const getCatchingMiniGameInfo = () => {
      return catchingMinigame.getInfo();
  }

  return { castLine, 
    waitForBite, 
    reelIn, 
    updateCatchBarDirection, 
    getCatchingMiniGameInfo };
}
