import { fileURLToPath } from "url";
import cors from "cors";
import path from "path";
import express from "express";

const Game = require("./game.js");

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
  playerState = game.castLine();
  return res.json({ playerState });
});

app.get("/wait_for_bite", (req, res) => {});

app.get("/reel_in", (req, res) => {});

app.get("/get_mini_game_info", (req, res) => {});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
