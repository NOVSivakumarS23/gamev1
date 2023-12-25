export default class end_screen extends Phaser.Scene {
  definekeys() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  constructor() {
    super("endgame");
  }
  create() {
    this.add.text(250, 200, "THIS IS THE END OF THE GAME!!!", { font: "40px Arial" });
    this.add.text(300, 300, "press enter to go back to the title screen, (insert credits here)", { font: "20px Arial" });
    this.definekeys();
  }
  update() {
    if (this.space.isDown || this.enter.isDown) {
      this.scene.start("bootGame")
    }
  }
}