import sprite_loader from "./sprite_loader.js";
import moving_platform from "./moving_platform.js";
import spiky_ball from "./spiky_ball";


export default class level_loader {
  constructor(scene, player, lvl){
    this.scene = scene
    this.player = player
    this.lvl = lvl
    this.player_body = this.player.player
    this.sprite_loader = new sprite_loader(this.scene);
    this.dialogue_list = []
    this.portal_list = []
    this.moving_platform_list = []
    this.spiky_ball_list = []
    this.sprite_sizes = {"wizzy":[100,100], "wizard":[100,135]}
    this.block_sizes = {"spring":[32,32]}
  }
  preload(){
    this.sprite_loader.load_sprites();
  }
  
  create(){
    this.map = this.scene.add.tilemap("test_map")
    var tileset = this.map.addTilesetImage("test", "test_tileset")
    this.background = this.map.createLayer("background", tileset)
    this.solid_layer = this.map.createLayer('solids', tileset, 0, 0);
    this.foreground = this.map.createLayer("foreground", tileset)
    this.sprite_loader.load_anims()
    this.solid_layer.setCollisionByExclusion(-1, true);
  }
  create_collisions(){
    this.create_damage_layer()
    this.create_spring_layer()
    this.create_dialogue_layer()
    this.create_crumbly_layer()
    this.create_portal_layer()
    this.create_moving_platforms()
    this.create_semisolids();
  }

