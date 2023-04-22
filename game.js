class Tunel {
  constructor(x, yB, hB, hT) {
    this.gap = 150;
    this.x = x;
    this.yB = yB;
    this.hB = hB;
    this.hT = hT;
    this.w = 50;
    this.speed = 1;
  }
}
class Bird {
  constructor() {
    this.x = 150;
    this.y = 500/2;
    this.size = 25;
    this.score = 0;
    this.gravity = 0.02;
    this.jump = 25;
  }
}
const bird = new Bird();
let cnv = document.getElementById("canvas").getContext("2d");
const tileWidth = 700,
      tileHeight = 500,
      tileDivition = 28,
      blockSize = tileWidth / tileDivition;
let globalSpeed = 1;
let reset = false;
let jumping = false;
let jumpingFactor = 4;
let timeScore = 0;
const controls = {
  respawn: "KeyR",
  space: "Space"
}

function random(bottom, top, float) {
  if( float) {
    return Math.random() * (top - bottom) + bottom;
  }
  else {
    return Math.ceil(Math.random() * (top - bottom) + bottom);
  }
}

let tunels = new Array(14);

for(let i = 0; i < tunels.length; i++) {
  let x = 300 + ((i + 1) * 300);
  let y = random(265,335, false);
  let h = 500 - y;
  let hT = 500 - h - 150;
  tunels[i] = new Tunel(x,y,h,hT);
}

function drawTunels(x,yb,hb,ht,w) {
  cnv.fillStyle = "#1D3557";
  cnv.fillRect(x,0,w,ht);
  cnv.fillRect(x,yb,w,hb);
}

function loadTunels() {
  for(let i = 0; i < tunels.length; i++) {
    let x = tunels[i].x;
    let yBottom = tunels[i].yB;
    let hBottom = tunels[i].hB;
    let hTop = tunels[i].hT;
    let width = tunels[i].w;
    let gap = tunels[i].gap;
    if(x + width < 0) {
      let prev = tunels.at(i - 1);
      tunels[i].x = prev.x + 300;
      y = random(265,335, false);
      tunels[i].yB = y;
      tunels[i].hB = 500 - y;
      tunels[i].hT = 500 - tunels[i].hB - 150;
    }
    drawTunels(x,yBottom,hBottom,hTop,width);
    tunels[i].x -= tunels[i].speed;
    globalSpeed += 0.0001;
    tunels[i].speed = globalSpeed;
  }
}

function loadBird() {
  drawBird(bird.x, bird.y, bird.size);
  bird.y += bird.gravity;
  bird.gravity +=0.048;
}
function drawBird(x,y,s) {
  cnv.fillStyle = "#E63946";
  cnv.fillRect(x,y,s,s);
}
function birdJump() {
  if(jumping) {
    //console.log(bird.jump);
   
    bird.y -= bird.jump;
    bird.jump /= jumpingFactor;
  }
}
function speed() {
  globalSpeed += 0.2;
}
function collision() {
  for(let i = 0; i < tunels.length; i++) {
    let x = tunels[i].x;
    let yt = 0;
    let hT= tunels[i].hT;
    let w = tunels[i].w;
    let yB = tunels[i].yB;
    let hB = tunels[i].hB;
      if (
    x < bird.x + bird.size &&
    x + w > bird.x &&
    yt < bird.y + bird.size &&
    hT + yt > bird.y  ||
    x < bird.x + bird.size &&
    x + w > bird.x &&
    yB < bird.y + bird.size &&
    hB + yB > bird.y
  ) {
        reset = true;
      }
  }
}
function respawn() {
  globalSpeed = 1;
  for(let i = 0; i < tunels.length; i++) {
      let x = 300 + ((i + 1) * 300);
      let y = random(265,335, false);
      let h = 500 - y;
    tunels[i].x = x;
    tunels[i].yB = y;
    tunels[i].hB = 500 - y;
    tunels[i].speed = globalSpeed;
    tunels[i].hT = 500 - tunels[i].hB - 150;
  }
  bird.y = 500/2;
  bird.score = 0;
  bird.gravity = 0.02;
  reset = false;
  game();
}
function reload() {
  cnv.fillStyle = "#A8DADC";
  cnv.fillRect(0,0,700,500);
}
function incrementScore() {
  timeScore += 1;
  if(Math.floor(timeScore) % 20 == 0) {
    bird.score += 1;
//    console.log("score increment")
  }
}

function game() {
  if(bird.y < 0 || bird.y + bird.size > 500) reset = true;
  if(reset) return;
  reload();
  loadTunels();
  loadBird();
  collision();
  birdJump();
  incrementScore();
  loadScore();
    setTimeout(()=> {
    game();
  }, 1000/100);

}

game();

document.addEventListener("keyup", (e) => {
  //console.log(e.code);
  if(e.code == controls.respawn && reset) respawn();
  if(e.code == controls.space) {
  jumping = true;
  setTimeout(() => {
    jumping = false;
    bird.gravity = 1.1;
    bird.jump = 30;
    jumpingFactor = 2;
  }, 100)
  }
})

document.addEventListener("click", () => {
  jumping = true;
  setTimeout(() => {
    jumping = false;
    bird.gravity = 0.02;
    bird.jump = 25;
    jumpingFactor = 4;
  }, 100)
})

function loadScore() {
    cnv.fillStyle = "#1D3557"
    cnv.font = "22px Verdana";
    cnv.fillText(`Score: ${bird.score}`, 5, 45);
}