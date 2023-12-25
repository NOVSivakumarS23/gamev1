export default class moving_platform {
//types of moving platforms, sin with wait, linear with wait, warp
  constructor(scene, physics, obj) {
    this.scene = scene
    this.physics = physics
    this.obj = obj
    this.ax = this.obj.properties[0].value
    this.ay = this.obj.properties[1].value
    this.semisolid = this.obj.properties[2].value
    this.sprite = this.obj.properties[3].value
    this.t = this.obj.properties[4].value
    this.wait = this.obj.properties[5].value
    this.warp = this.obj.properties[6].value
    this.x = this.obj.x
    this.y = this.obj.y
    this.count = 0
    this.dir = -1
    this.action = "GO"
    this.ease = 5
  }
  create(){
    this.platform = this.scene.physics.add.sprite(this.x, this.y).setImmovable(true)
    this.platform.body.setSize(500,50,0,0)
  }
  update(){
    if(this.action=="GO"){
      this.go();
    }else if(this.action=="WAIT"){
      this.stall();
    }
    this.count++;
  }
  go(){
    this.platform.body.setVelocityY(this.ax*this.dir)
    this.platform.body.setVelocityX(this.ay*this.dir)
    if(this.count>=this.t){
      this.action = "WAIT"
      this.count = 0
    }
  }
  stall(){
    this.platform.body.setVelocityY(this.ay*this.dir*(1/(this.count)))
    this.platform.body.setVelocityX(0)
    if(this.count>=this.wait){
      this.action = "GO"
      this.dir = 0-this.dir
      this.count = 0
    }
  }
}