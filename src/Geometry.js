class Geometry {
  constructor(options) {
    this.position = options.position.copy()
    this.width = options.width
    this.height = options.height
    this.scene = options.scene 
    this.fillCol = options.fillCol || 'rgba(200, 200, 200, .5)'
    this.lockPosition = false
  }

  draw() {
    const ctx = this.scene.ctx
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    ctx.beginPath()
    ctx.arc(0, 0, this.width / 2, 0, 2 * Math.PI)
    ctx.fillStyle = this.fillCol
    ctx.fill()
    ctx.restore()
  }
}

export default Geometry

