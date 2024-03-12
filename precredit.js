class precredit extends Phaser.Scene {
  
  constructor() {
    super("bootGame");
  }
  preload(){
    this.t = 0
    this.txt = "A game made by milpitas high school TSA"


  }
  create() {
    this.add.text(450, 300, "A game made by milpitas TSA", { font: "20px cursive" });
  }
  update() {
    this.scene.start("playGame", { level: 0 })
    if(this.t>=100){this.scene.start("titleGame")}
    this.t++
  }
}