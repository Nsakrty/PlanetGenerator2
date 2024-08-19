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
  console.log(WidthPercent,Direction);
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
const base = document.getElementById("base");
const canvas = document.getElementById("shadow");
const ctx = canvas.getContext("2d");
drawShadow(0.5, 1);