  create_damage_layer(){
    this.damage_layer = this.map.getObjectLayer("damage_box")
    this.damage_layer.objects.forEach(objData => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData
      var s = this.scene.physics.add.staticSprite(x+16, y+16);
      s.body.setSize(width, height, 0, 0);
      this.scene.physics.add.collider(this.player, s, null, this.damage_check, this);
    })
  }
  create_spring_layer(){
    this.springs = this.scene.physics.add.staticGroup();
    this.spring_layer = this.map.getObjectLayer("springs")
    this.spring_layer.objects.forEach(objData => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData
      var dir = objData.properties[0].value
      var x_off = 0
      var y_off = 0
      var angle = 0
      if(dir==0){
        y_off = -32
      }
      if(dir==1){
        angle = -90
        x_off = -32
      }
      if(dir==2){angle = 90}
      if(dir==3){angle = 180}
      var s = this.scene.physics.add.staticSprite(x+16+x_off, y+16+y_off, "spring");
      s.angle = angle
      this.scene.physics.add.collider(this.player, s, null, this.check_spring_collision, this);
    })
  } 
  create_dialogue_layer(){
    this.dialogue_layer = this.map.getObjectLayer("dialogue_box")
    this.dialogue_layer.objects.forEach(objData => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData
      var temp = JSON.parse(JSON.stringify(objData));
      var sprite = (objData.properties[4].value)
      var w = this.sprite_sizes[sprite][0]
      var h = this.sprite_sizes[sprite][1]
      temp.h = h
      temp.w = w
      var s = this.scene.physics.add.sprite(x, y-(h/2), sprite)
      this.dialogue_list.push(temp)

      this.scene.physics.add.collider(this.player, s, null, this.dialogue_check, this);

    })
  }
  create_crumbly_layer(){
    this.crumbly = this.scene.physics.add.staticGroup();
    this.crumbly_layer = this.map.getObjectLayer("crumbly")
    this.crumbly_layer.objects.forEach(objData => {
      const {x=0, y=0, name, width = 0, height = 0} = objData
      this.crumbly.create(x+16, y+16-this.sprite_loader.block_sizes.crumbly[1], 'crumbly');
    })
    this.scene.physics.add.collider(this.player, this.crumbly, this.crumble, this.check_collision, this);

  }
  create_portal_layer(){
    this.portal_layer = this.map.getObjectLayer("portal")
    this.portal_layer.objects.forEach(objData => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData
      this.portal_list.push(objData)
      var s = this.scene.physics.add.staticSprite(x+16, y+16);
      s.body.setSize(width, height, 0, 0);
      this.scene.physics.add.collider(this.player, s, null, this.check_portal, this);

    })
  }
  create_moving_platforms(){
    this.moving_layer = this.map.getObjectLayer("moving_platforms")
    this.moving_layer.objects.forEach(objData => {
      const {x = 0, y = 0, name, width = 0, height = 0} = objData
      var m = new moving_platform(this.scene, this.scene.physics, objData)
      m.create()
      this.moving_platform_list.push(m)
      if(m.semisolid==true){
        this.scene.physics.add.collider(this.player, m.platform, null, this.check_moving_semisolid_collision, this);
      }else{
        this.scene.physics.add.collider(this.player, m.platform, null, this.check_moving_collision, this);
      }
    })
  }
  create_semisolids(){
    this.semisolids = this.map.getObjectLayer("semisolid")
    this.semisolids.objects.forEach(objData => {
      const {x = 0, y = 0, name, width = 0, height = 0} = objData
      var sprite = objData.properties[0].value
      if(sprite=="null"){
        var s = this.scene.physics.add.staticSprite(x+16, y+16);
        s.body.setSize(width, height, 0, 0);
        this.scene.physics.add.collider(this.player, s, null, this.check_semisolid_collision, this);
      }else{
        var s = this.scene.physics.add.staticSprite(x+16, y+16, sprite);
        this.scene.physics.add.collider(this.player, s, null, this.check_semisolid_collision, this);
      }
    })
  }
  create_spiky_balls(){
    this.spiky_balls = this.map.getObjectLayer("spiky_ball")
    this.spiky_balls.objects.forEach(objData => {
      const {x=0, y=0, name, width = 0, height = 0} = objData
      var s = new spiky_ball(this.scene,objData.x, objData.y, this.scene.physics)
      this.spiky_ball_list.push(s)
    })
      
  }
  damage_check(player, spike) {
    this.player.damage++
    return true;
  }
  check_spring_collision(player,spring){
    console.log(spring.angle)
    spring.anims.play("boing", true)
    this.player.springy_gnd = true
    this.player.spring_dir = spring.angle
    return false
  }
  crumble(player,crumbly){
    crumbly.anims.play("crumble", true)
    var ourScene = this.scene;
    var tween = this.scene.tweens.add({
      targets: crumbly,
      yoyo: true,
      repeat: 10,
      ease: 'Linear',
      duration: 50,
      x: {from: crumbly.x,to: crumbly.x},
      onComplete: function() {
        crumbly.destroy()
      }
    });
  }
  check_portal(player,portal){
    for(var i = 0; i < this.portal_list.length; i++){
      var obj = this.portal_list[i]
      if(obj.x == portal.x-16 && obj.y == portal.y-16){
        console.log(obj.properties[0].value)
        this.player.win = obj.properties[0].value
        break;
      }
    }
    return false;
  }
  check_collision(player, oneway) {
    return true;
  }
  dialogue_check(player, dialogue) {
    if(this.scene.player.action=="TALK"){
      if(player.x>dialogue.x){dialogue.setFlipX(true)}
      if(player.x<dialogue.x){
        dialogue.setFlipX(false)
      }
    }
    for(var i = 0; i < this.dialogue_list.length; i++){
      var obj = this.dialogue_list[i]
      if(obj.x == dialogue.x && obj.y == dialogue.y+(obj.h/2)){
        this.player.dialogue_obj = obj
        break;
      }
    }
    return false;
  }
  check_moving_collision(player, platform){
    if(player.y < platform.y){
      this.scene.player.moving_gnd = true
    }
    return true
  }
  check_moving_semisolid_collision(player, platform){
    if(player.y < platform.y){
      this.scene.player.moving_gnd = true
    }
    if(player.y < platform.y){return true}
    else{return false}
  }
  trigger_collision(player,dialogue){
    return false;
  }
  check_semisolid_collision(player, platform){
    if(player.y < platform.y){return true}
    else{return false}
  }
  update(){
    for(var i=0; i<this.moving_platform_list.length; i++){
      this.moving_platform_list[i].update()
    }
  }
}