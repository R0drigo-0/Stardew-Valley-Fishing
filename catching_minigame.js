import {
  DIFFICULTY_TO_FISH_SPEED,
} from "./public/globals.js";

import Fish from "./fish.js";
import CatchBar from "./catch_bar.js";
import ProgressBar from "./progress_bar.js";

export default function CatchingMinigame(finishCallback) {
  let progress_bar = undefined;
  let catch_bar = undefined;
  let fish = undefined;
  let fishSpeed = undefined;

  //variables para el catch bar


  const start = (difficulty) => {
    
     fishSpeed = DIFFICULTY_TO_FISH_SPEED[difficulty];
     console.log(`fishSpeed: ${fishSpeed}`);

     //Initzialitzacio de variables locals
      

     progress_bar = ProgressBar(fishSpeed,()=>{
      finishCallback();
      fish.finish();
      console.log(`progress_bar finished`);
      
     })
     fish = Fish(fishSpeed,progress_bar.fishSwappedDirection);
     catch_bar = CatchBar(progress_bar.catchBarSwappedDirection);
    progress_bar.start();
    catch_bar.start();
    fish.start();
    
    
    }
    
    
    const getInfo = () => {
      
      return {
        'progressBarInfo': progress_bar.getInfo(),
        'catchBarInfo': catch_bar.getInfo(),
        'fishInfo': fish.getInfo()
      };
    }

    const updateCatchBarDirection = (newDirection) => {
      catch_bar.updateDirection(newDirection);
    }

    return {
      start,
      getInfo,
      updateCatchBarDirection,
    };
}
