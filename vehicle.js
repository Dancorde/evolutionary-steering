function Vehicle(x, y){
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 3;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.health = 1;

  this.dna = [];
  this.dna[0] = random(-5, 5);
  this.dna[1] = random(-5, 5);

  // Method to update location
  this.update = function(){
    this.health -= 0.002;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // Return true if health is less than zero
  this.dead = function() {
    return (this.health < 0);
  }

  // Add force to acceleration
  this.applyForce = function(force){
    this.acceleration.add(force);
  }

  this.behaviors = function(good, bad) {
    var steerG = this.eat(good, 0.1);
    var steerB = this.eat(bad, -0.1);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  this.eat = function(list, nutrition){
    // What's the closest?
    var closestD = Infinity
    var closest = -1;

    for (var i = 0; i < list.length; i++) {
      // Calculate distance
      var d = this.position.dist(list[i]);
      if(d < closestD){
        closestD = d;
        closest = i;
      }

    }
    // If we're withing 5 pixels, eat it!
    if (closestD < 5) {
      list.splice(closest, 1);
      this.health += nutrition;
    } else if(closest > -1){
      return this.seek(list[closest]);
    }

    return createVector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target){
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
  }

  this.display = function(){
    // Color based on health
    var green = color(0, 255, 0);
    var red = color(255, 0, 0);
    var col = lerpColor(red, green, this.health)

    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + PI / 2;
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);

        // Draw the vehicle itself
    fill(col);
    stroke(col);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
}
