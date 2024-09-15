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
  canvas.width = canvas.width; //clear canvas
  ctx.beginPath();
  if (direction) {
    ctx.fillRect(0, 0, rtxWidth, rtxHeight);
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / leftWidth, Math.PI / 2, 0, 1 * Math.PI);
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / rightWidth, Math.PI / -2, 0, 1 * Math.PI);
    ctx.clip();
    ctx.clearRect(0, 0, rtxWidth, rtxHeight);
  } else {
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / leftWidth, Math.PI / 2, 0, 1 * Math.PI);
    ctx.ellipse(rtxWidth / 2, rtxHeight / 2, rtxHeight / 2, rtxWidth / 2 / rightWidth, Math.PI / -2, 0, 1 * Math.PI);
    ctx.fill();
  }
  ctx.closePath();
}

/**
 * 绘制阴影动画
 * @param {Number} end 结束时的对象大小，为负时相当于另一个Direction下的对象widthPercent为正的值
 * @param {Number} startDirection 开始绘画时的朝向，将会在运行过程中自动修正 0: 绘制背阳面 1: 绘制向阳面
 * @param {number} time 动画时间，默认为0.3s，可不填
 */
function drawShadowWithAnimation(end, startDirection = 1, time = 0.3) {
  start = currentShadowSize;
  i = 0;
  let startTime = performance.now(); // 获取动画开始时间

  function animate() {
    let currentTime = performance.now(); // 获取当前时间
    let elapsedTime = currentTime - startTime; // 计算已经过去的时间
    let progress = elapsedTime / (time * 1000); // 计算动画进度

    if (progress >= 1) {
      currentShadowSize = end;
    } else {
      currentShadowSize = start + (end - start) * progress;
    }

    drawShadow(currentShadowSize, currentShadowSize * (startDirection - 0.5) >= 0 ? 1 : 0); // direction belongs to [0,1], so direction - 0.5 belongs to [-0.5,0.5]
    document.getElementById("asterism").style.opacity = 0; // 隐藏星芒防止乱飞难看，动画结束后会自动决定是否显示
    drawStar(currentShadowSize, startDirection);

    if (progress < 1) {
      window.requestAnimationFrame(animate);
    }
  }

  currentShadowDirection = startDirection;
  window.requestAnimationFrame(animate);
}


   
/* 
shadowSize  shadowDirection starLocation
-1          0               0     front
-0.5        0               -1~0  f
0           0               -1    f
0.5         0               0~1   back
1           0               0     b
f(x)=-cos(pi*x/2) [-1,0],cos(pi*x/2) (0,1]

-1          1               0     back
-0.5        1               0~1   b
0           1               1     b
0.5         1               -1~0  front
1           1               0     f

g(x)=cos(pi*x/2) [-1,0],-cos(pi*x/2) (0,1]

*/
/**
 * 计算恒星方位和绘制恒星（屎山代码迟早重构）
 * @param {Number} widthPercent 阴影大小
 * @param {Number} direction 方向（不需要修正）
 * @returns
 */
function drawStar(widthPercent, direction = 0) {
  let fixDirection = currentShadowSize * (direction - 0.5) >= 0 ? 1 : 0;
  let starLocation = Math.cos((Math.PI * widthPercent) / 2) * (fixDirection ? -1 : 1);
  let starZIndex;
  if (direction) {
    starZIndex = currentShadowSize < 0 ? "back" : "front";
  } else {
    starZIndex = currentShadowSize > 0 ? "back" : "front";
  }
  // console.log(starLocation, starZIndex, direction, widthPercent);
  let planetSizePercent = 0.45;
  if (starZIndex == "back") {
    let reverse = 1;
    let temp = document.getElementById("result").style.getPropertyValue("--planetRadiusPercent");
    let resultSize = document.getElementById("result").clientWidth;
    let planetSize = document.getElementById("base").clientWidth;
    planetSizePercent = temp ? temp : planetSizePercent;
    document.getElementById("star").style.opacity = 1;
    document.getElementById("asterism").style.opacity = 0.7;
    if (direction) {
      reverse = -1;
    }
    let fixStarLocation = starLocation * resultSize * (1 + 0.8 * planetSizePercent) * reverse;
    document.getElementById("result").style.setProperty("--starCenterLocation", `${fixStarLocation}px`);
    document.getElementById("asterism").style.opacity = Math.abs(fixStarLocation) < planetSize / 2 ? 0 : 0.7;
  } else {
    document.getElementById("star").style.opacity = 0;
    document.getElementById("asterism").style.opacity = 0;
  }
  return [starZIndex, starLocation];
}
const base = document.getElementById("base");
const canvas = document.getElementById("shadow");
const ctx = canvas.getContext("2d");
drawShadowWithAnimation((currentShadowSize = 0.75), (currentShadowDirection = 0));
