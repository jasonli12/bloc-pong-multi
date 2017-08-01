var fieldCanvas = document.getElementById("field");
var fieldContext = fieldCanvas.getContext("2d");

// Give the field a nice shade of gradient from red to blue.
fieldGradient = fieldContext.createLinearGradient(0, 0, 0, 800);
fieldGradient.addColorStop(0, "red");
fieldGradient.addColorStop(1, "blue");
fieldContext.fillStyle = fieldGradient;
fieldContext.fillRect(0, 0, 600, 800);

// Draw center line.
fieldContext.fillStyle = "white";
fieldContext.beginPath();
fieldContext.moveTo(0, 400);
fieldContext.lineTo(600, 400);

fieldContext.strokeStyle = "#ffffff";
fieldContext.lineWidth = 6;
fieldContext.stroke();

// Draw center circle where ball will be placed.
fieldContext.beginPath();
fieldContext.arc(300, 400, 50, 0, Math.PI * 2, false);

fieldContext.lineWidth = 4;
fieldContext.stroke();

function Player(x, y, width, height, speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
}

function Computer(x, y, width, height, speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
}

function Ball(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

Player.prototype = {
  render: function() {
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(this.x, this.y, this.width, this.height);
  },
  moveRight: function() {
    fieldContext.fillStyle = fieldGradient;
    fieldContext.fillRect(this.x, this.y, this.width, this.height);
    var rightX = this.x + this.width
    if (fieldCanvas.width - (this.x + this.width) <= this.speed) {
        this.x = fieldCanvas.width - this.width;
    } else {
        this.x += this.speed;
    }
  },
  moveLeft: function() {
    fieldContext.fillStyle = fieldGradient;
    fieldContext.fillRect(this.x, this.y, this.width, this.height);
    if (this.x <= this.speed) {
      this.x = 0;
    } else {
      this.x -= this.speed;
    }
  }
}

Computer.prototype.render = function() {
  fieldContext.fillStyle = "white";
  fieldContext.fillRect(this.x, this.y, this.width, this.height);
};

Ball.prototype.render = function() {
  fieldContext.beginPath();
  fieldContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  fieldContext.fillStyle = "#72ff00";
  fieldContext.fill();
};


var playerOne = new Player(260, 770, 80, 15, 50);
var computerOne = new Computer(260, 10, 80, 15, 50);
var ball = new Ball(300, 400, 12);

var animate = window.requestAnimationFrame || function(step) { window.setTimeout(step, 1000/60) };

function step() {
  playerOne.render();
  computerOne.render();
  ball.render();
  animate(step);
}

window.addEventListener("keydown", function(event) {
  if (event.key == "ArrowLeft" || event.key == "a") {
    playerOne.moveLeft();
  } else if (event.key == "ArrowRight" || event.key == "d") {
    playerOne.moveRight();
  }
});

window.onload = function() {
  step();
};
