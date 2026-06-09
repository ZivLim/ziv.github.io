const WIDTH = 1200;
const HEIGHT = 600;

const GRAVITY = 0.6;
const MOVE_SPEED = 3.5;
const JUMP_FORCE = -11;

let currentLevel = 1;
let gameState = "start";   // 一开始先显示开始画面
let players = [];
let platforms = [];
let slopes = [];
let hazards = [];
let gems = [];
let doors = [];
let seesaw;
let timer = 120;

// 全局变量
let movingPlatform;
let buttons = [];
let stairs = [];
let road = [];
let blowers = [];  // Level 2 风扇平台
let level1Remaining = 0;
let level2Remaining = 0;


function setup() {
  createCanvas(WIDTH, HEIGHT);
  currentLevel = 1;
  gameState = "start";   // 等 ENTER 后再真正 loadLevel(1)
}

// 切换关卡（通用）
function loadLevel(n) {
  currentLevel = n;

  if (n === 1) {
    initLevel();   // Level 1
  } else if (n === 2) {
    loadLevel2();  // Level 2
  }

  gameState = "play";
  timer = 120;
}

/* =========================================================
                        LEVEL 1
========================================================= */

function initLevel() {
  // A 保持：你原本的 Level 1 坐标不动
  players = [
    createPlayer("red", "#ff4b4b",
      { left: LEFT_ARROW, right: RIGHT_ARROW, jump: UP_ARROW },
      40, HEIGHT - 150),
    createPlayer("blue", "#4fa9ff",
      { left: 65, right: 68, jump: 87 },
      100, HEIGHT - 150)
  ];

  platforms = [
    { x: 0, y: HEIGHT - 80, w: WIDTH, h: 80 },

    // 最底部平台
    { x: 310, y: HEIGHT - 150, w: 45, h: 20 }, 
    { x: 430, y: HEIGHT - 150, w: 30, h: 20 },
    { x: 540, y: HEIGHT - 150, w: 55, h: 20 },
    { x: 650, y: HEIGHT - 150, w: 35, h: 20 },
    { x: 760, y: HEIGHT - 150, w: 45, h: 20 },
    { x: 870, y: HEIGHT - 150, w: 55, h: 20 },
    { x: 980, y: HEIGHT - 150, w: 30, h: 20 },
    { x: 1060, y: HEIGHT - 150, w: 35, h: 20 },
    { x: 1150, y: HEIGHT - 150, w: 50, h: 20 },

    // 第二层
    { x: 950, y: HEIGHT - 240, w: 160, h: 20 },
    { x: 640, y: HEIGHT - 320, w: 200, h: 20 },
    { x: 330, y: HEIGHT - 280, w: 160, h: 20 },
    { x: 180, y: HEIGHT - 320, w: 100, h: 20 },

    // 第三层
    { x: 80, y: HEIGHT - 370, w: 20, h: 70 },
    { x: 130, y: HEIGHT - 420, w: 250, h: 20 },
    { x: 750, y: HEIGHT - 440, w: 50, h: 20 },
    { x: 850, y: HEIGHT - 440, w: 50, h: 20 },
    { x: 950, y: HEIGHT - 440, w: 50, h: 20 },
    { x: 1070, y: HEIGHT - 440, w: 130, h: 20 }
  ];

  slopes = [
    { x1: 840, y1: HEIGHT - 320, x2: 950, y2: HEIGHT - 240, thickness: 20 },
    { x1: 490, y1: HEIGHT - 280, x2: 640, y2: HEIGHT - 320, thickness: 20 },
    { x1: 280, y1: HEIGHT - 320, x2: 330, y2: HEIGHT - 280, thickness: 20 },
    { x1: 80,  y1: HEIGHT - 200, x2: 180, y2: HEIGHT - 320, thickness: 20 },
    { x1: 80,  y1: HEIGHT - 370, x2: 130, y2: HEIGHT - 420, thickness: 20 }
  ];

  buttons = [
    { x: 400, y: HEIGHT - 290, w: 30, h: 10, pressed: false },
    { x: 200, y: HEIGHT - 430, w: 30, h: 10, pressed: false }
  ];

  movingPlatform = {
    x: 0,
    y: HEIGHT - 200,
    w: 80,
    h: 20,
    baseY: HEIGHT - 200,
    targetY: HEIGHT - 200,
    speed: 2
  };

  hazards = [
    { x: 250, y: HEIGHT - 95, w: WIDTH, h: 30, color: "green" } // 绿水两人都死
  ];

  seesaw = {
    cx: 600,
    baseY: HEIGHT - 470,
    half: 100,
    thickness: 12,
    offset: 0,
    targetOffset: 0
  };

  doors = [
    { x: WIDTH - 110, y: HEIGHT - 520, w: 40, h: 55, color: "red" },
    { x: WIDTH - 60,  y: HEIGHT - 520, w: 40, h: 55, color: "blue" }
  ];

  gems = [
    gem(140, HEIGHT - 210, "red"),
    gem(260, HEIGHT - 210, "blue"),
    gem(380, HEIGHT - 250, "red"),
    gem(500, HEIGHT - 250, "blue"),
    gem(700, HEIGHT - 210, "red"),
    gem(100, HEIGHT - 250, "blue"),
    gem(350, HEIGHT - 330, "red"),
    gem(580, HEIGHT - 340, "blue"),
    gem(760, HEIGHT - 340, "red"),
    gem(120, HEIGHT - 370, "blue"),
    gem(260, HEIGHT - 400, "red"),
    gem(500, HEIGHT - 380, "blue")
  ];

  // Level1 不用
  road = [];
  blowers = [];
}

