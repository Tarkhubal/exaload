var PHI = (1 + Math.sqrt(5)) / 2, // 1.618033988749895
  maxGeneration = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? 5 : 6, // Let's go easy on Firefox
  frameDuration = 1000 / 60,
  duration = 3000,
  rotationSpeed = 0.3,
  totalIterations = Math.floor(duration / frameDuration),
  maxBaseSize = 100,
  baseSizeSpeed = 0.02;

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  canvasWidth = document.documentElement.clientWidth,
  canvasHeight = document.documentElement.clientHeight,
  shapes = [],
  sizeVariation,
  iteration = 0,
  animationDirection = 1,
  sizeVariationRange = .15,
  baseRotation = 0,
  baseSize = 50,
  color = new Color(43, 205, 255);

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);

function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.rS = this.gS = this.bS = 1;
}

  Color.prototype.change = function() {
    if (this.r == 0 || this.r == 255) this.rS *= -1;
    if (this.g == 0 || this.g == 255) this.gS *= -1;
    if (this.b == 0 || this.b == 255) this.bS *= -1;
    this.r += this.rS;
    this.g += this.gS;
    this.b += this.bS;
  }

function Shape(gen, x, y, size, rotation) {
  this.generation = gen;
  this.size = size;
  this.rotation = -rotation;
  this.start = {
    x: x,
    y: y
  };
  this.end = {
    x_1: this.start.x + Math.cos(degToRad(this.rotation)) * this.size,
    y_1: this.start.y + Math.sin(degToRad(this.rotation)) * this.size,
    x_2: this.start.x + Math.cos(degToRad(this.rotation + 360 / 3)) * this.size,
    y_2: this.start.y + Math.sin(degToRad(this.rotation + 360 / 3)) * this.size,
    x_3:
      this.start.x +
      Math.cos(degToRad(this.rotation + 360 / 3 * 2)) * this.size,
    y_3:
      this.start.y + Math.sin(degToRad(this.rotation + 360 / 3 * 2)) * this.size
  };

  this.init();
}

var S = Shape.prototype;

S.init = function() {
  if (this.generation < maxGeneration) {
    var gen = this.generation + 1,
      newSize = this.size * sizeVariation,
      newRotation = this.rotation;

    shapes.push(
      new Shape(gen, this.end.x_1, this.end.y_1, newSize, newRotation)
    );
    shapes.push(
      new Shape(gen, this.end.x_2, this.end.y_2, newSize, newRotation)
    );
    shapes.push(
      new Shape(gen, this.end.x_3, this.end.y_3, newSize, newRotation)
    );
  }
  this.draw();
};

S.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.start.x, this.start.y);
  ctx.lineTo(this.end.x_1, this.end.y_1);
  ctx.moveTo(this.start.x, this.start.y);
  ctx.lineTo(this.end.x_2, this.end.y_2);
  ctx.moveTo(this.start.x, this.start.y);
  ctx.lineTo(this.end.x_3, this.end.y_3);
  ctx.strokeStyle =
    "rgba(" + color.r + "," + color.g + "," + color.b + "," + 1 / this.generation / 5 + ")";
  ctx.stroke();
};

function animate() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,.1)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalCompositeOperation = "lighter";
  shapes = [];
  shapes.push(
    new Shape(0, canvasWidth / 2, canvasHeight / 2, baseSize, baseRotation)
  );

  color.change();
  iteration++;
  if (baseSize < maxBaseSize) baseSize += baseSizeSpeed;
  baseRotation += rotationSpeed;
  sizeVariation = easeInOutSine(
    iteration,
    1 - sizeVariationRange * animationDirection,
    sizeVariationRange * 2 * animationDirection,
    totalIterations
  );
  if (iteration >= totalIterations) {
    iteration = 0;
    animationDirection *= -1;
  }
  requestAnimationFrame(animate);
}

function degToRad(deg) {
  return Math.PI / 180 * deg;
}

function easeInOutSine(
  currentIteration,
  startValue,
  changeInValue,
  totalIterations
) {
  return (
    changeInValue /
      2 *
      (1 - Math.cos(Math.PI * currentIteration / totalIterations)) +
    startValue
  );
}



ctx.globalCompositeOperation = "lighter";
animate();

window.addEventListener("resize", function() {
  canvasWidth = document.documentElement.clientWidth;
  canvasHeight = document.documentElement.clientHeight;

  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);
  ctx.strokeStyle = "rgba(66,134,240,.3)";
  ctx.globalCompositeOperation = "lighter";
});