import { computeFishTimeToNextSwap, computeFishCurrentPosition, FISH_MAX_POS } from "./public/globals.js";
export default function Fish(speed, swappedDirectionCallback){
    let lastSwapPosition = undefined;
    let lastSwapAt = undefined;
    let direction =  undefined;

    const start = () => {
        direction = 'up';
        lastSwapAt = 0;
        lastSwapPosition = 0.0;
        swappedDirectionCallback(direction);
        timer = setTimeout(swapDirection,computeFishCurrentPosition(direction, lastSwapAt, lastSwapPosition, speed))
    }

    const getInfo = () => {
        return{
            'direction' : direction,
            'lastSwapAt' : lastSwapAt,
            'lastSwapPosition' : lastSwapPosition
        }
    }

    const finish = () => {
            clearTimeout(timer);
    }
    
    return{
        start,
        getInfo,
        finish
    };
}