/* =========================================================
                        LEVEL 2
========================================================= */

function loadLevel2() {
  currentLevel = 2;
  gameState = "play";
  timer = 120;

  players = [
    createPlayer("red", "#ff4b4b",
      { left: LEFT_ARROW, right: RIGHT_ARROW, jump: UP_ARROW },
      300, HEIGHT - 100),
    createPlayer("blue", "#4fa9ff",
      { left: 65, right: 68, jump: 87 },
      900, HEIGHT - 100)
  ];

  platforms = [
    { x: 0, y: HEIGHT - 40, w: WIDTH, h: 40 },
    { x: 500, y: HEIGHT - 150, w: 100, h:110},

    { x: 0, y: HEIGHT - 200, w: 400, h: 20},
    { x: 700, y: HEIGHT - 200, w: 500, h: 20},
    { x: 0, y: HEIGHT - 250, w: 100, h: 50},
    { x: 1100, y: HEIGHT - 250, w: 100, h: 50},

    { x: 170, y: HEIGHT - 300, w: 850, h: 20},

    { x: 0, y: HEIGHT - 360, w: 100, h: 20},
    { x: 1100, y: HEIGHT - 360, w: 100, h: 20},

    { x: 350, y: HEIGHT - 550, w: 20, h: 250},
    { x: 850, y: HEIGHT - 550, w: 20, h: 250},

    { x: 700, y: HEIGHT - 550, w: 400, h: 20},
    { x: 100, y: HEIGHT - 550, w: 400, h: 20},

    { x: 580, y: HEIGHT - 500, w: 40, h: 20}
  ];

  road = [
    { x1: 500, y1: 600, x2: 500, y2: 450, x3: 350, y3: 600 },
    { x1: 750, y1: 600, x2: 600, y2: 450, x3: 600, y3: 600 }
  ];

  slopes = [
    // 底部倒 V
    { x1: 350, y1: 600, x2: 500, y2: 450, thickness: 20 },
    { x1: 600, y1: 450, x2: 750, y2: 600, thickness: 20 },

    // 上面小倒 V
    { x1: 500, y1: 200, x2: 580, y2: 100, thickness: 20 },
    { x1: 620, y1: 100, x2: 700, y2: 200, thickness: 20 }
  ];

  blowers = [
    { x: 0,    y: HEIGHT - 360, w: 100, h: 20, dir: 1 },   // 向右吹
    { x: 1100, y: HEIGHT - 360, w: 100, h: 20, dir: -1 }   // 向左吹
  ];

  hazards = [
    { x: 140, y: HEIGHT - 60, w: 200, h: 20, color: "red" },
    { x: 800, y: HEIGHT - 60, w: 200, h: 20, color: "blue" },
    { x: 800, y: HEIGHT - 220, w: 200, h: 20, color: "red" },
    { x: 140, y: HEIGHT - 220, w: 200, h: 20, color: "blue" },
    { x: 380, y: HEIGHT - 320, w: 80, h: 20, color: "red" },
    { x: 760, y: HEIGHT - 320, w: 80, h: 20, color: "blue" }
  ];

  doors = [
    { x: 400, y: HEIGHT - 355, w: 40, h: 55, color: "red" },
    { x: 780, y: HEIGHT - 355, w: 40, h: 55, color: "blue" }
  ];

  gems = [
    gem(550, HEIGHT - 455, "red"),
    gem(590, HEIGHT - 455, "blue"),

    gem(200, HEIGHT - 380, "red"),
    gem(980, HEIGHT - 380, "blue"),

    gem(200, HEIGHT - 120, "blue"),
    gem(980, HEIGHT - 120, "red")
  ];

  // 关掉 Level1 的 seesaw / button / yellow platform
  seesaw = {
    cx: 0,
    baseY: 0,
    half: 0,
    thickness: 0,
    offset: 0,
    targetOffset: 0
  };

  buttons = [];
  movingPlatform = { x: 0, y: -9999, w: 0, h: 0, baseY: 0, targetY: 0, speed: 0 };
}

