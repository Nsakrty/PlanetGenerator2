/**
 * 绘制阴影
 * @param {number} Direction 0: 绘制背阳面 1: 绘制向阳面
 * @param {number} WidthPercent 对象宽度/星球半径[-1,1] 正为右，负为左
 * @return {void}
 */
function drawShadow(WidthPercent, Direction = 0) {
  canvas.width = base.clientWidth;
  canvas.height = base.clientHeight;
  let rtxWidth = canvas.width;
  let rtxHeight = canvas.height;
  let leftWidth, rightWidth;
  if (WidthPercent > 0) {
    rightWidth = 1 / WidthPercent;
    leftWidth = 1;
  } else {
    leftWidth = 1 / -WidthPercent;
    rightWidth = 1;
  }
  // console.log(WidthPercent,Direction);
  canvas.width = canvas.width; //clear canvas
  ctx.beginPath();
  if (Direction) {
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
function drawShadowWithAnimation(end, direction = 1, time = 0.3) {
  start = currentShadowSize;
  clearInterval(shadowAnimationTimer);
  i = 0;
  k = start;
  dt = 1000 / 40;
  dk = ((end - start) / time / 1000) * dt;
  shadowAnimationTimer = setInterval(() => {
    drawShadow(k, k * (direction - 0.5) >= 0 ? 1 : 0); //direction belongs to [0,1],so direction - 0.5 belongs to [-0.5,0.5]
    k += dk;
    i++ == Math.round((time * 1000) / dt) ? clearInterval(shadowAnimationTimer) : null;
  }, dt);
  currentShadowSize = end;
  currentShadowDerection = direction;
}
const base = document.getElementById("base");
const canvas = document.getElementById("shadow");
const ctx = canvas.getContext("2d");
drawShadow(currentShadowSize = 0.5, currentShadowDerection = 1);
