/**
 * 绘制阴影
 * @param {number} direction 0: 绘制背阳面 1: 绘制向阳面
 * @param {number} widthPercent 对象宽度/星球半径[-1,1] 正为右，负为左
 * @return {void}
 */
function drawShadow(widthPercent, direction = 0) {
  canvas.width = base.clientWidth;
  canvas.height = base.clientHeight;
  let rtxWidth = canvas.width;
  let rtxHeight = canvas.height;
  let leftWidth, rightWidth;
  if (widthPercent > 0) {
    rightWidth = 1 / widthPercent;
    leftWidth = 1;
  } else {
    leftWidth = 1 / -widthPercent;
    rightWidth = 1;
  }
  // console.log(WidthPercent,Direction);
  canvas.width = canvas.width; //clear canvas
  ctx.beginPath();
  if (direction) {
    ctx.fillRect(0, 0, rtxWidth, rtxHeight);
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / leftWidth, Math.PI / 2, 0, 1 * Math.PI);
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / rightWidth, Math.PI / -2, 0, 1 * Math.PI);
    ctx.clip();
    ctx.clearRect(0, 0, 350, 350);
  } else {
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / leftWidth, Math.PI / 2, 0, 1 * Math.PI);
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / rightWidth, Math.PI / -2, 0, 1 * Math.PI);
    ctx.fill();
  }
  ctx.closePath();
}

let shadowAnimationTimer;
/**
 * 绘制阴影动画
 * @param {Number} end 结束时的阴影大小
 * @param {Number} direction 0: 绘制背阳面 1: 绘制向阳面
 * @param {number} time 动画时间，默认为0.3s，可不填
 */
function drawShadowWithAnimation(end, direction = 1, time = 0.3) {
  start = currentShadowSize;
  clearInterval(shadowAnimationTimer);
  i = 0;
  dt = 1000 / 60;
  dk = ((end - start) / time / 1000) * dt;
  shadowAnimationTimer = setInterval(() => {
    drawShadow(currentShadowSize, currentShadowSize * (direction - 0.5) >= 0 ? 1 : 0); //direction belongs to [0,1],so direction - 0.5 belongs to [-0.5,0.5]
    drawStar(currentShadowSize, direction);
    currentShadowSize += dk;
    i++ == Math.round((time * 1000) / dt) ? clearInterval(shadowAnimationTimer) & (currentShadowSize = end) : null;
  }, dt);

  currentShadowDirection = direction;
}

/* 
shadowSize  shadowDirection starLocation
-1          0               0     f
-0.5        0               -1~0  f
0           0               -1    f
0.5         0               0~1   b
1           0               0     b
f(x)=-cos(pi*x/2) [-1,0],cos(pi*x/2) (0,1]

-1          1               0     b
-0.5        1               0~1   b
0           1               1     b
0.5         1               -1~0  f
1           1               0     f

g(x)=cos(pi*x/2) [-1,0],-cos(pi*x/2) (0,1]

*/
/**
 * 
 * @param {Number} widthPercent 阴影大小
 * @param {Number} direction 方向（不需要修正）
 * @returns 
 */
function drawStar(widthPercent, direction = 0) {
  let fixDirection = currentShadowSize * (direction - 0.5) >= 0 ? 1 : 0;
  // let starLocation = Math.cos((Math.PI * widthPercent) / 2) * (widthPercent >= 0 ? 1 : -1) * (direction ? -1 : 1);
  let starLocation = Math.cos((Math.PI * widthPercent) / 2) * (fixDirection ? -1 : 1);
  let starZIndex;
  if (direction) {
    starZIndex = currentShadowSize < 0 ? "back" : "front";
  } else {
    starZIndex = currentShadowSize > 0 ? "back" : "front";
  }
  // console.log(starLocation, starZIndex);
  return [starLocation, starZIndex];
}

const base = document.getElementById("base");
const canvas = document.getElementById("shadow");
const ctx = canvas.getContext("2d");
drawShadow((currentShadowSize = 0.5), (currentShadowDirection = 1));
