import Geometry from 'Geometry'
import EventEmitter from 'events'
var globalVar = require("./GlobalVar.js");

export default class Bubble extends Geometry {
  constructor(options) {
    super(options)
    this.scene = options.scene
    this.pState = 'mouseOut'  //Button初始状态
    this.pSwitch = 'off'   //Button初始状态
    this.hoverCol = options.hoverCol || 'rgba(6, 121, 159, 1)'  //鼠标悬浮时Button的颜色
    this.pressCol = options.pressCol || 'rgba(217, 83, 79, 1)'  //鼠标按下时Button的颜色
    this.clickCol = options.clickCol || 'rgba(217, 83, 79, 1)'  //Button处于on状态时的颜色
    this.eventEmitter = new EventEmitter()
  }

  //判断Button是否被选中
  get isSelected() {
    return this.scene.mouseX >= this.position.x - this.width / 2 &&
      this.scene.mouseX <= this.position.x + this.width / 2 &&
      this.scene.mouseY >= this.position.y - this.height / 2 &&
      this.scene.mouseY <= this.position.y + this.height / 2
  }

  //判断Button的状态
  getState() {
    /**
     * hover (pState) ： 鼠标悬浮（被选中）
     * press (pState) ： 鼠标按下
     * click (pState) ： 鼠标点击
     * mouseOut (pState) ： 鼠标从button上移开/未被选中
     * on (pSwitch) : Button处于开启状态
     * off (pSwitch) ： Button处于关闭状态
     */
    if (this.isSelected) {
      if (this.pState == 'click') {
        if (this.scene.mouseIsPressed) {
          return 'press'
        } else {
          return 'click'
        }
      } else {
        if (this.scene.mouseIsPressed) {
          return 'press'
        } else {
          if (this.pState == 'press') {
            if (this.pSwitch == 'on') {
              this.pSwitch = 'off'
              return 'hover'
            } else {
              this.pSwitch = 'on'
              return 'click'
            }
          } else {
            return 'hover'
          }
        }
      }
    } else {
      if (this.pState == 'click') {
        return 'click'
      } else {
        return 'mouseOut'
      }
    }
  }

  //鼠标指针图形
  cursorState(){
    const canvas = this.scene.ctx.canvas
    const state = this.getState()
    if(this.constructor.prototype.hoverObjCount == 0){
      canvas.style.cursor = 'default'
    }else{
      if (state == 'mouseOut' && this.pState == 'hover') {
        canvas.style.cursor = 'default'
      } else if (state == 'hover' && this.pState == 'mouseOut') {
        canvas.style.cursor = 'pointer'
      }
    }
  }

  //根据不同的状态绘制Button
  draw() {
    this.cursorState()
    if (this.strokeCol) {
      this.scene.ctx.strokeStyle = this.strokeCol
    }
    const state = this.getState()
    switch (state) {
      case 'hover':
        this.fillCol = this.hoverCol
        super.draw()
        this.eventEmitter.emit('hover')
        this.pState = 'hover'
        break
      case 'mouseOut':
        if (this.buttonCol) {
          this.fillCol = this.buttonCol
        } else {
          this.fillCol = 'rgba(0, 0, 100, 1)'
        }
        super.draw()
        this.eventEmitter.emit('mouseOut')
        this.pState = 'mouseOut'
        break
      case 'press':
        this.fillCol = this.pressCol
        super.draw()
        this.eventEmitter.emit('press')
        this.pState = 'press'
        break
      case 'click':
        this.fillCol = this.clickCol
        super.draw()
        this.eventEmitter.emit('click')
        this.pState = 'click'
        break
      default:
        if (this.buttonCol) {
          this.fillCol = this.buttonCol
        } else {
          this.fillCol = 'rgba(0, 0, 100, 1)'
        }
        super.draw()
    }
  }
}

