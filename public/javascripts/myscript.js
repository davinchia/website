//set up the canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.fillRect(0, 0, canvas.width, canvas.height);

//set up bio box
var bio = document.getElementById("bio");
bio.style.width = canvas.width*0.9 + "px";
console.log(canvas.width);
console.log(bio.width);
bio.style.height = canvas.height*0.8 + "px";


//global variables to set up the particles
var speedLimit = 5;
var numParticles = 15;
var radius = 5;
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

window.onload = function(){
  var particles = createParticles(canvas.width, canvas.height, numParticles);

  drawParticles();
  setInterval(drawParticles, 20);
};

window.onresize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.fillRect(0, 0, canvas.width, canvas.height);
};