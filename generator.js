function generate(planetData) {
  const planetStyle = document.getElementById("result").style;
  planetStyle.setProperty("--planetColor", planetData.color);
  planetStyle.setProperty("--planetRadiusPercent", planetData.radiusPercent);
  planetStyle.setProperty("--planetAtmosphereSize", planetData.atmosphere.size);
  planetStyle.setProperty("--planetCloudRotate", planetData.cloud.rotate);
  planetStyle.setProperty("--planetCloudOpacity", planetData.cloud.opacity);
}
function randomGenerate() {
  let planetColor = randomColor();
  let planetData = {
    color: planetColor,
    radiusPercent: `${randomInRange(10, 70) / 100}`,
    atmosphere: {
      size: `${randomInRange(0, 20)}px`,
    },
    cloud:{
      rotate: `${randomInRange(0, 360)}deg`,
      opacity: Math.random()
    }
  };
  generate(planetData);
}
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor() {
  return `#${Math.random().toString(16).slice(2, 8)}`;
}
