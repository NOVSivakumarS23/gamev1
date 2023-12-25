export default class sprite_loader {
  constructor(scene){
    this.scene = scene
    this.sprite_sizes = {"wizzy":[100,100], "wizard":[100,135]}
    this.block_sizes = {"spring":[32,32], "crumbly":[32,32]}
  }
  load_sprites(){
    this.scene.load.image("test_tileset", "tilemaps/test_map.png")
    this.scene.load.tilemapTiledJSON("test_map", "levels/test.json")
    this.scene.load.spritesheet('wizzy', 'char_sprites/wizzy.png',{
      frameWidth:this.sprite_sizes.wizzy[0], frameHeight:this.sprite_sizes.wizzy[1]});
    this.scene.load.spritesheet('wizard', 'char_sprites/wizard.png',{
      frameWidth:this.sprite_sizes.wizard[0], frameHeight:this.sprite_sizes.wizard[1]});
    this.scene.load.spritesheet("spring", "block_sprites/spring.png",{
      frameWidth:this.block_sizes.spring[0], frameHeight:this.block_sizes.spring[1]});
    this.scene.load.spritesheet("crumbly", "block_sprites/crumbly.png",{
      frameWidth:this.block_sizes.crumbly[0], frameHeight:this.block_sizes.crumbly[1]});
    this.scene.load.spritesheet("spiky_ball", "block_sprites/spiky_ball.png",{
      frameWidth:80, frameHeight:80});
  }
  load_anims(){
    this.scene.anims.create({key: "boing", frames:this.scene.anims.generateFrameNumbers("spring",{ start: 1, end: 4 }),frameRate: 12,repeat: 0});  
    this.scene.anims.create({key: "crumble", frames: this.scene.anims.generateFrameNumbers("crumbly",{ start: 0, end: 12 }),frameRate: 10,repeat: -1});
    this.scene.anims.create({key: "not_crumble", frames: [{ key: "crumbly", frame: 0 }],frameRate: 20,});
  }
}
