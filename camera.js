function scale(value, mode = "add") {
  let currentScale = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--cameraScale")
  );
  if (mode === "add") {
    if (currentScale + value < 12 && currentScale + value > 0.1)
      result.style.setProperty("--cameraScale", currentScale + value);
  } else if (mode === "set") {
    if (value > 0.1) result.style.setProperty("--cameraScale", value);
  }
}
function moveX(value, mode = "add") {
  let currentScale = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--cameraScale")
  );
  let currentX = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--cameraX")
  );
  if (mode === "add") {
    result.style.setProperty(
      "--cameraX",
      `${currentX + value / currentScale}px`
    );
  } else if (mode === "set") {
    result.style.setProperty("--cameraX", `${value}px`);
  }
}
function moveY(value, mode = "add") {
  let currentScale = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--cameraScale")
  );
  let currentY = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--cameraY")
  );
  if (mode === "add") {
    result.style.setProperty(
      "--cameraY",
      `${currentY + value / currentScale}px`
    );
  } else if (mode === "set") {
    result.style.setProperty("--cameraY", `${value}px`);
  }
}
function rotate(value, mode = "add") {
  let currentRotate = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--planetRotate")
  );
  let currentRotateOffset = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--planetRotateOffset")
  );
  if (mode === "add") {
    result.style.setProperty(
      "--planetRotateOffset",
      `${currentRotateOffset + value}deg`
    );
  } else if (mode === "set") {
    result.style.setProperty("--planetRotateOffset", `${value}deg`);
  }

  fixCameraLocation(value);
}
function fixCameraLocation(degValue) {
  const X = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--cameraX")
  );
  const Y = parseFloat(
    window.getComputedStyle(result).getPropertyValue("--cameraY")
  );
  const rad = (degValue * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const useAnimation = config.useAnimation;
  config.useAnimation = 0;
  // setAnimationTime();
  moveX(X * cos - Y * sin, "set");
  moveY(X * sin + Y * cos, "set");
  config.useAnimation = useAnimation;
  // setAnimationTime();
}
