let config = {
  showPlanetData: 0,
  showStar: 1,
  showBackground: 1,
  useAnimation: 1,
  useCustomData: 0,
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
  goHome();
  const planetStyle = document.getElementById("result").style;
  // const starStyle = document.getElementById("star").style;
  switch (planetData.type) {
    case "Terrestrial":
      document.getElementById("cloud").src = `./image/cloudTer${planetData?.cloud?.skin ?? 0}.png`;
      document.getElementById("detail").src = `./image/detail${planetData?.detail?.skin ?? 0}.png`;
      document.getElementById("iceSheet").src = `./image/iceSheet${planetData?.detail?.iceSheet?.skin ?? 0}.png`;
      break;
    case "Gaseous":
      document.getElementById("cloud").src = `./image/cloudGas${planetData?.cloud?.skin ?? 0}.png`;
      break;
  }
  document.querySelectorAll(".ring").forEach((element) => {
    element.src = `./image/ring${planetData?.ring?.skin ?? 0}.png`;
  });
  if (planetData.star ?? 0) {
    planetData.star.asterismColor = `${HEXToHSL(planetData?.star?.color ?? "#ffffff")[0] - 30}deg`;
    planetData.star.asterismBrightness = `${HEXToHSL(planetData?.star?.color ?? "#ffffff")[2]}`;
  }
  const planetTable = [
    ["--planetColor", planetData?.color],
    ["--planetRadiusPercent", planetData?.radiusPercent],
    ["--planetRotate", planetData?.rotate],
    ["--planetAtmosphereSize", planetData?.atmosphere?.size],
    ["--planetCloudRotate", planetData?.cloud?.rotate],
    ["--planetCloudOpacity", planetData?.cloud?.opacity],
    ["--planetDetailColor", planetData?.detail?.color],
    ["--planetDetailOpacity", planetData?.detail?.opacity],
    ["--planetDetailRotate", planetData?.detail?.rotate],
    ["--planetRingOpacity", planetData?.ring?.opacity],
    ["--planetRingRotate", planetData?.ring?.rotate],
    ["--planetRingRotateX", planetData?.ring?.rotateX],
    ["--planetRingColor", planetData?.ring?.color],
    ["--starRadiusPercent", planetData?.star?.radiusPercent],
    ["--starColor", planetData?.star?.color ?? "#ffffff"],
    ["--asterismColor", planetData?.star?.asterismColor],
    ["--asterismBrightness", planetData?.star?.asterismBrightness],
    ["--planetIceSheetOpacity", planetData?.detail?.iceSheet?.opacity],
  ];
  planetTable.forEach((item) => {
    if (item[1] == void 0) {
      item[1] = 0;
    }
    planetStyle.setProperty(...item);
  });
  if (planetData?.shadow !== void 0 && planetData?.shadow?.size !== void 0 && planetData?.shadow?.direction !== void 0) {
    drawShadowWithAnimation(planetData.shadow.size, planetData.shadow.direction, config.useAnimation * 0.3);
  } else {
    drawShadowWithAnimation(1, 1);
  }
  // if (config.showPlanetData) {
  //   document.getElementById("information").innerHTML = JSON.stringify(planetData, null, 2);
  // } else {
  //   document.getElementById("information").innerHTML = "";
  // }
  document.getElementById("customDataArea").value = JSON.stringify(planetData, null, 2);
  document.getElementById("information").innerHTML = "";
}

let planetData;
function randomGenerate(onlyRandomData = false) {
  if (!onlyRandomData) {
    document.getElementById("seedEdit").value = Math.seed;
  }
  planetData = {
    seed: Math.seed,
    type: randomItem(planetType),
    color: randomColor(),
    // radiusPercent: `${randomInRange(10, 70) / 100}`,
    radiusPercent: `${Math.max(0.1, normalRandom(0.4, 0.1))}`,
    rotate: `${randomInRange(0, 360)}deg`,
    atmosphere: {
      size: `${randomInRange(0, 20)}px`,
    },
    ring: {
      rotate: `${randomInRange(0, 360)}deg`,
      rotateX: `${randomInRange(60, 89)}deg`,
      color: `${randomInRange(40, 250)}deg`,
      skin: randomInRange(0, 3),
      opacity: randomItem([0, 0, 0, Math.seedRandom() * 0.5 + 0.3, 1]),
    },
    shadow: {
      size: Math.seedRandom() * 2 - 1,
      direction: randomInRange(0, 1),
    },
    star: {
      // radiusPercent: `${randomInRange(3, 10) / 100}`,
      radiusPercent: `${Math.max(0.015, normalRandom(0.07, 0.03))}`,
    },
  };
  [planetData.star.spectrum, planetData.star.color] = randomItem(stellarSpectrum);
  switch (planetData.type) {
    case "Terrestrial":
      planetData.cloud = {
        rotate: `${randomInRange(0, 360)}deg`,
        opacity: Math.seedRandom(),
        skin: randomInRange(0, 3),
      };
      planetData.detail = {
        color: `${randomInRange(0, 360)}deg`,
        opacity: Math.seedRandom() / 2,
        rotate: `${randomInRange(0, 360)}deg`,
        skin: randomInRange(0, 4),
        iceSheet: {
          opacity: Math.seedRandom() * 3 - 2.4, //[-2.4,0.6]
          skin: randomInRange(0, 1),
        },
      };
      break;
    case "Gaseous":
      // planetData.detail.opacity = 0;
      // planetData.detail.iceSheet.opacity = 0;
      planetData.cloud = {
        rotate: `${randomInRange(-10, 10)}deg`,
        opacity: Math.seedRandom() * 0.4 + 0.6,
        skin: randomInRange(0, 2),
      };
      break;
  }
  if (!onlyRandomData) {
    generate(planetData);
    document.getElementById("customDataArea").style.backgroundColor = "unset";
  }
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
/**
 * 生成正态分布随机数，约68%的值在mean±stdDev范围内，约95%的值在mean±2*stdDev范围内，约99.7%的值在mean±3*stdDev范围内，但值域是R
 * @param {Number} mean 平均值
 * @param {Number} stdDev 标准差
 * @returns {Number} 结果(正态分布随机数)
 */
function normalRandom(mean = 0, stdDev = 1) {
  let u1 = Math.seedRandom();
  let u2 = Math.seedRandom();

  // 使用 Box-Muller 变换
  let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  // 调整为具有指定均值和标准差的正态分布
  return z0 * stdDev + mean;
}

Math.seed = Math.random();
Math.seedRandom = () => {
  return (Math.seed = (Math.sin(Math.seed * 9301 + 49297) % 233280) / 2 + 0.5);
};
