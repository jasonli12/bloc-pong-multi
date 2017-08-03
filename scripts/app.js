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

function Ball(x, y, radius, speed, direction = Math.random() * 2 * Math.PI, minSpeed = 10, maxSpeed = 30, speedChange = 2) {
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
    if (keyDirection == 'left' && isPressed) {
      playerOne.moveLeft();
    } else if (keyDirection == 'right' && isPressed) {
      playerOne.moveRight();
    }
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(this.x, this.y, this.width, this.height);
  },
  moveRight: function() {
    var fieldContext = field.fieldContext;
    fieldContext.fillStyle = this.fieldGradient;
    var rightX = this.x + this.width;
    if (fieldCanvas.width - (this.x + this.width) <= this.speed) {
        this.x = fieldCanvas.width - this.width;
    } else {
        this.x += this.speed;
    }
  },
  moveLeft: function() {
    var fieldContext = field.fieldContext;
    fieldContext.fillStyle = this.fieldGradient;
    if (this.x <= this.speed) {
      this.x = 0;
    } else {
      this.x -= this.speed;
    }
  }
}

Computer.prototype = {
  render: function() {
    var fieldContext = field.fieldContext;
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(this.x, this.y, this.width, this.height)
    this.move();
  },

  //move is same logic as paddle movement, DRY it out
  move: function() {
    var rightX = this.x + this.width;
    if (ball.x > rightX) {
      if (fieldCanvas.width - rightX >= this.speed) {
        this.x += this.speed
      } else {
        this.x = fieldCanvas.width - this.width;
      }
    } else if (ball.x < this.x) {
      if (this.x <= this.speed) {
        this.x = 0;
      } else {
        this.x -= this.speed;
      }
    }
  }
}

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
    var playerPaddleContact = (this.x + this.radius >= playerOne.x) && (this.x - this.radius <= playerOne.x + playerOne.width) && (this.y + this.radius >= playerOne.y) && (this.y + this.radius <= playerOne.y + playerOne.height);
    var computerPaddleContact = (this.x + this.radius >= computerOne.x) && (this.x - this.radius <= computerOne.x + computerOne.width) && (this.y - this.radius >= computerOne.y) &&  (this.y - this.radius <= computerOne.y + computerOne.height);

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
    } else if (playerPaddleContact) {
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
        if (gameplay == 'random') {
          this.direction = Math.random() * Math.PI + Math.PI;
        } else {
          this.direction = 2 * Math.PI - this.direction;
        }
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
      if (gameplay == 'random') {
        this.direction = Math.random() * Math.PI + Math.PI;
      } else {
        this.direction = Math.PI + (Math.PI - this.direction);
      }
    }
  } else if (computerPaddleContact) {
    if (gameplay == 'random') {
      this.direction = Math.random() * Math.PI;
    } else {
      if (this.ballQuadrant == 'Q3') {
        this.direction = Math.PI - (this.direction - Math.PI);
      } else if (this.ballQuadrant == 'Q4') {
        this.direction = 2 * Math.PI - this.direction;
      }
    }
  }},
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
}};

//default playerOne parameters
var playerOneX = 260;
var playerOneY = 770;
var playerOneSpeed = 10;

//default computer parameters
var computerOneX = 260;
var computerOneY = 10;
var computerOneSpeed = 10;

//default paddle parameters
var stdPaddleWidth = 80;
var stdPaddleHeight = 15;

//default ball parameters
var ballX = 300;
var ballY = 400;
var ballRadius = 12;
var ballSpeed = 10;


var field = new Field(fieldCanvas);
var playerOne = new Player(playerOneX, playerOneY, stdPaddleWidth, stdPaddleHeight, playerOneSpeed);
var computerOne = new Computer(computerOneX, computerOneY, stdPaddleWidth, stdPaddleHeight, computerOneSpeed);
var ball = new Ball(ballX, ballY, ballRadius, ballSpeed);


var animate = window.requestAnimationFrame || function(step) { window.setTimeout(step, 1000/60) };
var cancelAnimate = window.cancelAnimationFrame;
var myReq;
var keyDirection;
var isPressed;
var gameplay = 'random';

function step() {
  field.render();
  playerOne.render();
  computerOne.render();
  ball.render();
  if (ball.y + ball.radius < -10 || ball.y - ball.radius > fieldCanvas.height + 10) {
    cancelAnimate(myReq);
    return newGame();
  }
  myReq = animate(step);
}

function newGame() {
  playerOne = new Player(playerOneX, playerOneY, stdPaddleWidth, stdPaddleHeight, playerOneSpeed);
  computerOne = new Computer(computerOneX, computerOneY, stdPaddleWidth, stdPaddleHeight, computerOneSpeed);
  ball = new Ball(ballX, ballY, ballRadius, ballSpeed);
  step();
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
