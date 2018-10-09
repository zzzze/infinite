import Geometry from 'Geometry'

export default class Attractor extends Geometry {
  attract(geometry){
    var force = p5.Vector.sub(this.position, geometry.position)
    var dist = force.mag()
    force.normalize()
    force.mult(dist * 0.618)
    return force
  }
}
