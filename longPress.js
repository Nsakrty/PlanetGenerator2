let delayTime = 100
 function longPress(element, callback) {
  let timer;
  let isPressed = false;
  element.addEventListener("selectStart",()=>{
    element.preventDefault()
  })
  element.addEventListener("mousedown", () => {
    isPressed = true;
    callback()
    timer = setInterval(callback, delayTime); 
  });

  element.addEventListener("mouseup", () => {
    isPressed = false;
    clearInterval(timer);
  });

  element.addEventListener("mouseleave", () => {
    isPressed = false;
    clearInterval(timer);
  });

  element.addEventListener("touchstart",()=>{
    isPressed = true;
    callback();
    timer = setInterval(callback, delayTime); 
    element.preventDefault()
  }
  );
  element.addEventListener("touchend",()=>{
    isPressed = false;
    clearInterval(timer);
  })
}
