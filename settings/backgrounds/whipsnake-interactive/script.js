// global vars
var width,
  height,
  canvas,
  cxt,
  permacanvas,
  pcxt,
  snake,
  mouseActive,
  animationFrame,
  mousePosition,
  pathRate;

// purrdy-makin paramaters
var snakeSegments = 5,
  snakeSegmentWidth = 5,
  snakeSegmentLength = 50,
  snakeFollowSpeed = 5,
  snakeHeadSize = 3,
  snakeColor = "#23B89A",
  lineColor = 'rgba(0, 0, 0, 0.01)',
  a = 1, // These are parameters for drawing parametric curves.  I wouldn't mess with these unless you 
  b = 1, // are planning on changing the curve definition itself.
  pathScaleFactor = 1.14, // don't mess with this too much, I tuned it fairly well.  This helps normalize the red dot's speed when the canvas size changes.  (See pathRate calculation in the setup() function).
  initialPathRate = a*b; // base rate of the red dot's path.  don't mess with this unless you are modifying the parametric curve (the red dot path).  This helps normalize the speed of the dot when your path becomes really long due to large a & b parameters (think Lissajous).  A longer path will be traversed in the same amount of time as a shorter path without this scaling factor.

// Snake object
var Snake = (function() {
  function Snake(segments) {
    this.body = [segments];
    for (var i = 0; i < segments; i++) {
      this.body[i] = new Vector(width/2, height/2);
    }
  }
  Snake.prototype = {
    // This is the magical snake code that you came here for.
    // 1.  When you want to make one point follow another point:
    // 1a.   Subtract the coordinates of one from the other
    // 1b.   Find the unit vector (i.e. length = 1) of that result
    // 1c.   Scale the result by some speed parameter (snakeFollowSpeed or snakeSegmentLength in this case).
    //       This is a segment of the correct length and orientation, but it is positioned at the origin.
    // 2.  To reposition this new vector...
    // 2a.   For head segment, add it to the old head segment position.
    // 2ai.    If the distance between the headSegment and the destination point is <= snakeFollowSpeed, just set the headSegment to the destination.
    //         This prevents ugly, glitchy movement where the head would otherwise jump past the destination and then jump back the opposite direction next frame. I'll let you ponder why this might be.
    // 2b.  For body segments, subtract it from the previous body segment's position.  This is what causes the chain-like behavior of the snake.
    update: function(point) {
      var headSegment = this.body[0];
      var diff = point.subtract(headSegment);
      this.body[0] = diff.length() <= snakeFollowSpeed
        ? point
        : headSegment.add(diff.unit().multiply(snakeFollowSpeed)); // ternary operator with nested, chained fn's.  Yay!
      for (var i = 1; i < this.body.length; i++) {
        var segment = this.body[i - 1];
        var v = segment
          .subtract(this.body[i])
          .unit()
          .multiply(snakeSegmentLength);
        this.body[i] = segment.subtract(v);
      }
    },
    display: function() {
      // draw the head circle
      cxt.beginPath();
      cxt.fillStyle = snakeColor;
      cxt.arc(this.body[0].x, this.body[0].y, snakeHeadSize, 0, 2 * Math.PI);
      cxt.fill();
      cxt.stroke();
      cxt.closePath();
      // draw the other circles
      for (var i = 0; i < this.body.length; i++) {
        cxt.beginPath();
        cxt.lineCap = "round";
        cxt.strokeStyle = snakeColor;
        // cxt.lineWidth = snakeSegmentWidth;
        // cxt.moveTo(this.body[i].x, this.body[i].y);
        // cxt.lineTo(this.body[i+1].x, this.body[i+1].y);
        cxt.arc(this.body[i].x, this.body[i].y, snakeHeadSize, 0, 2 * Math.PI);
        cxt.stroke();
        cxt.closePath();
      }
      // leave trails
      for (var i = 0; i < this.body.length-1; i++) {
        for (var j = i+1; j < this.body.length; j++) {
          pcxt.beginPath();
          pcxt.strokeStyle = lineColor;
          pcxt.moveTo(this.body[i].x, this.body[i].y);
          pcxt.lineTo(this.body[j].x, this.body[j].y);
          pcxt.stroke();
          pcxt.closePath();
        }
      }
    }
  };
  return Snake;
})();

// called only on load
function initialize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas = document.getElementById("canvas");
  permacanvas = document.getElementById("permacanvas");
  cxt = canvas.getContext("2d");
  pcxt = permacanvas.getContext("2d");
  snake = new Snake(snakeSegments);
  canvas.addEventListener("mousemove", mouseMoveHandler, false);
  canvas.addEventListener("mouseleave", mouseLeaveHandler, false);
  window.addEventListener("resize", resize, false);
  mouseActive = false;
  setup();
}

// called after initialize and on each resize event
function setup() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  permacanvas.width = width;
  permacanvas.height = height;
  pathRate = initialPathRate * Math.sqrt(Math.pow(width, pathScaleFactor) + Math.pow(height, pathScaleFactor));
  draw();
}

// callback for window resize event.  Kill old animation, setup animation again
function resize() {
  window.cancelAnimationFrame(animationFrame);
  setup();
}

// when mouse is moved we need to override snake pathing and update snake position
function mouseMoveHandler(event) {
  mouseActive = true;
  var x = event.clientX;
  var y = event.clientY;
  mousePosition = new Vector(x, y);
}

// when mouse leaves canvas, we want the snake to figure-8'ing again
function mouseLeaveHandler(event) {
  mouseActive = false;
}

// each time this function is called it moves a point a little further along a parametric curve
var makePath = (function() {
  var t = 0;

  return function() {
    t++;
    var angle = t / pathRate;
    var x = ((width/2) * a*Math.pow(Math.cos(angle),3)) + (width / 2);
    var y = ((height/2) * b*Math.pow(Math.sin(angle),3)) + (height / 2);
    cxt.beginPath();
    cxt.strokeStyle = 'red';
    cxt.rect(x, y, 2, 2);
    cxt.stroke();
    cxt.closePath();
    return new Vector(x, y);
  };
})();

// draw loop
function draw() {
  cxt.clearRect(0, 0, width, height);
  var point = mouseActive ? mousePosition : makePath();
  snake.update(point);
  snake.display();
  animationFrame = requestAnimationFrame(draw);
}

// start the damn drawing already
initialize();