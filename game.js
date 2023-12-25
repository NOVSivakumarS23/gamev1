import main_loop from "./main_loop.js";
import end_screen from "./end_screen.js";

console.log("i")
var config = {
  height: 700,
  width: 1200,
  physics: {
        default: 'arcade',
        arcade: {debug: true}
    },
  scene: [title_screen, main_loop, end_screen]
}

var game = new Phaser.Game(config);
