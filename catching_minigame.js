import {
  DIFFICULTY_TO_FISH_SPEED,
  PROGRESS_BAR_INITIAL_POSITION,
} from "./public/globals.js";

import Fish from "./fish.js";
import CatchBar from "./catch_bar.js";
import ProgressBar from "./progress_bar.js";

export default function CatchingMinigame(finishCallback) {
  let progressBar = undefined;
  let catchBar = undefined;
  let fish = undefined;

  const start = (difficulty) => {
    let fishSpeed = DIFFICULTY_TO_FISH_SPEED[difficulty];

    catchBar = CatchBar(
      (catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition) => {
        if (progressBar) {
          progressBar.catchBarSwappedDirection(
            catchBarDirection,
            catchBarLastSwapAt,
            catchBarLastSwapPosition
          );
        }
      }
    );

    fish = Fish(
      fishSpeed,
      (fishDirection, fishLastSwapAt, fishLastSwapPosition) => {
        if (progressBar) {
          progressBar.fishSwappedDirection(
            fishDirection,
            fishLastSwapAt,
            fishLastSwapPosition
          );
        }
      }
    );

    progressBar = ProgressBar(fishSpeed, () => {
      if (fish) {
        fish.finish();
      }
      finishCallback();
    });

    progressBar.start();
    catchBar.start();
    fish.start();
  };

  const getInfo = () => {
    return {
      progressBar: progressBar.getInfo(),
      catchBar: catchBar.getInfo(),
      fish: fish.getInfo(),
    };
  };

  const updateCatchBarDirection = (direction) => {
    catchBar.updateDirection(direction);
  };

  return {
    start,
    getInfo,
    updateCatchBarDirection,
  };
}
