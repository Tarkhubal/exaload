(function(){
  'use strict';
  // Configuration options
  var opts = {
    background: 'black',
    numberOrbs: 100, // increase with screen size.  50 to 100 for my 2560 x 1400 monitor
    maxVelocity: 2.5, // increase with screen size--dramatically affects line density.  2-3 for me
    orbRadius: 1, // keep small unless you really want to see the dots bouncing. I like <= 1.
    minProximity: 100, // controls how close dots have to come to each other before lines are traced
    initialColorAngle: 7, // initialize the color angle, default = 7
    colorFrequency: 0.3, // 0.3 default
    colorAngleIncrement: 0.009, // 0.009 is slow and even
    globalAlpha: 0.010, //controls alpha for lines, but not dots (despite the name)
    manualWidth: false, // Default: false, change to your own custom width to override width = window.innerWidth.  Yes i know I'm mixing types here, sue me.
    manualHeight: false// Default: false, change to your own custom height to override height = window.innerHeight
  };
  
  // Canvas globals
  var canvasTop, linecxt, canvasBottom, cxt, width, height, animationFrame;

  // Global objects
  var orbs;
  
  // Orb object - these are the guys that bounce around the screen.
  // We will draw lines between these dots, but that behavior is found
  // in the Orbs container object
  var Orb = (function() {
  
    // Constructor
    function Orb(radius, color) {
      var posX = randBetween(0, width);
      var posY = randBetween(0, height);
      this.position = new Vector(posX, posY);
      
      var velS = randBetween(0, opts.maxVelocity); // Velocity scalar
      this.velocity = Vector.randomDirection().multiply(velS).noZ();
      
      this.radius = radius;
      this.color = color;
    }
    
    // Orb methods
    Orb.prototype = {
      update: function() {
        // position = position + velocity
        this.position = this.position.add(this.velocity);
        
        // bounce if the dot reaches the edge of the container.
        // this can be EXTREMELY buggy with large dot radiuses, but it works for this
        // drawing.
        if (this.position.x + this.radius >= width || this.position.x - this.radius <= 0) {
          this.velocity.x = this.velocity.x * -1;
        }
        if (this.position.y + this.radius >= height || this.position.y - this.radius <= 0) {
          this.velocity.y = this.velocity.y * -1;
        }
      },
      display: function() {
        cxt.beginPath();
        cxt.fillStyle = this.color;
        cxt.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 2*Math.PI, false);
        cxt.fill();
        cxt.closePath();
      },
      run: function() {
        this.update();
        this.display();
      }
    };
    
    return Orb;
  })();
  
  // Orbs object - this is a container that manages all of the individual Orb objects.
  // In addition, this object holds the color phasing and line-drawing functionality,
  // since it already iterates over all the orbs once per frame anyway.
  var Orbs = (function() {
  
    // Constructor
    function Orbs(numberOrbs, radius, initialColorAngle, globalAlpha, colorAngleIncrement, colorFrequency) {
      this.orbs = [];
      this.colorAngle = initialColorAngle;
      this.colorAngleIncrement = colorAngleIncrement;
      this.globalAlpha = globalAlpha;
      this.colorFrequency = colorFrequency;
      this.color = null;
      for (var i = 0; i < numberOrbs; i++) {
        this.orbs.push(new Orb(radius, this.color));
      }
    }
    
    Orbs.prototype = {
      run: function() {
        this.phaseColor();
        for (var i = 0; i < this.orbs.length; i++) {
          for (var j = i + 1; j < this.orbs.length; j++) {
            // we only want to compare this orb to orbs which are further along in the array,
            // since any that came before will have already been compared to this orb.
            this.compare(this.orbs[i], this.orbs[j]);
          }
          this.orbs[i].color = this.color;
          this.orbs[i].run();
        }
      },
      compare: function(orbA, orbB) {
        // Get the distance between the two orbs.
        var distance = Math.abs(orbA.position.subtract(orbB.position).length());
        if (distance <= opts.minProximity) {
          // the important thing to note here is that we're drawing this onto '#canvas-top'
          // since we want to preserve everything drawn to that layer.
          linecxt.beginPath();
          linecxt.strokeStyle = this.color;
          linecxt.globalAlpha = this.globalAlpha;
          linecxt.moveTo(orbA.position.x, orbA.position.y);
          linecxt.lineTo(orbB.position.x, orbB.position.y);
          linecxt.stroke();
          linecxt.closePath();
        }
      },
      phaseColor: function() {
        // color component = sin(freq * angle + phaseOffset) => (between -1 and 1) * 127 + 128
        var r = Math.floor(Math.sin(this.colorFrequency*this.colorAngle + Math.PI*0/3) * 127 + 128);
        var g = Math.floor(Math.sin(this.colorFrequency*this.colorAngle + Math.PI*2/3) * 127 + 128);
        var b = Math.floor(Math.sin(this.colorFrequency*this.colorAngle + Math.PI*4/3) * 127 + 128);
        this.color = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
        this.colorAngle += this.colorAngleIncrement;
      }
    };
     
    return Orbs;
  })();
  
  // This function is called once and only once to kick off the code.
  // It links DOM objects like the canvas to the respective global variable.
  function initialize() {
    canvasTop = document.querySelector('#canvas-top'); // this canvas is for the lines between dots
    canvasBottom = document.querySelector('#canvas-bottom'); // this canvas is for the dots that bounce around
    linecxt = canvasTop.getContext('2d');
    cxt = canvasBottom.getContext('2d');

    window.addEventListener('resize', resize, false);
    resize();
  }
  
  // This function is called after initialization and window resize.
  function resize() {
    width = opts.manualWidth ? opts.manualWidth : window.innerWidth;
    height = opts.manualHeight ? opts.manualHeight : window.innerHeight;
    setup();
  }
  
  // after window resize we need to 
  function setup() {
    canvasTop.width = width;
    canvasTop.height = height;
    canvasBottom.width = width;
    canvasBottom.height = height;
    //fillBackground(linecxt); // Enable this line if you want to save an image of the drawing.
    fillBackground(cxt);
    orbs = new Orbs(opts.numberOrbs, opts.orbRadius, opts.initialColorAngle, opts.globalAlpha, opts.colorAngleIncrement, opts.colorFrequency);
    // If we hit this line, it was either via initialization procedures (which means animationFrame is undefined)
    // or through window resize, in which case we need to cancel the old draw loop and make a new one.
    if (animationFrame !== undefined) { cancelAnimationFrame(animationFrame); } 
    draw();
  }
  
  // Notice that we only fillBackground on one of the two canvases.  This is because we want to animate
  // the dot layer (we don't want to leave trails left by the dots), but preserve the line layer.
  function draw() {
    fillBackground(cxt);
    orbs.run();
    // Update the global animationFrame variable -- this enables to cancel the redraw loop on resize
    animationFrame = requestAnimationFrame(draw);
  }
  
  // generic background fill function
  function fillBackground(context) {
    context.fillStyle = opts.background;
    context.fillRect(0, 0, width, height);
  }
  
  // get random float between two numbers, inclusive
  function randBetween(low, high) {
    return Math.random() * (high - low) + low;
  }
  
  // get random INT between two numbers, inclusive
  function randIntBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }
  
  // Start the code already, dammit!
  initialize();
})();