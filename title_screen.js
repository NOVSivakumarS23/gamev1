export default class title_screen extends Phaser.Scene {
  definekeys() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  constructor() {
    super("titleGame");
  }
  preload() {
    this.load.image('cloud1', 'bg_images/cloud1.png');
    this.load.image('logo', 'bg_images/logo.png');
    this.load.image('sword', 'bg_images/sword.png');
    this.load.image('cloud2', 'bg_images/cloud2.png');
    this.load.image('picture', 'bg_images/picture.png');

    this.t = 0

  }
  create() {
    var bg = this.add.rectangle(600, 400, 1300, 800)
    bg.setFillStyle(0xb05aad)
    this.add.rectangle(600, 0, 1300, 100).setFillStyle(0xcc689d)
    this.add.rectangle(600, 700, 1300, 200).setFillStyle(0xcc689d)
    this.add.rectangle(0, 350, 200, 800).setFillStyle(0xcc689d)
    this.add.rectangle(1200, 350, 200, 800).setFillStyle(0xcc689d)

    this.physics.add.image(650, 250, 'cloud1').setImmovable(true)
    this.physics.add.image(600, 340, 'cloud1').setImmovable(true).setFlipX(true)
    this.physics.add.image(600, 100, 'cloud1').setImmovable(true).setFlipY(true).setFlipX(true)
    this.physics.add.image(600, 100, 'cloud1').setImmovable(true).setFlipY(true)

    //this.physics.add.image(550, 350, 'sword').setImmovable(true)
    this.physics.add.image(620, 400, 'logo').setImmovable(true)

    this.physics.add.image(700, 400, 'cloud2').setImmovable(true)
    this.physics.add.image(350, 370, 'cloud2').setImmovable(true).setFlipX(true)

    this.physics.add.image(640, 460, 'picture').setImmovable(true)


    this.add.text(500, 650, "press  enter  to  start", { font: "20px Arial" });
    this.fade = this.add.rectangle(600, 400, 1300, 800)
    this.fade.setFillStyle(0x000000, 0)
    this.definekeys();
  }
  update() {
    if (this.t <= 1) { this.fade.setFillStyle(0x000000, 1 - this.t) }
    else (this.fade.setFillStyle(0x000000, 0))
    if (this.t > 1.5 && (this.space.isDown || this.enter.isDown)) {
      this.scene.start("prologue")
    }
    this.t = this.t + 0.01
  }
}