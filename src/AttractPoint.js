/**
 * 吸引点
 */
var ButtonParticle = require("./ButtonParticle.js");

var AttractPoint = function (options){
  this.position = options.position.copy();
  //this.strength = options.strength;
  this.p = options.p;
  this.clockwise = options.clockwise || false;
  this.vortex = options.vortex || false;
}

AttractPoint.prototype.attract = function (options){
  var force = this.vortex ? this.vortexAttract(options) : this.linearAttract(options);
  return force;
}

AttractPoint.prototype.linearAttract = function (options){
  if(options.b instanceof ButtonParticle){
    var force = p5.Vector.sub(this.position,options.b.visualObject.position);
    var dist = force.mag();
    force.normalize();
    force.mult(dist * 0.618);
    return force;
  }
}
AttractPoint.prototype.vortexAttract = function (options){
  if(options.b instanceof ButtonParticle){
    var force = p5.Vector.sub(this.position,options.b.visualObject.position);

    var ff = force.copy();
    if(this.clockwise){
      ff.rotate(-Math.PI/2);
    }else{
      ff.rotate(Math.PI/2);
    }
    ff.setMag(options.threshold);
    force.add(ff);
    force.limit(1);
    return force;
  }
}

AttractPoint.prototype.display = function(){
  this.p.fill(200);
  this.p.ellipse(this.position.x,this.position.y,50,50);
}

module.exports = AttractPoint;
