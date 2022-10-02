/*
* This is a fork of http://jsfiddle.net/fJ6fj/26/
*/

var mainModule = {
  s: Snap("#svg"),
  drawingConfig: {
    speed: {
       x: window.innerWidth / 300,
       y: window.innerWidth / 300
    },
    circles: {
      amount: 12,
      sizeMin: window.innerWidth / 3,
      sizeMax: window.innerWidth / 1.4,
      proximity: 200,
      circleGroup: null,
      circleArray: [],
      animTime: 2000
    },
    canvas: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    gradients: [
      "r()rgba(132,39,166,1.0)-rgba(132,39,166,0.0)",
      "r()rgba(99,29,125,1.0)-rgba(99,29,125,0.0)",
      "r()rgba(243,234,213,1.0)-rgba(243,234,213,0.0)",
      "r()rgba(63,169,245,1.0)-rgba(63,169,245,0.0)",
   // "r()rgba(255,147,30,1.0)-rgba(255,147,30,0.0)",
      "r()rgba(255,29,37,1.0)-rgba(255,29,37,0.0)"
    ]
  },

  init: function(){
    this.makeCircles();
  },

  sizeCanvas: function(){
    //$('#svg').width(window.innerWidth).height(window.innerHeight);
  },

  makeCircles: function(){
   
    var dc = this.drawingConfig;
    dc.circles.circleGroup = this.s.g();

    for (var i=0; i<dc.circles.amount;i++){
      var circleX = this.randomNumber(0, dc.canvas.width);
      var circleY = this.randomNumber(0, dc.canvas.height);
      var circleRadius = this.randomNumber(dc.circles.sizeMin,dc.circles.sizeMax);
      
      var circleShape = this.s.circle(circleX, circleY, circleRadius);
      var gradientsCount = dc.gradients.length;
      var randomFill = dc.gradients[i % gradientsCount];
      circleShape.attr({
        fill: randomFill
      });
      dc.circles.circleGroup.add(circleShape);

      var circleIncline = this.setIncline();
      var circleObj = { incline: circleIncline, shape: circleShape };

      dc.circles.circleArray.push(circleObj);

    }

    this.update();
  },

  setIncline: function(){
    var v = this.drawingConfig.speed
    return { incX: this.randomNumber(-v.x,v.x), incY: this.randomNumber(-v.y,v.y) }
  },

  update: function(){
    var dc = this.drawingConfig;
    for (var i=0; i<dc.circles.amount; i++){
      var circle = dc.circles.circleArray[i];
      var circleX = circle.shape.node.cx.animVal.value;
      var circleY = circle.shape.node.cy.animVal.value;
      this.move(circle,circleX,circleY);
    }
    requestAnimationFrame(function() {mainModule.update();})
  },

  /*
  distance: function(circleX,circleY,circle2X,circle2Y){
    var distX = circle2X - circleX;
    var distY = circle2Y - circleY;
    distX = distX*distX;
    distY = distY*distY;
    return Math.sqrt(distX + distY);
  },
  */

  move: function(circle,curX,curY){
    var dc = this.drawingConfig;
    
    if (curX > dc.canvas.width || curX < 0) {
      circle.incline.incX = -circle.incline.incX;
    }
    if (curY > dc.canvas.height || curY < 0) {
      circle.incline.incY = -circle.incline.incY;
    }
    curX = curX + circle.incline.incX;
    curY = curY + circle.incline.incY;

    if (curX > dc.canvas.width) {
      curX = dc.canvas.width;
      circle.incline = this.setIncline();
    } else if (curX < 0) {
      curX = 0;
      circle.incline = this.setIncline();
    }

    if (curY > dc.canvas.height) {
      curY = dc.canvas.height;
      circle.incline = this.setIncline();
    } else if (curY < 0) {
      curY = 0;
      circle.incline = this.setIncline();
    }

    circle.shape.attr({ cx: curX, cy: curY });

  },

  randomNumber: function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  },

  getBounds: function(shape){
    shapeBox = shape.node.getBoundingClientRect();
  }

}

mainModule.init();