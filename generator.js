let config = {
  showPlanetData: 0,
  showStar: 1,
};
const planetType = ["Terrestrial", "Gaseous"];
const stellarSpectrum = [
  ["O", "#9bb0ff"],
  ["B", "#aabfff"],
  ["A", "#cad7ff"],
  ["F", "#f8f7ff"],
  ["G", "#fff4ea"],
  ["K", "#ffd2a1"],
  ["M", "#ffcc6f"],
];

function generate(planetData) {
  const planetStyle = document.getElementById("result").style;
  // const starStyle = document.getElementById("star").style;
  switch (planetData.type) {
    case "Terrestrial":
      document.getElementById("cloud").src = "./image/cloud1.png";
      document.getElementById("detail").src = `./image/detail${planetData.detail.skin}.png`;
      break;
    case "Gaseous":
      document.getElementById("cloud").src = "./image/cloud2.png";
      break;
  }
  [planetData.star.spectrum, planetData.star.color] = randomItem(stellarSpectrum);
  planetData.star.asterismColor = `${HEXToHSL(planetData.star.color)[0] - 30}deg`;
  planetData.star.asterismBrightness = `${HEXToHSL(planetData.star.color)[2]}`;
  const planetTable = [
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
    ["--starRadiusPercent", planetData.star.radiusPercent],
    ["--starColor", planetData.star.color],
    ["--asterismColor", planetData.star.asterismColor],
    ["--asterismBrightness", planetData.star.asterismBrightness],
  ];
  planetTable.forEach((item) => {
    planetStyle.setProperty(...item);
  });

  // drawShadow(planetData.shadow.size, planetData.shadow.direction);
  drawShadowWithAnimation(planetData.shadow.size, planetData.shadow.direction);
  if (config.showPlanetData) {
    document.getElementById("information").innerHTML = JSON.stringify(planetData, null, 2);
  } else {
    document.getElementById("information").innerHTML = "";
  }
}
let planetData;
function randomGenerate() {
  planetData = {
    seed: Math.seed,
    type: randomItem(planetType),
    color: randomColor(),
    radiusPercent: `${randomInRange(10, 70) / 100}`,
    rotate: `${randomInRange(0, 360)}deg`,
    detail: {
      color: `${randomInRange(0, 360)}deg`,
      opacity: Math.seedRandom() / 2,
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
      size: Math.seedRandom() * 2 - 1,
      direction: randomInRange(0, 1),
    },
    star: {
      radiusPercent: `${randomInRange(3, 10) / 100}`,
    },
  };
  switch (planetData.type) {
    case "Terrestrial":
      planetData.cloud = {
        rotate: `${randomInRange(0, 360)}deg`,
        opacity: Math.seedRandom(),
      };
      break;
    case "Gaseous":
      planetData.detail.opacity = 0;
      planetData.cloud = {
        rotate: `${randomInRange(-10, 10)}deg`,
        opacity: Math.seedRandom() * 0.4 + 0.6,
      };
      break;
  }
  generate(planetData);
  return planetData;
}
function randomInRange(min, max) {
  return Math.floor(Math.seedRandom() * (max - min + 1) + min);
}
function randomColor() {
  return `#${Math.seedRandom().toString(16).slice(2, 8)}`;
}
function randomItem(arr) {
  return arr[Math.floor(Math.seedRandom() * arr.length)];
}

Math.seed = Math.random();
Math.seedRandom = () => {
  return (Math.seed = (Math.sin(Math.seed * 9301 + 49297) % 233280) / 2 + 0.5);
};
