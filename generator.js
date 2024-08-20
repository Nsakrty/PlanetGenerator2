const planetType = ["Terrestrial", "Gaseous"];
let showPlanetData = 0;
function generate(planetData) {
  const planetStyle = document.getElementById("result").style;
  switch (planetData.type) {
    case "Terrestrial":
      document.getElementById("cloud").src = "./image/cloud1.png";
      document.getElementById("detail").src = `./image/detail${planetData.detail.skin}.png`;
      break;
    case "Gaseous":
      document.getElementById("cloud").src = "./image/cloud2.png";
      break;
  }
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
    ["--planetRingRotateX", planetData.ring.rotateX],
    ["--planetRingColor", planetData.ring.color],
  ];
  
  table.forEach((item) => {
    planetStyle.setProperty(...item);
  });
  document.getElementById("star").style.setProperty("--starRadiusPercent", planetData.star.radiusPercent);

  // drawShadow(planetData.shadow.size, planetData.shadow.direction);
  drawShadowWithAnimation(planetData.shadow.size, planetData.shadow.direction);
  if (showPlanetData) {
    document.getElementById("information").innerHTML = JSON.stringify(planetData, null, 2);
  } else {
    document.getElementById("information").innerHTML = "";
  }
}
function randomGenerate() {
  let planetData = {
    type: randomItem(planetType),
    color: randomColor(),
    radiusPercent: `${randomInRange(10, 70) / 100}`,
    rotate: `${randomInRange(0, 360)}deg`,
    detail: {
      color: `${randomInRange(0, 360)}deg`,
      opacity: Math.random() / 2,
      rotate: `${randomInRange(0, 360)}deg`,
      skin: randomInRange(0, 2),
    },
    atmosphere: {
      size: `${randomInRange(0, 20)}px`,
    },
    ring: {
      opacity: randomInRange(0, 1),
      rotate: `${randomInRange(0, 360)}deg`,
      rotateX: `${randomInRange(60, 89)}deg`,
      color: `${randomInRange(40, 250)}deg`,
    },
    shadow: {
      size: Math.random() * 2 - 1,
      direction: randomInRange(0, 1),
    },
    star:{
      radiusPercent: `${randomInRange(3, 10) / 100}`,
    }
  };
  switch (planetData.type) {
    case "Terrestrial":
      planetData.cloud = {
        rotate: `${randomInRange(0, 360)}deg`,
        opacity: Math.random(),
      };
      break;
    case "Gaseous":
      planetData.detail.opacity = 0;
      planetData.cloud = {
        rotate: `${randomInRange(-10, 10)}deg`,
        opacity: Math.random() * 0.4 + 0.6,
      };
      break;
  }
  generate(planetData);
  return planetData;
}
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor() {
  return `#${Math.random().toString(16).slice(2, 8)}`;
}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
