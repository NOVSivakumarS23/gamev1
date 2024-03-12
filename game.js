import main_loop from "./main_loop.js";
import end_screen from "./end_screen.js";
import title_screen from "./title_screen.js";
import prologue from "./prologue.js";

console.log("hi")
var config = {
  height: 700,
  width: 1200,
  physics: {
        default: 'arcade',
        arcade: {debug: false}
    },
  scene: [precredit, prologue, title_screen,main_loop, end_screen]
}

console.log("hi")
var game = new Phaser.Game(config);
