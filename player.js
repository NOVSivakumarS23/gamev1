export default class Player {
//todo, cyote wall jump and jump, moving platform wall jump, 
  constructor(scene, physics, keylogger, dialogue) {
    this.scene = scene;
    this.physics = physics;
    this.keys = keylogger
    this.dialogue = dialogue
    this.hitbox_x = 50
    this.hitbox_y = 60

    this.g = 20;
    this.speed = 200;
    this.jump = 800;
    this.spring_jump = 800;
    this.max_speed = 1000;
    this.die_time = 50;

    this.walled = 0
    this.wall_dir = 0
    this.wall_slide_speed = 85
    this.v0 = [0,0]
    this.wall_time = 50;
    this.wall_boost = 1.2;
    this.spring_boost = 4
    this.spring_boost_time = 25
    this.spring_bump_jump = 800
    
    this.action = "MOVE";
    this.old_action = "MOVE";
    this.grounded = false;
    this.springy_gnd = false;
    this.damage = 0;
    this.hearts = 1
    this.dialogue_list = null;
    this.spring_dir = null;
    this.spring_down_force = 300
    this.win = -1;
    this.t = 0;
  }

  create() {
    this.player = this.scene.add.rectangle(200, 200, this.hitbox_x, this.hitbox_y);
    this.player.setFillStyle(0xf0f0ff, 0)
    this.scene.physics.add.existing(this.player);
    this.body = this.player.body
    this.v = [0, 0]
  }
  
  update() {
    this.grounded = this.player.body.onFloor();
    if(this.moving_gnd == true){this.grounded=true}
    this.wall_check();
    this.switch_action();
    
    if (this.action == "MOVE") {
      this.move();
    }else if(this.action == "JUMP"){
      this.j();
    }else if(this.action == "WALLJUMP"){
      this.wall_jump();
    }else if(this.action == "WALLSLIDE"){
      this.wall_slide();
    }else if(this.action == "TALK"){
      this.talk();
    }else if(this.action == "DIE"){
      this.die();
    }else if(this.action == "WIN"){
      this.w();
    }else if(this.action == "SPRING_JUMP"){
      this.springy_jump();
    }else if(this.action == "SPRING_BUMP"){
      this.spring_bump();
    }else if(this.action == "SPRING_DOWN"){
      this.spring_down();
    }

    this.clamp_speed()
    this.player.body.setVelocityX(this.v[0])
    this.player.body.setVelocityY(this.v[1])
    this.v = [0, 0]
    this.v0 = [this.body.velocity.x, this.body.velocity.y]
    this.t++
    this.moving_gnd = false
  }
  
  wall_check(){
    this.walled = 0
    if(this.v0[0]<0 && this.body.velocity.x==0){this.walled = 1}
    if(this.v0[0]>0 && this.body.velocity.x==0){this.walled = -1}
  }
  
  switch_action(){
    if(this.grounded == true && this.action!="TALK" && this.action!="DIE"){
      this.action = "MOVE"
    }if(this.grounded==true && this.keys.J_btn && this.action!="DIE"){
      this.action = "JUMP"
    }if(!this.grounded && this.walled!=0 && this.body.velocity.y>0 && this.action!="DIE"){
      this.wall_dir = this.walled
      this.action = "WALLSLIDE"
    }if(!this.grounded && this.keys.J_btn && (this.walled!=0) && this.action!="DIE"){
      this.action = "WALLJUMP"
      this.wall_dir = this.walled
    }if(this.keys.K_btn && this.dialogue_obj!=null && this.action == "MOVE" && this.action!="DIE"){
      this.dialogue.new_dialogue(this.dialogue_obj)
      this.action="TALK"
    }if(this.damage>=this.hearts && this.action !="DIE"){
      this.action = "DIE"
    }if(this.win!=-1 && this.action !="DIE" && this.action !="WIN"){
      this.action = "WIN"
    }if(this.action != "DIE" && this.springy_gnd && this.spring_dir == 0){
      this.action = "SPRING_JUMP"
      this.t = 0
    }if(this.action != "DIE"  && this.springy_gnd && (this.spring_dir == 90 || this.spring_dir == -90)){
      this.action = "SPRING_BUMP"
      this.wall_dir = this.spring_dir/90
      this.t = 0
    }if(this.action != "DIE"  && this.springy_gnd && this.spring_dir==180){
      this.action = "SPRING_DOWN"
      this.t = 0
    }

    this.dialogue.update(this.dialogue_obj)
    if(this.action != this.old_action){this.t = 0}
    this.old_action = this.action;
    this.springy_gnd = false
    this.dialogue_obj = null
    if(this.action != "WIN"){this.win = -1}
  }

  clamp_speed(){
    if(this.v[0] > this.max_speed){
      this.v[0] = this.max_speed
    }else if(this.v[0] < -this.max_speed){
      this.v[0] = -this.max_speed
    }
    if(this.v[1] > this.max_speed){
      this.v[1] = this.max_speed
    }else if(this.v[1] < -this.max_speed){
      this.v[1] = -this.max_speed
    }
  }
  
  move() {
    this.v[0] = (this.keys.Njoy[0]*this.speed)
    this.v[1] = (this.body.velocity.y+this.g)
  }

  j(){
    if(this.t==0){
      this.v[1]=(-this.jump+this.g)
    }else{
      this.v[1]=(this.body.velocity.y+this.g)
    }
    this.v[0]=this.keys.Njoy[0]*this.speed
  }
  
  wall_jump(){
    if(this.t==0){
      this.v[1] = (-this.jump+this.g)
    }else{
      this.v[1] = (this.body.velocity.y+this.g)
    }
    var frac = 0;
    if(this.t<this.wall_time){
      frac = 1-(this.t/this.wall_time);
    }
    this.v[0] = ((this.wall_dir*this.speed*frac*this.wall_boost)+(this.keys.Njoy[0]*this.speed*(1-frac)))
  }

  wall_slide(){
    this.v[0] = this.keys.Njoy[0]*this.speed
    var slide_speed = this.wall_slide_speed
    if(this.body.velocity.y<slide_speed){slide_speed=this.body.velocity.y+this.g}
    this.v[1] = slide_speed
    if(this.walled==0){
      this.action="MOVE"
    }
  }
  talk(){
    if(this.keys.K_btn || this.keys.J_btn){
      this.dialogue.next()
    }
    if(this.dialogue.hide==true){
      this.action ="MOVE"
    }
    this.dialogue.update_cursor(this.keys.Njoy[0])
  }
  die(){
    this.v = [0,0]
  }
  w(){
    this.v = [0,0]
  }
  springy_jump(){
    if(this.t==0){
      this.v[1]=(-this.spring_jump+this.g)
    }else{
      this.v[1]=(this.body.velocity.y+this.g)
    }
    this.v[0]=this.keys.Njoy[0]*this.speed
  }
  spring_bump(){
    if(this.t==0){
      this.v[1] = (-this.spring_bump_jump+this.g)
    }else{
      this.v[1] = (this.body.velocity.y+this.g)
    }
    var frac = 0;
    if(this.t<this.spring_boost_time){
      frac = 1-(this.t/this.spring_boost_time);
    }
    this.v[0] = ((this.wall_dir*this.speed*frac*this.spring_boost)+(this.keys.Njoy[0]*this.speed*(1-frac)))
  }
  spring_down(){
    if(this.t==0){
      this.v[1]=(this.spring_down_force+this.g)
    }else{
      this.v[1]=(this.body.velocity.y+this.g)
    }
    this.v[0]=this.keys.Njoy[0]*this.speed
  }
}
  