/* =========================================================
                        通用对象
========================================================= */

function createPlayer(name, color, controls, x, y) {
  return {
    name,
    color,
    controls,
    x, y,
    w: 32, h: 44,
    vx: 0, vy: 0,
    onGround: false,
    gems: 0
  };
}

function gem(x, y, color) {
  return { x, y, r: 12, color, collected: false };
}

/* =========================================================
                        主循环
========================================================= */

function draw() {
  background(40, 32, 20);

  if (gameState === "start") {
    drawStart();
    return;
  }
  if (gameState === "gameover") {
    drawGameOver();
    return;
  }
  if (gameState === "win") {
    drawWin();
    return;
  }

  // play
  timer -= deltaTime / 1000;
  if (timer <= 0) {
    timer = 0;
    gameState = "gameover";
    return;
}


  drawBackground();
  updateSeesaw();
  handleInput();
  updatePlayers();

  updateButtons();
  updateMovingPlatform();

  collectGems();
  checkDoors();
  drawWorld();
  drawUI();
}

/* =========================================================
                      画面 / UI
========================================================= */

function drawStart() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("FIREBOY & WATERGIRL", WIDTH / 2, HEIGHT / 2 - 40);
  textSize(14);
  text("Red = Arrow keys   Blue = WASD", WIDTH / 2, HEIGHT / 2);
  text("Collect gems, avoid water, go to your door", WIDTH / 2, HEIGHT / 2 + 30);
  text("Press ENTER to start Level 1", WIDTH / 2, HEIGHT / 2 + 70);

  if (keyIsDown(ENTER)) {
    loadLevel(1);
  }
}

