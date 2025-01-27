let delayTime = 100;
function longPress(element, callback) {
  let timer;
  let isPressed = false;
  // element.addEventListener("click" , () => {
  //   if (!isPressed) {callback();console.log("clicked")}
  // })
  element.addEventListener("mousedown", () => {
    isPressed = true;
    callback();
    timer = setInterval(callback, delayTime);
    console.log("long pressed")
  });

  element.addEventListener("mouseup", () => {
    isPressed = false;
    clearInterval(timer);
  });

  element.addEventListener("mouseleave", () => {
    isPressed = false;
    clearInterval(timer);
  });

  element.addEventListener("touchstart", () => {
    isPressed = true;
    callback();
    timer = setInterval(callback, delayTime);
    element.preventDefault();
  });
  element.addEventListener("touchend", () => {
    isPressed = false;
    clearInterval(timer);
  });
}
