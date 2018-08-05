function Vehicle(x, y){
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 6;
  this.maxspeed = 8;
  this.maxforce = 0.2;

  // Method to update location
  this.update = function(){
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // Add force to acceleration
  this.applyForce = function(force){
    this.acceleration.add(force);
  }

  this.eat = function(list){
    // What's the closest?
    var closest = -1;
    var closestD = Infinity

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
    } else if(closest > -1){
      this.seek(list[closest]);
    }



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

    this.applyForce(steer);
  }

  this.display = function(){
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(theta);

    fill(127);
    stroke(200);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();

  }
}
