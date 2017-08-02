var fieldCanvas = document.getElementById("field");

function Field(canvas) {
  this.fieldContext = canvas.getContext("2d");
  this.fieldGradient = this.fieldContext.createLinearGradient(0, 0, 0, 800);
}

Field.prototype.render = function() {
  var fieldContext = this.fieldContext;

  // Give the field a nice shade of gradient from red to blue.
  var fieldGradient = this.fieldGradient;
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
};

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

function Ball(x, y, radius, speed, direction = Math.random() * Math.PI * 2, minSpeed = 10, maxSpeed = 30, speedChange = 2) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed = speed;
  this.direction = direction;
  this.minSpeed = minSpeed;
  this.maxSpeed = maxSpeed;
  this.speedChange = speedChange
}

Player.prototype = {
  render: function() {
    var fieldContext = field.fieldContext;
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(this.x, this.y, this.width, this.height);
  },
  moveRight: function() {
    var fieldContext = field.fieldContext;
    fieldContext.fillStyle = this.fieldGradient;
    // fieldContext.fillRect(this.x, this.y, this.width, this.height);
    var rightX = this.x + this.width
    if (fieldCanvas.width - (this.x + this.width) <= this.speed) {
        this.x = fieldCanvas.width - this.width;
    } else {
        this.x += this.speed;
    }
  },
  moveLeft: function() {
    var fieldContext = field.fieldContext;
    fieldContext.fillStyle = this.fieldGradient;
    // fieldContext.fillRect(this.x, this.y, this.width, this.height);
    if (this.x <= this.speed) {
      this.x = 0;
    } else {
      this.x -= this.speed;
    }
  }
}

Computer.prototype.render = function() {
  var fieldContext = field.fieldContext;
  fieldContext.fillStyle = "white";
  fieldContext.fillRect(this.x, this.y, this.width, this.height);
};

Ball.prototype = {
  render: function() {
    var fieldContext = field.fieldContext;
    fieldContext.beginPath();
    fieldContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    fieldContext.fillStyle = "#72ff00";
    fieldContext.fill();
    this.x -= this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sin(this.direction);
    this.updateBallQuadrant();

    // Make ball bounce off walls
    var wallContact = this.x >= fieldCanvas.width || this.x <= 0;
    var paddleContact = (this.x + this.radius >= playerOne.x) && (this.x - this.radius <= playerOne.x + playerOne.width) && (this.y + this.radius >= playerOne.y) && (this.y - this.radius < playerOne.y + playerOne.height - 10);
    if (wallContact) {
      if (this.ballQuadrant == 'Q2') {
        this.x = fieldCanvas.width
        this.direction = Math.PI - this.direction;
      } else if (this.ballQuadrant == 'Q3')  {
        this.direction = 2 * Math.PI - (this.direction - Math.PI);
      } else if (this.ballQuadrant == 'Q1') {
        this.x = 0;
        this.direction = Math.PI - this.direction;
      } else if (this.ballQuadrant == 'Q4') {
        this.x = 0;
        this.direction = Math.PI + (2 * Math.PI - this.direction);
    }


    // Make ball bounce off paddles
  } else if (paddleContact) {
    if (this.ballQuadrant == 'Q1'){
      // speed change if holding down on direction key
      if (keyDirection == 'right' && isPressed) {
        if (this.speed - this.speedChange <= this.minSpeed) {
          this.speed = this.minSpeed;
        } else {
          this.speed -= this.speedChange;
        }
      } else if (keyDirection == 'left' && isPressed) {
        if (this.speed + this.speedChange >= this.maxSpeed) {
          this.speed = this.maxSpeed;
        } else {
          this.speed += this.speedChange;
        }
      }
      this.direction = 2 * Math.PI - this.direction;
    } else if (this.ballQuadrant == 'Q2') {
      // speed change if holding down on direction key
      if (keyDirection == 'left' && isPressed) {
        if (this.speed - this.speedChange <= this.minSpeed) {
          this.speed = this.minSpeed;
        } else {
          this.speed -= this.speedChange;
        }
      } else if (keyDirection == 'right' && isPressed) {
        if (this.speed + this.speedChange >= this.maxSpeed) {
          this.speed = this.maxSpeed;
        } else {
          this.speed += this.speedChange;
        }
      }
      this.direction = Math.PI + (Math.PI - this.direction);
    }
  } else if (this.y <= 0 && (this.ballQuadrant == 'Q3')) {
    this.direction = Math.PI - (this.direction - Math.PI);
  } else if (this.y <= 0 && this.ballQuadrant == 'Q4') {
    this.direction = 2 * Math.PI - this.direction;
  }
  },
  updateBallQuadrant: function() {
    if (this.direction >= 0 && this.direction <= Math.PI / 2) {
      this.ballQuadrant = 'Q1'
    } else if (this.direction >= Math.PI / 2 && this.direction <= Math.PI) {
      this.ballQuadrant = 'Q2'
    } else if (this.direction >= Math.PI && this.direction <= 3 * Math.PI / 2) {
      this.ballQuadrant = 'Q3'
    } else {
      this.ballQuadrant = 'Q4'
    }
  }
};

var field = new Field(fieldCanvas);
var playerOne = new Player(260, 770, 80, 15, 10);
var computerOne = new Computer(260, 10, 80, 15, 50);
var ball = new Ball(300, 400, 12, 10);


var animate = window.requestAnimationFrame || function(step) { window.setTimeout(step, 1000/60) };
var keyDirection;
var isPressed;

function step() {
  field.render();
  if (keyDirection == 'left' && isPressed) {
    playerOne.moveLeft();
  } else if (keyDirection == 'right' && isPressed) {
    playerOne.moveRight();
  }
  playerOne.render();
  computerOne.render();
  ball.render();
  animate(step);
}

window.addEventListener("keydown", function(event) {
  if (event.key == "ArrowLeft" || event.key == "a") {
    keyDirection = 'left';
    isPressed = true;
  } else if (event.key == "ArrowRight" || event.key == "d") {
    keyDirection = 'right';
    isPressed = true;
  }
});

window.addEventListener("keyup", function(event) {
  isPressed = false;
})

window.onload = function() {
  step();
};
