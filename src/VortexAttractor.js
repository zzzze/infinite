import Attractor from 'Attractor'

export default class VortexAttractor extends Attractor {
  constructor(options) {
    super(options)
    this.clockwise = options.clockwise || false
    this.threshold = options.threshold || 100
  }

  attract(geometry){
    var force = p5.Vector.sub(this.position, geometry.position)
    var ff = force.copy()
    if(this.clockwise){
      ff.rotate(-Math.PI/2)
    }else{
      ff.rotate(Math.PI/2)
    }
    ff.setMag(this.threshold)
    force.add(ff)
    force.limit(0.1)
    return force
  }
}

