
/**
 * function that blends two colors in one color
 * @param {string} c1 - first color in hexadecimal system (for example #fff, #ffffff)
 * @param {string} c2 - second color in hexadecimal system (for example #000, #000000)
 * @param {double} per - amount of blending color 1 and color 2
 * @return {string} - color in hexadecimal system
 */

function blendColor(c1, c2, per) {
  c1 = c1 || "#ffffff";
  c2 = c2 || "#000000";
  per = per || 0;
  
  if(c1.length != 4 && c1.length != 7) {
    throw new Error(`Incorrect color '${c1}'`);
  }
  
  if(c2.length != 4 && c2.length != 7) {
    throw new Error(`Incorrect color '${c2}'`);
  }
  
  if(per < 0 || per > 1) {
    throw new Error(`Incorrect percent value. Percent value must be between 0 and 1. Current value is: ${per}`);
  }
  
  
  c1 = c1.replace("#", "");
  c2 = c2.replace("#", "");
  
  if(c1.length == 3) {
    c1 = c1[0] + c1[0] + c1[1] + c1[1] + c1[2] + c1[2];
  }
  
  if(c2.length == 3) {
    c2 = c2[0] + c2[0] + c2[1] + c2[1] + c2[2] + c2[2];
  }
  
  c1 = [
    parseInt(c1[0] + c1[1], 16),
    parseInt(c1[2] + c1[3], 16),
    parseInt(c1[4] + c1[5], 16)
  ];
  
  c2 = [
    parseInt(c2[0] + c2[1], 16),
    parseInt(c2[2] + c2[3], 16),
    parseInt(c2[4] + c2[5], 16)
  ];
  
  
  var c3 = [
    (1 - per) * c1[0] + per * c2[0],
    (1 - per) * c1[1] + per * c2[1],
    (1 - per) * c1[2] + per * c2[2]
  ];
  
  c3 = "#" + toHex(c3[0]) + toHex(c3[1]) + toHex(c3[2]);
  
  return c3;
  
}

function toHex(num) {
  num = parseInt(num);
  if(num <= 15) {
    return "0" + num.toString(16);
  }
  return num.toString(16);
}
