//set up the canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.fillRect(0, 0, canvas.width, canvas.height);

//set up bio box
var bio = document.getElementById("bio");
bio.style.width = canvas.width*0.9 + "px";
bio.style.height = canvas.height*0.8 + "px";


//global variables to set up the particles
var speedLimit = 5;
var numParticles = 10;
var radius = 10;
//green, pink, yellow, red, dark green, turquiose
var colors = ["#408000", "#FF8080", "#FFFF40", "#FF0000", "#408000", "#00C0C0"];

//creates an array of particles
function createParticles(width, height, n) {
  particles = [];
  for (var i = 0; i < n; i++) {
    particles.push(newParticle(width, height));
  }
  return particles;
}

//creates a single particles
function newParticle(width, height) {
  var curr = [];
  curr.x = Math.floor(Math.random()*(height));
  curr.y = Math.floor(Math.random()*(width));
  var speedX = Math.random()*(speedLimit) + 1 - speedLimit/2;
  var speedY = Math.random()*(speedLimit) + 1 - speedLimit/2;
  curr.speedX = speedX;
  curr.speedY = speedY;
  curr.fastSpeedX = speedX * 8;
  curr.fastSpeedY = speedY * 8;
  curr.color = colors[Math.floor(Math.random() * colors.length)];
  return curr;
}

//draw all the particles
function drawParticles() {
  context.fillStyle = "black";
  context.fillRect(0,0,canvas.width, canvas.height);
  
  for (var i = 0; i < particles.length; i++) {
    context.beginPath();
    context.fillStyle = particles[i].color;
    context.arc(particles[i].x, particles[i].y, radius, 0, Math.PI*2, true); 
    context.closePath();
    context.fill(); 
    
    //update the position
    particles[i].x += particles[i].speedX;
    particles[i].y += particles[i].speedY;
    
    //delete if the particle is outside the area
    if (particles[i].x < 0 || particles[i].x > canvas.height || particles[i].y < 0 || particles[i].y > canvas.width) {
      if (particles[i].x < 0) {
        particles[i].x = canvas.width;  
      }
      if (particles[i].x > canvas.width) {
        particles[i].x = 0;  
      }   
      if (particles[i].y < 0) {
        particles[i].y = canvas.height;  
      }   
      if (particles[i].y > canvas.height) {
        particles[i].y = 0;  
      }      
    }
  }
  drawLines();
}

function drawLines() {
  for (var i = 0; i < particles.length; i++) {
    for (var j = 0; j < particles.length; j++) {
      if (i == j) {
        continue; //skip the same particle
      }
      else {
        var gradient = context.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        gradient.addColorStop("0", particles[i].color);
        if (particles[j].color == undefined) {
          console.log("Error!");
        } 
        gradient.addColorStop("1", particles[j].color);

        context.beginPath();
        context.moveTo(particles[i].x, particles[i].y);
        context.lineTo(particles[j].x, particles[j].y);
        
        context.strokeStyle = gradient;
        context.lineWidth = 0.2;
        context.stroke();
        
      }
    }
  }
}

// FOLLOWING HANDLES FUN STATE
function drawFunParticles() {
  context.fillStyle = background.getColor();
  context.fillRect(0,0,canvas.width, canvas.height);

  for (var i = 0; i < particles.length; i++) {
    context.beginPath();
    context.fillStyle = particles[i].color;

    var funRadius = (Math.round(Math.random() * radius) + radius) * 4;

    context.arc(particles[i].x, particles[i].y, funRadius, 0, Math.PI*2, true); 
    context.closePath();
    context.fill(); 
    
    //update the position
    particles[i].x += particles[i].fastSpeedX;
    particles[i].y += particles[i].fastSpeedY;
    
    //delete if the particle is outside the area
    if (particles[i].x < 0 || particles[i].x > canvas.height || particles[i].y < 0 || particles[i].y > canvas.width) {
      if (particles[i].x < 0) {
        particles[i].x = canvas.width;  
      }
      if (particles[i].x > canvas.width) {
        particles[i].x = 0;  
      }   
      if (particles[i].y < 0) {
        particles[i].y = canvas.height;  
      }   
      if (particles[i].y > canvas.height) {
        particles[i].y = 0;  
      }      
    }
  }
}

//randomly chooses background color
var background = function() {
  var colors = ["black", "red", "yellow", "blue"];
  
  var _color = 'black';
  var _count = 1;
  
  var object = [];
  
  object.getColor = function() {
    if (_count <= 2) {
      _count++;
    } else {
      _count = 1;
      _color = colors[Math.floor(Math.random()*colors.length)];
    }
    return _color;
  };
  return object;
}();


//audio object to handle 
var sound = new Howl({
  urls: ['music/hamster-cut.mp3'],
  loop: true,
  volume: 0.5
});

function playAudio() {
  sound.play();
}

function stopAudio() {
  sound.stop();
}


//function to enter fun state
function haveFun() {
  playAudio();  //play audio
  currInterval.setInterval(drawFunParticles);
}

//function to leave fun state
function stopFun() {
  stopAudio();
  currInterval.setInterval(drawParticles);
}

//controls which function is currently drawing items on the screen
var currInterval = function() {
  var currInterval;

  var properties = [];

  properties.setInterval = function(callback) {
    if (currInterval == undefined) {
      currInterval = setInterval(callback, 30);
    }
    else {
      window.clearInterval(currInterval);
      currInterval = setInterval(callback, 30); 
    }
  }
  return properties;
}();


//only load after the window has loaded
window.onload = function(){
  var particles = createParticles(canvas.width, canvas.height, numParticles);

  drawParticles();
  currInterval.setInterval(drawParticles);

  //event handler for fun state
  var fun = document.getElementById("fun");
  fun.addEventListener("mouseover", haveFun);
  fun.addEventListener("mouseout", stopFun);
};

//make sure everything scales
window.onresize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.fillRect(0, 0, canvas.width, canvas.height);
};