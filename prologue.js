export default class prologue extends Phaser.Scene {
  definekeys() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }
  constructor() {
    super("prologue");
  }
  preload() {
    this.t = 0
    this.load.image('cloud3', 'bg_images/cloud3.png');
    this.load.image('logo', 'bg_images/logo.png');
    this.load.image('sword', 'bg_images/sword.png');
    this.load.image('cloud2', 'bg_images/cloud2.png');
    this.load.image('cloud4', 'bg_images/cloud4.png');

    this.load.image('picture', 'bg_images/picture.png');

    this.txt = "A NOT SO WISE OLD MAN: young lad, have you heard of...\n                      the legend of the dream walker"
    this.txt1 = "A NOT SO WISE OLD MAN: well, Once upon a time, there was an ordinary boy called timmy, who did ordinary things. \n                             He went to school, played video games, and ate quite a lot of oreos..."
    this.txt2 = "          A NOT SO WISE OLD MAN: But one fateful night, all that changed...\n that night, timmy tucked himself into bed just like any other night and drifted into sleep..."
    this.txt3 = "A NOT SO WISE OLD MAN: In his dream, he was surrounded by a dark void and he saw a glowing light in the distance...\n     young timmy started running toward the light, but no matter how much he ran, he couldn't reach it..."
    this.txt4 = "A NOT SO WISE OLD MAN: but as he was running, he tripped and fell deeper and deeper into the void. \n           timmy started to fall faster... and faster... and faster... until he lost track of time"
    this.txt5 = "A NOT SO WISE OLD MAN: When little timmys eyes finnaly opened, he found himself in a strange world.\n He found himself in the world of dreams, hopes, and fears. The world full of wizards, cats, kings and queens\n and knights,goblins and dragons, talking ladders and snail salesmen, and a world of magic and wonder.\n                                              he found himself in the world of... OCTARIA\n"

    this.show = ""
    this.index = 0
    this.y_off = -200
    this.y_fall = 0
    this.load.image('prologue_box', 'ui_sprites/prologue_box.png');
    this.load.image('wizard', 'char_sprites/wizard.png');

    this.load.image('falling', 'bg_images/falling.png');
    this.load.spritesheet('woosh', 'player_sprite/woosh.png', {
      frameWidth: 180, frameHeight: 180
    });

  }
  create() {
    this.fade_t = 0;
    this.add.rectangle(0, 0, 3000, 2000).setFillStyle(0x2B3766)

    this.add.rectangle(600, 0, 1300, 100).setFillStyle(0x4880a1)
    this.add.rectangle(600, 700, 1300, 200).setFillStyle(0x4880a1)
    this.add.rectangle(0, 350, 200, 800).setFillStyle(0x4880a1)
    this.add.rectangle(1200, 350, 200, 800).setFillStyle(0x4880a1)

    this.physics.add.image(650, 250, 'cloud3').setImmovable(true)
    this.physics.add.image(550, 340, 'cloud3').setImmovable(true).setFlipX(true)
    this.physics.add.image(600, 100, 'cloud3').setImmovable(true).setFlipY(true).setFlipX(true)
    this.physics.add.image(600, 100, 'cloud3').setImmovable(true).setFlipY(true)

    this.physics.add.image(700, 400, 'cloud4').setImmovable(true)
    this.physics.add.image(350, 370, 'cloud4').setImmovable(true).setFlipX(true)


    this.box = this.add.image(600, 550 + this.y_off, 'prologue_box')
    this.anims.create({ key: "wooshing", frames: this.anims.generateFrameNumbers("woosh", { start: 0, end: 17 }), frameRate: 8, repeat: 0 });
    this.sprite = this.add.sprite(600, -200, 'woosh')
    this.text = this.add.text(360, 470, this.show, { font: "15px cursive" });
    this.text.setLineSpacing(18)
    //this.fade = this.add.rectangle(600,400,1300,800)
    //this.fade.setFillStyle(0x000000, 1)
    this.definekeys();
    this.physics.add.image(610, 580, 'wizard').setImmovable(true)
    this.fade = this.add.rectangle(600, 400, 1300, 800)
    this.fade.setFillStyle(0x000000, 0)
  }
  update() {
    if (this.fade_t <= 1) { this.fade.setFillStyle(0x000000, 1 - (this.fade_t)) }
    else (this.fade.setFillStyle(0x000000, 0))
    this.update_txt();
    if (this.t > 150 && this.index == 0) {
      this.index = 1
      this.text.setText("")
      this.text.x = 200
      this.text.y = 470 + this.y_off
      this.txt = this.txt1
      this.t = 0
    } if (this.t > 270 && this.index == 1) {
      this.index = 2
      this.text.setText("")
      this.text.x = 300
      this.text.y = 470 + this.y_off
      this.txt = this.txt2
      this.t = 0
    } if (this.t > 260 && this.index == 2) {
      this.index = 3
      this.text.setText("")
      this.text.x = 200
      this.text.y = 470 + this.y_off
      this.txt = this.txt3
      this.t = 0
    } if (this.t > 240 && this.index == 3) {
      this.index = 4
      this.text.setText("")
      this.text.x = 230
      this.text.y = 470 + this.y_off
      this.txt = this.txt4
      this.t = 0

    } if (this.t > 300 && this.index == 4) {
      this.index = 5
      this.text.x = 200
      this.text.y = 450
      this.txt = this.txt5
      this.t = 0

    } if (this.t > 300 && (this.space.isDown || this.enter.isDown)) {
      this.scene.start("playGame", { level: 0 })
    }
    this.t = this.t + 0.5
  }
  update_txt() {
    this.show = ""
    for (var i = 0; i < this.txt.length; i++) {
      if (i >= this.t) { break }
      this.show += this.txt[i]
    }
    if (this.index == 4) {
      this.y_off = -200 + ((this.t / 300) * 200)
      this.y_fall = ((this.t) * (this.t)) / 200
    }
    if (this.index == 5 && this.t > 30) {
      this.sprite.anims.play("wooshing", true)
    }
    if (this.index == 5 && this.t > 90) {
      this.y_fall = -200
    }
    this.text.setText(this.show)
    this.text.y = 270
    //this.box.y = 550+this.y_off
    //this.sprite.y = -150+this.y_fall
    this.fade_t += 0.01;
  }
}