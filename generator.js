function generate(planetData) {
  const planetStyle = document.getElementById("result").style;
  const table = [
    ["--planetColor", planetData.color],
    ["--planetRadiusPercent", planetData.radiusPercent],
    ["--planetRotate", planetData.rotate],
    ["--planetAtmosphereSize", planetData.atmosphere.size],
    ["--planetCloudRotate", planetData.cloud.rotate],
    ["--planetCloudOpacity", planetData.cloud.opacity],
    ["--planetDetailColor", planetData.detail.color],
    ["--planetDetailOpacity", planetData.detail.opacity],
    ["--planetDetailRotate", planetData.detail.rotate],
    ["--planetRingOpacity", planetData.ring.opacity],
    ["--planetRingRotate", planetData.ring.rotate],
    ["--planetRingColor", planetData.ring.color],
  ];
  table.forEach((item) => {
    planetStyle.setProperty(...item);
  });
  console.log(planetData);
}
function randomGenerate() {
  let planetData = {
    color: randomColor(),
    radiusPercent: `${randomInRange(10, 70) / 100}`,
    rotate: `${randomInRange(0, 360)}deg`,
    atmosphere: {
      size: `${randomInRange(0, 20)}px`,
    },
    cloud: {
      rotate: `${randomInRange(0, 360)}deg`,
      opacity: Math.random(),
    },
    detail: {
      color: `${randomInRange(0, 360)}deg`,
      opacity: Math.random() / 2,
      rotate: `${randomInRange(0, 360)}deg`,
    },
    ring: {
      opacity: randomInRange(0, 1), //Generally,a ring has "Exist" or "Not Exist" two situations.To achieve this,we can use "opacity" to simulate("Exist" is 1, "Not Exist" is 0) this situation and it can be good for transition animation.
      rotate: `${randomInRange(0, 360)}deg`,
      color: `${randomInRange(40, 250)}deg`,
    },
  };
  generate(planetData);
}
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor() {
  return `#${Math.random().toString(16).slice(2, 8)}`;
}
