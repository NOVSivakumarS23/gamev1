import Player from "./player.js";
import Keylog from "./keylog.js";
import dialogue_system from "./dialogue_system.js";
import level_loader from "./level_loader.js";

const max_lvl = 0
var rep = 0;
//TODO: moving platforms, draw tilesets and spikes, add music, add snitch, 
//kinda TODO: redraw spiky_ball sprite, bloom, 
export default class main_loop extends Phaser.Scene {
  currentLevel
  init(props) {
    const { level = 0 } = props
    this.currentLevel = level
  }
  constructor() {
    super("playGame");
  }
  preload() {
    this.rep = rep
    this.keylogger = new Keylog(this);
    this.speech_bubble = new dialogue_system(this)
    this.player = new Player(this, this.physics, this.keylogger, this.speech_bubble);
    this.lvl = new level_loader(this, this.player, this.currentLevel)
    this.speech_bubble.preload();
    this.lvl.preload();

  }
  create() {
    this.keylogger.create();
    this.lvl.create();
    this.lvl.create_collisions();

    this.player_body = this.player.player

    this.cameras.main.startFollow(this.player_body)
    this.cameras.main.setBounds(0, 0, (this.lvl.map.width * 32), this.lvl.map.height * 32, false);

    this.physics.add.collider(this.player_body, this.lvl.solid_layer);
    this.speech_bubble.create();

    this.physics.world.TILE_BIAS = 64;

  }
  update() {
    this.keylogger.update()
    this.lvl.update()
    if (this.player.action == "DIE" && this.player.t > 50) {
      rep++
      this.scene.restart({ level: this.currentLevel })
    } else if (this.player.action == "WIN" && this.player.t > 100) {
      rep = 0
      if (this.player.win > max_lvl) {
        this.scene.start("endgame")
      } else { this.scene.restart({ level: this.player.win }) }
    }
    /*if(moving_ground==true){
      grounded = true
    }
    moving_ground = false*/
    this.player.update()
    this.keylogger.late_update()
  }

}