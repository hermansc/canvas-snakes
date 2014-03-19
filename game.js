// Render canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas)

// Styling
canvas.style.border = "1px solid black";
var backgroundColor = "#ffffff";
var lineColor = "#000000";

// Game objects
var snake = {
  speed: 256, // pixels per second
  maxparts: 50,

  direction: 'down',
  x: 200,
  y: 200,
  tail: [], //[(20, 30)]
};
var food = {
  x: 100,
  y: 100,
  radius: 6
};
var foodCaught = 0;
var gameOver = false;

// Key handlers
addEventListener("keydown", function(e) {
  keyDown(e.keyCode)
}, false);
var keyDown = function(keycode) {
  oldDir = snake.direction;
  if (keycode == 38 && !(oldDir == "down")) { snake.direction = "up"; }
  else if (keycode == 40 && !(oldDir == "up")) { snake.direction = "down" }
  else if (keycode == 37 && !(oldDir == "right")) { snake.direction = "left" }
  else if (keycode == 39 && !(oldDir == "left")) { snake.direction = "right" }
}

// Handle the case when we catch a food item
var caughtFood = function() {
  foodCaught++;
  snake.speed += 30;
  snake.maxparts += 50;
  food.x = 10 + Math.random() * (canvas.width-20);
  food.y = 10 + Math.random() * (canvas.height-20);
  console.log(foodCaught);
}

var drawSnake = function() {
  var currX = snake.x,
      currY = snake.y;
  for (i = snake.tail.length - 1; i > 0; i--) {
    ctx.beginPath();
    ctx.moveTo(currX, currY);
    newX = snake.tail[i].x;
    newY = snake.tail[i].y;
    if (!(Math.abs(newX - currX) > 100 || Math.abs(newY - currY) > 100)){
      // If difference is less than 100. Draw it.
      ctx.lineTo(newX,newY);
      ctx.stroke();
    }
    currX = newX;
    currY = newY;
  }
};

var snakePos = function(x, y, dx, dy) {
  if (x + dx > canvas.width) {
    x = 0;
  } else if (x + dx < 0) {
    x = canvas.width;
  } else if (y + dy > canvas.height) {
    y = 0;
  } else if (y + dy < 0) {
    y = canvas.height;
  } else {
    x += dx;
    y += dy;
  }
  return {x:x,y:y}
}

var checkCrash = function() {
  for (i = 0; i < snake.tail.length; i++) {
    if (Math.abs(snake.tail[i].x - snake.x) < 0.9
      && Math.abs(snake.tail[i].y - snake.y) < 0.9) {
      gameOver = true;
    }
  }
}

var moveSnake = function(modifier) {
  // Move the snake head
  if (snake.direction == "up") { newPos = snakePos(snake.x, snake.y, 0, -snake.speed * modifier) }
  else if (snake.direction == "down") { newPos = snakePos(snake.x, snake.y, 0, snake.speed * modifier) }
  else if (snake.direction == "left") { newPos = snakePos(snake.x, snake.y, -snake.speed * modifier, 0) }
  else if (snake.direction == "right") { newPos = snakePos(snake.x, snake.y, snake.speed * modifier, 0) }
  snake.x = newPos.x;
  snake.y = newPos.y;

  if (Math.abs(snake.x - food.x) < food.radius && Math.abs(snake.y - food.y) < food.radius) {
    caughtFood();
  }

  checkCrash();

  // Save the old position
  snake.tail.push({x:snake.x,y:snake.y})

  // Remove the last element in the tail
  if (snake.tail.length > snake.maxparts) {
    snake.tail = snake.tail.slice(1)
  }
};

var drawFood = function() {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(food.x,food.y,food.radius,0,2*Math.PI,true);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = lineColor;
};

var clearBoard = function() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.restore();
};

var printScore = function() {
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + foodCaught, canvas.width-90, 20);
  ctx.fillText("Speed: " + snake.speed, canvas.width-90, 40);
}

var printGameOver = function() {
  ctx.fillStyle = backgroundColor;
  ctx.lineWidth = 7;
  ctx.strokeStyle = 'black';
  ctx.fillRect(canvas.width-425,canvas.height-400,canvas.width-200,canvas.height-200);
  ctx.strokeRect(canvas.width-425,canvas.height-400,canvas.width-200,canvas.height-200);

  ctx.fillStyle = lineColor;
  ctx.font = "bold 30px Arial";
  ctx.fillText("GAME OVER", canvas.width-365, canvas.height- 300);
  ctx.font = "20px Arial";
  ctx.fillText("You played a good game.", canvas.width-380, canvas.height-270);
  ctx.fillText("Score: " + foodCaught, canvas.width-310, canvas.height-245);
}

var main = function() {
  var now = Date.now();
  var delta = now - then;
  clearBoard();
  moveSnake(delta/1000);
  drawSnake();
  drawFood();
  printScore();
  then = now;

  if (gameOver){
    clearInterval(loop);
    printGameOver();
  }
}

clearBoard();
var then = Date.now();
var loop = setInterval(main, 1);
