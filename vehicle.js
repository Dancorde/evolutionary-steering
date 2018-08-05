function Vehicle(x, y){
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 3;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.health = 1;

  this.dna = [];
  // Food weight
  this.dna[0] = random(-2, 2);
  // Poisson weight
  this.dna[1] = random(-2, 2);
  // Food perception
  this.dna[2] = random(0, 100);
  // Food perception
  this.dna[3] = random(0, 100);

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
    var steerG = this.eat(good, 0.1, this.dna[2]);
    var steerB = this.eat(bad, -0.1, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  this.eat = function(list, nutrition, perception){
    // What's the closest?
    var closestD = Infinity
    var closest = null;

    for (var i = list.length-1; i >= 0; i--) {
      // Calculate distance
      var d = this.position.dist(list[i]);

      if (d < this.maxspeed ) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if(d < closestD && d < perception){
          closestD = d;
          closest = list[i];
        }
      }


    }
    // If we're withing 5 pixels, eat it!
    if(closest != null){
      return this.seek(closest);
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

    noFill();


    strokeWeight(3);
    // Circle and line for food
    stroke(0, 255, 0);
    ellipse(0, 0, this.dna[2] * 2);
    line(0, 0, 0, -this.dna[0] * 25);
    strokeWeight(2);

    // Circle and line for poison
    stroke(255, 0, 0);
    ellipse(0, 0, this.dna[3] * 2);
    line(0, 0, 0, -this.dna[1] * 25);

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

  this.boundaries = function() {
    var d = 25;
    var desired = null;
    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.setMag(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

}
