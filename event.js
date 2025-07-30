const moveValue = 20;
const scaleValue = 0.1;
const rotateValue = 3; // 定义配置参数数组
const longPressConfigs = [
  { id: "moveUp", handler: () => moveY(moveValue) },
  { id: "moveDown", handler: () => moveY(-moveValue) },
  { id: "moveLeft", handler: () => moveX(moveValue) },
  { id: "moveRight", handler: () => moveX(-moveValue) },
  { id: "scaleUp", handler: () => scale(scaleValue) },
  { id: "scaleDown", handler: () => scale(-scaleValue) },
  { id: "rotateAdd", handler: () => rotate(rotateValue) },
  { id: "rotateSub", handler: () => rotate(-rotateValue) },
];
// 循环绑定长按事件
longPressConfigs.forEach((config) => {
  const element = document.getElementById(config.id);
  if (element) {
    longPress(element, config.handler);
  }
});
// 提取按键映射配置
const keyActions = {
  w: () => moveY(moveValue),
  s: () => moveY(-moveValue),
  a: () => moveX(moveValue),
  d: () => moveX(-moveValue),
  "+": () => scale(scaleValue),
  "=": () => scale(scaleValue),
  "-": () => scale(-scaleValue),
  h: () => goHome(),
  q: () => rotate(-rotateValue),
  e: () => rotate(rotateValue),
  v: () =>
    changeMode(
      "displayBackground",
      document.getElementById("showBackgroundButton")
    ),
  f: () => {
    fullScreen();
  },
  g: () => {
    randomGenerate();
  },
  "?": () => help(),
  "/": () => help(),
};

// 输入状态检查函数
const isInInput = (target) => {
  return (
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
  );
};

// 重构后的事件监听
document.addEventListener("keydown", (event) => {
  // 检查当前是否处于输入状态
  if (isInInput(event.target)) {
    return;
  }

  // 获取对应的操作并执行
  const action = keyActions[event.key.toLowerCase()];
  if (action) {
    action();
  }
});
