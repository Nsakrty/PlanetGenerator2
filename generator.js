let config = {
  showPlanetData: 0,
  showStar: 1,
  showShadow: 1,
  showBackground: 1,
  useAnimation: 1,
  useCustomData: 0,
  revolution: 0,
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

  switch (planetData.type) {
    case "Terrestrial":
      document.getElementById("cloud").src = `./image/cloudTer${
        planetData?.cloud?.skin ?? 0
      }.png`;
      document.getElementById("detail").src = `./image/detail${
        planetData?.detail?.skin ?? 0
      }.png`;
      document.getElementById("iceSheet").src = `./image/iceSheet${
        planetData?.detail?.iceSheet?.skin ?? 0
      }.png`;
      break;
    case "Gaseous":
      document.getElementById("cloud").src = `./image/cloudGas${
        planetData?.cloud?.skin ?? 0
      }.png`;
      break;
  }
  document.querySelectorAll(".ring").forEach((element) => {
    element.src = `./image/ring${planetData?.ring?.skin ?? 0}.png`;
  });
  if (planetData.star ?? 0) {
    planetData.star.asterismColor = `${
      HEXToHSL(planetData?.star?.color ?? "#ffffff")[0] - 30
    }deg`;
    planetData.star.asterismBrightness = `${
      HEXToHSL(planetData?.star?.color ?? "#ffffff")[2]
    }`;
  }

  const ShadowObjectIsExist =
    planetData?.shadow !== void 0 &&
    planetData?.shadow?.size !== void 0 &&
    planetData?.shadow?.direction !== void 0;
  if (ShadowObjectIsExist) {
    drawShadowWithAnimation(
      planetData.shadow.size,
      planetData.shadow.direction,
      config.useAnimation * 0.3
    );
  } else {
    drawShadowWithAnimation(1, 1);
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
    ["--planetRingSize", planetData?.ring?.size ?? 1],
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
  goHome();
  document.getElementById("customDataArea").value = JSON.stringify(
    planetData,
    null,
    2
  );
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
    radiusPercent: `${Math.max(0.1, normalRandom(0.4, 0.1))}`,
    rotate: `${randomInRange(0, 360)}deg`,
    revolutionPeriodSeconds: 20, //`${randomInRange(20, 200)}`,
    atmosphere: {
      size: `${randomInRange(0, 20)}px`,
    },
    ring: {
      rotate: `${randomInRange(0, 360)}deg`,
      rotateX: `${randomInRange(60, 89)}deg`,
      color: `${randomInRange(40, 250)}deg`,
      skin: randomInRange(0, 3),
      opacity: randomItem([0, 0, 0, Math.seedRandom() * 0.5 + 0.3, 1]),
      size: Math.max(1, normalRandom(1, 0.166)),
    },
    shadow: {
      size: Math.seedRandom() * 2 - 1,
      direction: randomInRange(0, 1),
    },
    star: {
      // radiusPercent: `${(function () {
      //   if (randomProbability(1 / 12)) {
      //     // console.log("Large Star");
      //     return Math.min(1, normalRandom(0.34, 0.06));
      //   } else {
      //     // console.log("Normal Star");
      //     return Math.max(0.015, normalRandom(0.07, 0.03));
      //   }
      // })()}`,
      radiusPercent: `${(function () {
        // 80%的值会落在较低区间(正常恒星)，20%的值会落在较高区间(大恒星)
        // 这里我也看不懂到时候扔给AI调就完事.
        let fValue = fDistributionRandom(8, 2);
        let scaledValue = 0.03 + fValue * 0.02;
        return Math.max(0.015, Math.min(6, scaledValue));
      })()}`,
    },
  };
  [planetData.star.spectrum, planetData.star.color] =
    randomItem(stellarSpectrum);
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

/**
 * 生成随机概率事件
 * @param {Number} probability 概率[0,1]
 * @returns {Boolean} 是否发生
 */
function randomProbability(probability) {
  if (probability < 0 || probability > 1) {
    throw new Error("probability must be in [0,1]");
  }
  return Math.seedRandom() < probability;
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
/**
 * 生成卡方分布随机数
 * 卡方分布由自由度决定，形态为正偏态，自由度越大越接近正态分布
 * 均值 = 自由度(df)，方差 = 2*自由度(df)
 * 约68%的值在(df ± 2√df)范围内，约95%的值在(df ± 4√df)范围内，约99%的值在(df ± 6√df)范围内
 * @param {Number} df 自由度
 * @returns {Number} 卡方分布随机数
 */
function chiSquareRandom(df) {
  let sum = 0;
  for (let i = 0; i < df; i++) {
    let z = normalRandom(0, 1); // 标准正态分布
    sum += z * z;
  }
  return sum;
}

/**
 * 生成F分布随机数
 * F分布由两个自由度参数决定(d1为分子自由度，d2为分母自由度)
 * 形态为正偏态，取值范围(0, ∞)，随自由度增大逐渐趋于对称
 * 均值 = d2/(d2-2) (当d2 > 2时)
 * 约90%的值落在(0, F₀.₉₀(d1,d2))范围内，其中F₀.₉₀为上90%分位数
 * @param {Number} d1 分子自由度
 * @param {Number} d2 分母自由度
 * @returns {Number} F分布随机数
 */
function fDistributionRandom(d1, d2) {
  let chi1 = chiSquareRandom(d1);
  let chi2 = chiSquareRandom(d2);
  return chi1 / d1 / (chi2 / d2);
}

Math.seed = Math.random();
Math.seedRandom = () => {
  return (Math.seed = (Math.sin(Math.seed * 9301 + 49297) % 233280) / 2 + 0.5);
};
