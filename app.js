import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import path from "path";

import Game from "./game.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
const publicFolder = path.join(__dirname, "/public");
app.use(express.static(publicFolder));

const game = Game();

// Implement your endpoints here...
app.get("/cast_line", (req, res) => {
  const playerState = game.castLine();
  if (result !== "line_cast") {
    return res.status(400).json({ errorCode: result });
  }
  return res.status(200).json({ playerState: result });
});

app.get("/wait_for_bite", (req, res) => {
  game
    .waitForBite()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((errorCode) => {
      res.status(400).json({ errorCode });
    });
});

app.get("/reel_in", (req, res) => {
  const result = game.reelIn();
  if (result.errorCode) {
    return res.status(400).json(result);
  }
  return res.status(200).json(result);
});

app.get("/get_mini_game_info", (req, res) => {
  const gameInfo = game.getCatchingMiniGameInfo();
  return res.status(200).json(gameInfo);
});

app.get("/move_catch_bar_up", (req, res) => {
  game.updateCatchBarDirection("up");
  res.status(200).json({ success: true });
});

app.get("/stop_moving_catch_bar_up", (req, res) => {
  game.updateCatchBarDirection("none");
  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
