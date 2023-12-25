export default class dialogue_system {
  constructor(scene) {
    this.scene = scene
    this.x = 200
    this.speed = 0.5
    this.y = 1000
    this.speech = "hello testing testing"
    this.t = 0
    this.hide = true
    
    this.paragraph = ["Hello!","I'm Bob.","I'm a robot.","I'm here to help you"]
    this.options = [[],[],["yes", "no"],[]]
    this.indices = [[1], [2], [1,3], [4]]
    
    this.current_options = ["yes", "no"]
    this.option_line = "---"
    this.cursor = 0;
    this.scroll = true;
    this.max_char = 40
    this.size = "13px"
    this.line_no = 0
  }
  preload() {
    this.scene.load.image('dialogue_box', 'ui_sprites/dialogue_box.png');
    this.scene.load.image('speech_prompt', 'ui_sprites/speech_prompt.png');
  }
  create() {
    this.speech_box = this.scene.physics.add.sprite(0, 0, "dialogue_box");
    this.text = this.scene.add.text(0, 0, 'Hello, World!', {
      fontFamily: 'Arial',
      fontSize: this.size,
      color: '#000'
    })
    this.speech_prompt = this.scene.add.sprite(0, 0, "speech_prompt");
  }
  format_options(){
    if(this.current_options.length ==1){return}
    var char_length = this.current_options[0].length+this.current_options[1].length+6
    var add = Math.ceil((this.max_char-char_length)/2)

    var opt1 = this.current_options[0]
    var opt2 = this.current_options[1]
    if(this.cursor == 0){opt1 = "> "+ opt1}
    if(this.cursor == 1){opt2 = "> " + opt2}

    if(add>0){this.option_line = ' '.repeat(add) + opt1 + "      " + opt2}
    else{this.option_line = "   "+opt1+"\n" + "   "+opt2}
    
  }
  update_cursor(x_input){
    if(x_input>0 && this.cursor ==0){this.cursor = 1}
    else if(x_input<0 && this.cursor==1){this.cursor = 0}
  }
  unpack_obj(dialogue_obj){
    this.x = dialogue_obj.x
    this.y = dialogue_obj.y-dialogue_obj.h-50
    this.paragraph = dialogue_obj.properties[0].value.split(";")
    this.options = dialogue_obj.properties[3].value.split(";")
    for (var i = 0; i < this.options.length; i++) {
      this.options[i] = this.options[i].split(":")
    }
    this.indices = dialogue_obj.properties[2].value.split(",")
    console.log(dialogue_obj.properties[2].value)
    for (var i = 0; i < this.indices.length; i++) {
      this.indices[i] = this.indices[i].split(":")
    }
  }
  new_dialogue(dialogue_obj) {
    this.unpack_obj(dialogue_obj)
    this.t = 0
    this.line_no = 0
    this.hide = false
    this.scroll = true
    this.cursor = 0
    this.current_options = this.options[this.line_no]
    this.speech = this.paragraph[this.line_no]
  }
  next() {
    if(this.scroll==true){return}
    this.line_no = this.indices[this.line_no][this.cursor]
    if (this.line_no < this.paragraph.length) {
      this.t = 0
      this.speech = this.paragraph[this.line_no]
      this.scroll = true
      this.cursor = 0
      this.current_options = this.options[this.line_no]
      this.option_line = ""

    } else {
      this.hide_dialogue()
    }
  }
  hide_dialogue() {
    this.hide = true
  }
  update_txt_box(){
    var words = this.speech.split(" ");
    var lines = ""
    var line = ""
    var shown = ""
    for (var i = 0; i < words.length; i++) {
      if (line.length + words[i].length > 30) {
        lines += line + "\n"
        line = words[i]
      } else {
        line += " " + words[i]
      }
    }
    lines += line
    var j = 0
    while(true){
      if(j==lines.length){
        this.scroll = false
        break
      }
      if (j == Math.floor(this.t)) {
        break
      } else {
        shown += lines[j]
      }
      j++
    }
    return shown
  }
  update(dialogue_obj) {
    if (this.hide == false) {
      this.speech_prompt.visible = false
      this.format_options()
      this.speech_box.visible = true
      var shown = this.update_txt_box()
      if(this.scroll==false){
        shown += "\n" + "\n" +this.option_line
      }
      this.text.setText(shown);
      this.text.x = this.x - 100
      this.text.y = this.y - 50
      this.speech_box.x = this.x
      this.speech_box.y = this.y
      this.t += this.speed
    } else {
      this.speech_box.visible = false
      this.text.setText(" ")
      if(dialogue_obj!=null){
        this.speech_prompt.visible = true
        this.speech_prompt.x = dialogue_obj.x-10
        this.speech_prompt.y = dialogue_obj.y-dialogue_obj.h-10
      }else(this.speech_prompt.visible = false)
    }
  }
  late_update(){
    this.text.setDepth(1000)
    this.speech_box.setDepth(1000)
  }
}