function RGBToHSL(r, g, b) {
  let R, G, B, h, l, s;
  [R, G, B] = [r, g, b].map((x) => x / 255);
  let Cmax, Cmin, delta;
  Cmax = Math.max(R, G, B);
  Cmin = Math.min(R, G, B);
  delta = Cmax - Cmin;
  if (delta === 0) {
    h = 0;
  } else if (Cmax == R) {
    h = (((G - B) / delta) % 6) * 60;
  } else if (Cmax == G) {
    h = ((B - R) / delta + 2) * 60;
  } else if (Cmax == B) {
    h = ((R - G) / delta + 4) * 60;
  }
  l = (Cmax + Cmin) / 2;
  if (delta == 0) {
    s = 0;
  } else {
    s = delta / (1 - Math.abs(2 * l - 1));
  }
  return [h, s, l];
}
function HEXToRGB(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function HEXToHSL(hex) {
  return RGBToHSL(...HEXToRGB(hex));
}
