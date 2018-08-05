var vehicle;
var food = [];
var poison = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  vehicle = new Vehicle(windowWidth/2, windowHeight/2);
  for (var i = 0; i < 10; i++) {
    var x = random(windowWidth);
    var y = random(windowHeight);
    food.push(createVector(x, y));
  }
  for (var i = 0; i < 10; i++) {
    var x = random(windowWidth);
    var y = random(windowHeight);
    poison.push(createVector(x, y));
  }
}

function draw() {
  background(51);

  for (var i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 8, 8);
  }

  for (var i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8, 8);
  }

  vehicle.eat(food);
  vehicle.eat(poison);
  // vehicle.seek(target);
  vehicle.update();
  vehicle.display();
}
