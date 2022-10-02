// background.js
;(function () {
    document.getElementById("insertCanvas").innerHTML += "<canvas id='bg'></canvas>"
  
    // init config vars
    let canvas, ctx;
    let numFrames = 0;
    let ctxHeight, ctxWidth;
    let dpi = window.devicePixelRatio;
    let circles = [];
  
  
    // ############# \\
    // CUSTOMIZATION \\
    // ############# \\
    var circleCount = 16;
    var maxRadius = 250;
    var minRadius = 15;
    var colsDark = ["#4D3775"];
    var colsLight = ["#7AD3EE"];
    var tiltFactor = 25;
    var tiltVariation = 0.75;
    var maxVelocity = 0.35;
    var velocityRate = 0.025;
    var centeringFac = 25;
  
    // ------------------------------------------------------------- \\
  
  
    // ######### \\
    // UTILITIES \\
    // ######### \\
  
    // Function to generate random number 
    function randNum(min, max) { 
      return Math.random() * (max - min) + min;
    }
  
    // Check if value is between range
    function between(x, min, max) {
      return x >= min && x <= max;
    }
  
    // setup config vars and start program
    function init () {
      const canvas = document.getElementById("bg");
      const ctx = canvas.getContext("2d");  
      
      // Set canvas size
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Fix blurry canvas issue
      function fixDPI() {
        //get CSS height and width - the "+" casts to int, slice removes "px"
        let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
        let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

        ctxHeight = style_height * dpi;
        ctxWidth = style_width * dpi;

        // Scale the canvas
        canvas.setAttribute('height', ctxHeight);
        canvas.setAttribute('width', ctxWidth);

      }

      fixDPI();

      // ------------------------------------------------------------- \\


      // ################# \\
      // CREATE BACKGROUND \\
      // ################# \\

      // generate array containing circle specifications
      function generateCircleArray () {
        // alert("Building circle array");
        for (i = 0; i < circleCount; i++) {
          let x, y;
          x = randNum(0, ctxWidth);
          y = randNum(0, ctxHeight);

          let vel = [randNum(-maxVelocity, maxVelocity), randNum(-maxVelocity, maxVelocity)];
          let circleRadius = randNum(minRadius, maxRadius);
          let colors = [colsDark[Math.floor(Math.random()*colsDark.length)], colsLight[Math.floor(Math.random()*colsLight.length)]]
          let tiltFac = tiltFactor * randNum(1 - tiltVariation, 1 + tiltVariation);

          circles.push({position: [x, y],velocity: vel, radius: circleRadius, colors: colors, tilt: tiltFac, startPos: [x, y]});
        }
      }

      generateCircleArray();

      // draw function for circles
      function drawCircles (c) {
        ctx.clearRect(0, 0, ctxWidth, ctxHeight);

        c.forEach(drawCircle)

        function drawCircle (item, index) {
          let grdStart = [item.position[0] - item.tilt, item.position[1] + item.radius]
          let grdEnd = [item.position[0] + item.tilt, item.position[1] - item.radius]

          let grd = ctx.createLinearGradient(grdStart[0], grdStart[1], grdEnd[0], grdEnd[1]);
          grd.addColorStop(0, item.colors[0]);
          grd.addColorStop(1, item.colors[1]);
          ctx.fillStyle = grd;

          ctx.beginPath();
          ctx.arc(item.position[0], item.position[1], item.radius, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Generate shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
          ctx.shadowBlur = 30;
          ctx.shadowOffsetX = -12;
          ctx.shadowOffsetY = 15;
        }
      }

      // ------------------------------------------------------------- \\


      // ######### \\
      // ANIMATION \\
      // ######### \\

      // Set positions of circles for the new frame
      function prepareFrame () {
        // Declare variables
        let posDelta = [0, 0];      
        let v = velocityRate * 0.01

        circles.forEach(animShape);
        
        // Move shape
        function animShape (i, ind) {
          posDelta[0] = (i.position[0] - i.startPos[0]);
          posDelta[1] = (i.position[1] - i.startPos[1]);

          i.position[0] += i.velocity[0];
          i.position[1] += i.velocity[1];
          
          let newVel = [0, 0];
          newVel[0] = i.velocity[0] + randNum(-velocityRate, velocityRate);
          newVel[1] = i.velocity[1] + randNum(-velocityRate, velocityRate);
          
          if (between(newVel[0], -maxVelocity, maxVelocity)) {
            i.velocity[0] = newVel[0];
          }
          
          if (between(newVel[1], -maxVelocity, maxVelocity)) {
            i.velocity[1] = newVel[1];
          }
        }
      }

      function newFrame () {
        numFrames += 1;
         document.getElementById("frameCounter").innerHTML = "Frames: " + numFrames
        prepareFrame();
        drawCircles(circles);
        setTimeout(newFrame, 50);
      }

      newFrame();
    }
  
  // wait for HTML load
  document.addEventListener('DOMContentLoaded', init)
})()

// Things to note:
// - I would like to either make shapes stay within bounds, or have them slowly be replaced over time
// - I could also make it have a bias towards it's starting position if I wanted I think
// - 