function drawGameOver() {
  background(120, 10, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("GAME OVER", WIDTH / 2, HEIGHT / 2 - 10);
  textSize(16);
  text("Press R to restart level", WIDTH / 2, HEIGHT / 2 + 25);
}

function drawWin() {
  background(20, 120, 60);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("YOU WIN!", WIDTH / 2, HEIGHT / 2 - 10);
  textSize(16);
  let totalRemaining = (level1Remaining + level2Remaining).toFixed(2);
  text("Total Time: " + timer.toFixed(2) + "s", WIDTH / 2, HEIGHT / 2 + 25);
}

function drawBackground() {
  noStroke();
  fill(30, 26, 18);
  for (let x = 0; x < WIDTH; x += 48) {
    for (let y = 0; y < HEIGHT; y += 32) {
      rect(x, y, 46, 30);
    }
  }
}

/* =========================================================
                    输入 & 物理
========================================================= */

function handleInput() {
  for (let p of players) {
    p.vx = 0;

    if (keyIsDown(p.controls.left))  p.vx -= MOVE_SPEED;
    if (keyIsDown(p.controls.right)) p.vx += MOVE_SPEED;

    if (p.onGround && keyIsDown(p.controls.jump)) {
      p.vy = JUMP_FORCE;
      p.onGround = false;
    }
  }
}

function updatePlayers() {
  for (let p of players) {
    p.vy += GRAVITY;

    // Level2 才有吹风（不过 blowers 在 Level1 为空，也不会影响）
    applyBlowers(p);

    p.x += p.vx;
    resolveCollisions(p, true);

    p.y += p.vy;
    resolveCollisions(p, false);

    updateSlopeCollision(p);

    // 掉到底部死亡 → 重开当前关
    if (p.y > HEIGHT) {
      loadLevel(currentLevel);
      return;
    }
  }
}

/* =========================================================
                  平台 + hazard 碰撞
========================================================= */

function resolveCollisions(p, horizontal) {
  const staticPlatforms = [...platforms, movingPlatform, ...seesawRects()];

  for (let plat of staticPlatforms) {
    if (!collide(p, plat)) continue;

    if (horizontal) {
      if (p.vx > 0) p.x = plat.x - p.w;
      else if (p.vx < 0) p.x = plat.x + plat.w;
    } else {
      if (p.vy > 0) {
        p.y = plat.y - p.h;
        p.vy = 0;
        p.onGround = true;
      } else if (p.vy < 0) {
        p.y = plat.y + plat.h;
        p.vy = 0;
      }
    }
  }

  // 水池 / 绿水死亡
  for (let h of hazards) {
    if (!collide(p, h)) continue;

    if (h.color === "green") {
      loadLevel(currentLevel);
      return;
    }
    // 红池杀 blue，蓝池杀 red
    if (h.color !== p.name) {
      loadLevel(currentLevel);
      return;
    }
  }
}

/* =========================================================
                        斜坡
========================================================= */

function updateSlopeCollision(p) {
  for (let s of slopes) {
    if (p.x + p.w < s.x1 || p.x > s.x2) continue;

    let t = (p.x + p.w / 2 - s.x1) / (s.x2 - s.x1);
    t = constrain(t, 0, 1);

    let slopeY = lerp(s.y1, s.y2, t);

    if (p.vy >= 0 && p.y + p.h >= slopeY && p.y + p.h <= slopeY + s.thickness) {
      p.y = slopeY - p.h;
      p.vy = 0;
      p.onGround = true;
      return;
    }

    if (p.vy < 0 && p.y <= slopeY + s.thickness && p.y >= slopeY - 10) {
      p.y = slopeY + s.thickness;
      p.vy = 0;
      return;
    }
  }
}

/* =========================================================
                seesaw & button & platform
========================================================= */

function seesawRects() {
  if (!seesaw || seesaw.half === 0) return [];
  return [seesawLeft(), seesawRight()];
}

function seesawLeft() {
  return {
    x: seesaw.cx - seesaw.half,
    y: seesaw.baseY - seesaw.offset,
    w: seesaw.half,
    h: seesaw.thickness
  };
}

function seesawRight() {
  return {
    x: seesaw.cx,
    y: seesaw.baseY + seesaw.offset,
    w: seesaw.half,
    h: seesaw.thickness
  };
}

function updateSeesaw() {
  if (!seesaw || seesaw.half === 0) return;

  const left = seesawLeft();
  const right = seesawRight();

  const leftOn = players.some(p => collide(p, left));
  const rightOn = players.some(p => collide(p, right));

  if (leftOn && !rightOn)      seesaw.targetOffset = 28;
  else if (rightOn && !leftOn) seesaw.targetOffset = -28;
  else                         seesaw.targetOffset = 0;

  seesaw.offset = lerp(seesaw.offset, seesaw.targetOffset, 0.07);
}

function updateButtons() {
  for (let b of buttons) {
    b.pressed = false;

    for (let p of players) {
      const px = p.x + p.w / 2;
      const py = p.y + p.h;

      if (
        px >= b.x &&
        px <= b.x + b.w &&
        py >= b.y &&
        py <= b.y + b.h + 10
      ) {
        b.pressed = true;
      }
    }
  }
}

function updateMovingPlatform() {
  if (!movingPlatform || movingPlatform.h === 0) return;

  movingPlatform.lastY = movingPlatform.y;

  let active = buttons.some(b => b.pressed);
  movingPlatform.targetY =
    active ? movingPlatform.baseY - 120 : movingPlatform.baseY;

  if (movingPlatform.y > movingPlatform.targetY)
    movingPlatform.y -= movingPlatform.speed;
  else if (movingPlatform.y < movingPlatform.targetY)
    movingPlatform.y += movingPlatform.speed;
}

/* =========================================================
                    吹风平台（风扇）
========================================================= */

function applyBlowers(p) {
  if (!blowers) return;

  for (let b of blowers) {
    const feetX = p.x + p.w / 2;
    const feetY = p.y + p.h;

    if (
      feetX >= b.x &&
      feetX <= b.x + b.w &&
      feetY >= b.y - 5 &&
      feetY <= b.y + 15
    ) {
      p.vy = -15;
      p.vx += b.dir * 2.0;
      p.onGround = false;
    }
  }
}

/* =========================================================
                      绘制世界
========================================================= */

function drawWorld() {
  drawSlope();
  drawButtons();
  drawMovingPlatform();
  drawPlatforms();
  drawSeesaw();
  drawBlowers();
  drawRoad();
  drawGems();
  drawDoors();
  drawPlayers();
  drawHazards();
}

function drawSlope() {
  fill(110, 90, 60);
  for (let s of slopes) {
    triangle(s.x1, s.y1, s.x2, s.y2, s.x2, s.y2 + s.thickness);
    triangle(s.x1, s.y1 + s.thickness, s.x1, s.y1, s.x2, s.y2 + s.thickness);
  }
}

function drawButtons() {
  for (let b of buttons) {
    fill(b.pressed ? "orange" : "yellow");
    rect(b.x, b.y, b.w, b.h);
  }
}

function drawMovingPlatform() {
  if (!movingPlatform || movingPlatform.h === 0) return;
  fill("yellow");
  rect(movingPlatform.x, movingPlatform.y, movingPlatform.w, movingPlatform.h);
}

function drawPlatforms() {
  fill("#6f5c3a");
  for (let p of platforms) rect(p.x, p.y, p.w, p.h);
}

function drawRoad() {
  fill("#6f5c3a");
  for (let d of road) {
    triangle(d.x1, d.y1, d.x2, d.y2, d.x3, d.y3);
  }
}

function drawBlowers() {
  if (!blowers) return;
  fill("#ffeb3b");
  for (let b of blowers) {
    rect(b.x, b.y, b.w, b.h / 2);
  }
}

function drawHazards() {
  for (let h of hazards) {
    if (h.color === "green") fill("#3ddc84");
    else if (h.color === "red") fill("#ff4444");
    else fill("#4fa9ff");
    rect(h.x, h.y, h.w, h.h);
  }
}

function drawSeesaw() {
  fill("#7c6847");
  for (let s of seesawRects()) rect(s.x, s.y, s.w, s.h);
}

function drawDoors() {
  for (let d of doors) {
    fill("#c3a569");
    rect(d.x, d.y, d.w, d.h);
    fill(d.color === "red" ? "#ff4444" : "#4fa9ff");
    rect(d.x + 6, d.y + 6, d.w - 12, d.h - 12);
  }
}

function drawGems() {
  for (let g of gems) {
    if (g.collected) continue;
    push();
    translate(g.x, g.y);
    fill(g.color === "red" ? "#ff4444" : "#4fa9ff");
    beginShape();
    vertex(0, -g.r);
    vertex(g.r, 0);
    vertex(0, g.r);
    vertex(-g.r, 0);
    endShape(CLOSE);
    pop();
  }
}

function drawPlayers() {
  for (let p of players) {
    fill(p.color);
    rect(p.x, p.y, p.w, p.h);
  }
}

/* =========================================================
                 钻石 / 门 / UI / 键盘
========================================================= */

function collectGems() {
  for (let p of players) {
    for (let g of gems) {
      if (g.collected || g.color !== p.name) continue;
      if (dist(p.x, p.y, g.x, g.y) < 30) {
        g.collected = true;
        p.gems++;
      }
    }
  }
}

function checkDoors() {
  let allIn = true;
  for (let p of players) {
    let door = doors.find(d => d.color === p.name);
    if (!collide(p, door)) allIn = false;
  }

  if (!allIn) return;

  if (currentLevel === 1) {
    level1Remaining = timer;
    loadLevel(2);   // 进门 → 去第二关
  } else {
    level2Remaining = timer;
    gameState = "win"; // 第二关过了就胜利
  }
}

function drawUI() {
  fill(0, 120);
  rect(0, 0, WIDTH, 40);

  fill("#ff7b7b");
  textAlign(LEFT, CENTER);
  text(`Red gems: ${players[0].gems}`, 20, 15);

  fill("#7bc5ff");
  text(`Blue gems: ${players[1].gems}`, 20, 30);

  fill(255);
  textAlign(RIGHT, CENTER);
  text(`Time: ${timer.toFixed(2)}s`, WIDTH - 20, 20);
}

function keyPressed() {
  if (key === "r" || key === "R") {
    gameState = "play";
    loadLevel(currentLevel);
  }
}

// AABB 碰撞
function collide(a, b) {
  if (!a || !b) return false;
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}
