import {
  DIFFICULTY_TO_FISH_SPEED,
  PROGRESS_BAR_INITIAL_POSITION,
} from "./public/globals.js";

const fish = require("./fish.js");
const catchBar = require("./catch_bar.js");
const progressBar = require("./progress_bar.js");

export default function CatchingMinigame(finishCallback) {
  let progressBar = undefined;
  let catchBar = undefined;
  let fish = undefined;

  const start = (difficulty) => {
    let fishSpeed = DIFFICULTY_TO_FISH_SPEED[difficulty];
    progressBar = new ProgressBar(fishSpeed);
    catchBar = new CatchBar();
    fish = new Fish(fishSpeed);
  };

  const getInfo = () => {
    return {
      progressBar: progressBar.getInfo(),
      catchBar: catchBar.getInfo(),
      fish: fish.getInfo(),
    };
  }

  const updateCatchBarDirection = (direction) => {
    catchBar.updateDirection(direction);
  };

  return {
    start,
    getInfo,
    updateCatchBarDirection,
  };
}
