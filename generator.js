function generate(planetData) {
  const planetStyle = document.getElementById("result").style;
  const table = [
    ["--planetColor", planetData.color],
    ["--planetRadiusPercent", planetData.radiusPercent],
    ["--planetAtmosphereSize", planetData.atmosphere.size],
    ["--planetCloudRotate", planetData.cloud.rotate],
    ["--planetCloudOpacity", planetData.cloud.opacity],
    ["--planetDetailColor", planetData.detail.color],
    ["--planetDetailOpacity", planetData.detail.opacity],
    ["--planetDetailRotate", planetData.detail.rotate],
  ];
  table.forEach((item) => {
    planetStyle.setProperty(...item);
  });
  console.log(planetData);
}
function randomGenerate() {
  let planetColor = randomColor();
  let planetData = {
    color: planetColor,
    radiusPercent: `${randomInRange(10, 70) / 100}`,
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
  };
  generate(planetData);
}
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor() {
  return `#${Math.random().toString(16).slice(2, 8)}`;
}
