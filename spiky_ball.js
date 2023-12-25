export default class spiky_ball {
//todo, cyote wall jump and jump, moving platform wall jump, 
  constructor(scene, x, y, physics) {
    this.scene = scene
    this.physics = physics
    this.x = x
    this.y = y
    this.speed = 100
    this.g = 20
    this.v=[0,0]
    this.max_speed = 1000;
    this.walled = 1
    this.v0 = [0,0]
    this.jump_force = 600
    this.rotate_speed = 1
  }
  create(){
    this.circle = this.scene.physics.add.sprite(this.x, this.y).setCircle(20, -5, -5);
    this.scene.physics.add.existing(this.circle);
    this.box = this.scene.physics.add.sprite(this.x, this.y, "spiky_ball")
    this.physics.add.collider(this.box, this.scene.lvl.solid_layer);

  }
  update(){
    
    this.clamp_speed()
    this.wall_check()
    this.v[0] = 100*this.walled
    if(this.box.body.onFloor()){
      this.v[1] = -this.jump_force
    }else{this.v[1] = (this.box.body.velocity.y+this.g)}
    this.box.angle += this.rotate_speed*this.walled
    this.circle.x = this.box.x
    this.circle.y = this.box.y
    this.box.body.setVelocityX(this.v[0])
    this.box.body.setVelocityY(this.v[1])
    this.v = [0, 0]
    this.v0 = [this.box.body.velocity.x, this.box.body.velocity.y]

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
  wall_check(){
    if(this.v0[0]<0 && this.box.body.velocity.x==0){this.walled = 1}
    if(this.v0[0]>0 && this.box.body.velocity.x==0){this.walled = -1}
  }
}