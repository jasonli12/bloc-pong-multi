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

function Player(x, y, width, height, speed, points = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.points = points;
}

function Ball(x, y, radius, speed, direction = Math.random() * 2 * Math.PI, minSpeed = 10, maxSpeed = 30, speedChange = 2) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed = speed;
  this.direction = direction;
  this.minSpeed = minSpeed;
  this.maxSpeed = maxSpeed;
  this.speedChange = speedChange;
  this.hitCounter = 0;
  this.lastHit = 'none';
}

Player.prototype = {
  render: function() {
    var fieldContext = field.fieldContext;
    if (keyDirection == 'left' && isPressed) {
      this.moveLeft();
    } else if (keyDirection == 'right' && isPressed) {
      this.moveRight();
    }
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(this.x, this.y, this.width, this.height);
  },
  moveRight: function() {
    var fieldContext = field.fieldContext;
    fieldContext.fillStyle = this.fieldGradient;
    var rightX = this.x + this.width;
    if (fieldCanvas.width - rightX <= this.speed) {
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
    var playerTwoContact = (this.x + this.radius >= playerTwoPos.x) && (this.x - this.radius <= playerTwoPos.x + playerTwoPos.width) && (this.y - this.radius >= playerTwoPos.y) &&  (this.y - this.radius <= playerTwoPos.y + playerTwoPos.height);

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
      this.hitCounter++;
      this.lastHit = 'player';
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
  }
  else if (playerTwoContact) {
    this.hitCounter++;
    this.lastHit = 'computer';
    if (gameplay == 'random') {
      this.direction = Math.random() * Math.PI;
    } else {
      if (this.ballQuadrant == 'Q3') {
        this.direction = Math.PI - (this.direction - Math.PI);
      } else if (this.ballQuadrant == 'Q4') {
        this.direction = 2 * Math.PI - this.direction;
      }
    }
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
var playerScore = document.getElementById('player-score');
var playerScoreHidden = document.getElementById('player-score-hidden');
var playerTwoScore = document.getElementById('computer-score');

var animate = window.requestAnimationFrame || function(step) { window.setTimeout(step, 1000/60) };
var keyDirection;
var isPressed;
var gameplay = 'normal';
var winningPoints = 11;
var gameover = document.getElementById('gameover');
var gameoverMessage = document.getElementById('gameover-message');
var newgameMessage = document.getElementById('newgame-message');
var playerTwoPos = {};
var playerOnePos = {};
var ballPos = {};

function step() {
  field.render();
  playerOne.render();
  ball.render();
  var updates = {};
  updates['/games/' + 1 + '/ball/x'] = ball.x;
  updates['/games/' + 1 + '/ball/y'] = ball.y;
  updates['/games/' + 1 + '/ball/speed'] = ball.speed;
  updates['/games/' + 1 + '/ball/direction'] = ball.direction;
  updates['/games/' + 1 + '/playerOne/x'] = playerOne.x;
  updates['/games/' + 1 + '/playerOne/points'] = playerOne.points;
  updates['/games/' + 1 + '/playerTwo/points'] = playerTwo.points;

  firebase.database().ref().update(updates);
  if (ball.y + ball.radius < -ball.speed + 5 || ball.y - ball.radius > fieldCanvas.height + ball.speed -5 ) {
    return newGame();
  }
  animate(step);
}

function stepTwo() {
    playerTwo.render();
    var updates = {};
    updates['/games/' + 1 + '/playerTwo/x'] = playerTwo.x;
    firebase.database().ref().update(updates);
    animate(stepTwo);
}

function playerOneRenderClient() {

  let playerTwoRef = firebase.database().ref('games/' + 1 + '/playerTwo');

  playerTwoRef.once('value', function(snapshot) {
    playerTwoPos.x = snapshot.val().x;
    playerTwoPos.y = snapshot.val().y;
    playerTwoPos.width = snapshot.val().width;
    playerTwoPos.height = snapshot.val().height;
    let fieldContext = field.fieldContext;
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(playerTwoPos.x, playerTwoPos.y, playerTwoPos.width, playerTwoPos.height);
  });
}

function playerTwoRenderClient() {
  field.render();
  let playerOneRef = firebase.database().ref('games/' + 1 + '/playerOne');
  let ballRef = firebase.database().ref('games/' + 1 + '/ball');
  let playerTwoRef = firebase.database().ref('games/' + 1 + '/playerTwo');

  playerOneRef.once('value', function(snapshot) {
    playerOnePos.x = snapshot.val().x;
    playerOnePos.y = snapshot.val().y;
    playerOnePos.width = snapshot.val().width;
    playerOnePos.height = snapshot.val().height;
    let fieldContext = field.fieldContext;
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(playerOnePos.x, playerOnePos.y, playerOnePos.width, playerOnePos.height);
  });

  ballRef.once('value', function(snapshot) {
    ballPos.x = snapshot.val().x;
    ballPos.y = snapshot.val().y;
    ballPos.r = snapshot.val().radius;
    let fieldContext = field.fieldContext;
    fieldContext.beginPath();
    fieldContext.arc(ballPos.x, ballPos.y, ballPos.r, 0, Math.PI * 2, false);
    fieldContext.fillStyle = "#72ff00";
    fieldContext.fill();
  });

  playerTwoRef.once('value', function(snapshot) {
    playerTwoPos.x = snapshot.val().x;
    playerTwoPos.y = snapshot.val().y;
    playerTwoPos.width = snapshot.val().width;
    playerTwoPos.height = snapshot.val().height;
    let fieldContext = field.fieldContext;
    fieldContext.fillStyle = "white";
    fieldContext.fillRect(playerTwoPos.x, playerTwoPos.y, playerTwoPos.width, playerTwoPos.height);
  });
}

function newGame() {
  if (ball.y + ball.radius < 0) {
    playerOne.points++;
    playerScore.innerHTML = playerOne.points;
    playerScoreHidden.innerHTML = playerOne.points;
  }
  else {
    playerTwo.points++;
    playerTwoScore.innerHTML = playerTwo.points;
  }

  if (playerOne.points == winningPoints || playerTwo.points == winningPoints) {
    if (playerOne.points > playerTwo.points) {
      gameoverMessage.innerHTML = 'GAME SET!!! PLAYER ONE WINS!!!'
      newgameMessage.innerHTML = 'To play again, hit refresh!'
      gameover.style.background = 'blue';
    } else {
      gameover.style.background = 'red';
      gameoverMessage.innerHTML = 'GAME SET!!! PLAYER TWO WINS!!!'
      newgameMessage.innerHTML = 'For a rematch, hit refresh!'
    }
    gameover.style.opacity = 1;
    playerOne.points = 0;
    playerTwo.points = 0;
    playerScore.innerHTML = playerOne.points;
    playerScoreHidden.innerHTML = playerOne.points;
    playerTwoScore.innerHTML = playerTwo.points;
  } else {
    writeNewGame(playerOne.points, playerTwo.points)
    step();
  }
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
});


var gameRef = firebase.database().ref('games/' + 1)

function start() {
  playerScore.innerHTML = 0;
  playerScoreHidden.innerHTML = 0;
  playerTwoScore.innerHTML = 0;

  if (playerId == 1){

    gameRef.on('child_changed', function() {
      playerOneRenderClient();
    });
    step();
  } else {
    playerTwo = new Player(defaults.playerTwoX, defaults.playerTwoY, defaults.stdPaddleWidth, defaults.stdPaddleHeight, defaults.playerSpeed);
    gameRef.on('child_changed', function() {
      playerTwoRenderClient();
    });
    stepTwo();
  }
};
