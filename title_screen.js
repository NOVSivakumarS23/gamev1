class title_screen extends Phaser.Scene {
  definekeys() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  constructor() {
    super("bootGame");
  }
  create() {
    this.add.text(250, 200, "INSERT GAME NAME HERE", { font: "40px Arial" });
    this.add.text(350, 300, "press enter to start", { font: "20px Arial" });
    this.definekeys();
  }
  update() {
    if (this.space.isDown || this.enter.isDown) {
      this.scene.start("playGame", { level:0})
    }
  }
}