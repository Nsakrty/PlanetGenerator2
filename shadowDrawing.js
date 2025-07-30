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
 * 绘制阴影动画（返回Promise，动画结束时resolve）
 * @param {Number} end 结束时的对象大小
 * @param {Number} startDirection 开始朝向
 * @param {number} time 动画时间
 * @returns {Promise} 动画结束的Promise
 */
async function drawShadowWithAnimation(end, startDirection = 1, time = 0.3) {
  return new Promise((resolve) => { // 封装为Promise
    const start = currentShadowSize;
    const startTime = performance.now();
    let animationFrameId; // 用于存储动画帧ID

    // 如果方向不同，分阶段执行动画（使用Promise链式调用）
    if (startDirection !== currentShadowDirection && config.useAnimation) {
      const firstExecuteDistance = Math.abs(1 - currentShadowSize);
      const gapExecuteDelayTime = 0.05;
      const secondExecuteDistance = Math.abs(end - -1);
      const totalDistance = firstExecuteDistance + secondExecuteDistance;
      const adjustedTime = time - gapExecuteDelayTime;
      const firstExecuteDelayTime = (firstExecuteDistance / totalDistance) * adjustedTime;
      const secondExecuteDelayTime = (secondExecuteDistance / totalDistance) * adjustedTime;

      // 链式执行三个阶段动画
      drawShadowWithAnimation(1, currentShadowDirection, firstExecuteDelayTime)
        .then(() => pauseFrame()) // 等待一帧确保渲染完成
        .then(() => drawShadowWithAnimation(-1, (currentShadowDirection = startDirection), 0))
        .then(() => pauseFrame(gapExecuteDelayTime * 1000)) // 间隙等待（可选）
        .then(() => drawShadowWithAnimation(end, currentShadowDirection, secondExecuteDelayTime))
        .then(resolve); // 全部完成后resolve
      return;
    }

    // 动画帧函数
    function animate() {
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;
      const progress = elapsedTime / (time * 1000);

      if (progress >= 1) {
        currentShadowSize = end;
        drawShadow(Math.sin((currentShadowSize * Math.PI) / 2), currentShadowSize * (startDirection - 0.5) >= 0 ? 1 : 0);
        drawStar(currentShadowSize, startDirection);
        currentShadowDirection = startDirection;
        resolve(); // 动画结束，resolve Promise
        return;
      }

      currentShadowSize = start + (end - start) * progress;
      drawShadow(Math.sin((currentShadowSize * Math.PI) / 2), currentShadowSize * (startDirection - 0.5) >= 0 ? 1 : 0);
      if (config.useAnimation) document.getElementById("asterism").style.opacity = 0;
      drawStar(currentShadowSize, startDirection);

      animationFrameId = window.requestAnimationFrame(animate);
    }

    currentShadowDirection = startDirection;
    animationFrameId = window.requestAnimationFrame(animate);

    // 防止意外情况，添加超时处理
    const timeoutId = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      resolve();
    }, time * 1000 + 100);
  });
}

/**
 * 等待指定毫秒数（基于requestAnimationFrame实现，更精确）
 * @param {number} ms 毫秒数，默认0（等待一帧）
 * @returns {Promise}
 */
function pauseFrame(ms = 0) {
  return new Promise((resolve) => {
    if (ms <= 0) {
      // 等待下一帧
      requestAnimationFrame(resolve);
    } else {
      // 等待指定毫秒
      const start = performance.now();
      function check() {
        if (performance.now() - start >= ms) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      }
      requestAnimationFrame(check);
    }
  });
}

// 移除原来的pauseSecond，用pauseFrame替代

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
  // let planetSizePercent = 0.45;
  const planetStyle = document.getElementById("result").style;
  let planetSizePercent = planetStyle.getPropertyValue("--planetRadiusPercent");
  if (starZIndex == "back") {
    let reverse = 1;
    let temp = planetStyle.getPropertyValue("--planetRadiusPercent");
    let resultSize = Math.min(500, document.body.clientWidth - 2 * 8);
    // let resultSize = document.getElementById("result").clientWidth;
    // console.log(resultSize);
    let planetSize = document.getElementById("base").clientWidth;
    planetSizePercent = temp ? temp : planetSizePercent;
    document.getElementById("star").style.opacity = 1;
    document.getElementById("asterism").style.opacity = 0.7;
    if (direction) {
      reverse = -1;
    }
    let fixStarLocation = starLocation * resultSize * (1 + 0.8 * planetSizePercent) * reverse;
    // planetStyle.setProperty("--starCenterLocation", `${fixStarLocation}px`);
    planetStyle.setProperty("--starCenterLocation", `${starLocation * (1 + 0.8 * planetSizePercent) * reverse} * var(--resultSize)`);
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

function pauseSecond(time) {
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
}
