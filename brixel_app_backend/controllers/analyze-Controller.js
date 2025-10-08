const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");
const { getAvgPrice } = require("../utils/bricklink");

// Lista kolorów w formie RGB
const colors = {
  black: [33, 33, 33],
  blue: [0, 87, 166],
  bright_green: [16, 203, 49],
  bright_light_orange: [255, 199, 0],
  bright_light_yellow: [255, 240, 140],
  bright_pink: [247, 188, 218],
  brown: [107, 63, 34],
  dark_blue: [36, 55, 87],
  dark_bluish_gray: [89, 93, 96],
  dark_gray: [107, 90, 90],
  dark_orange: [179, 84, 8],
  dark_pink: [239, 91, 179],
  dark_purple: [95, 38, 131],
  dark_red: [106, 14, 21],
  dark_tan: [184, 152, 105],
  dark_turquoise: [0, 162, 159],
  green: [0, 146, 61],
  light_aqua: [207, 239, 234],
  light_bluish_gray: [175, 181, 199],
  light_gray: [156, 156, 156],
  lime: [196, 224, 0],
  magenta: [183, 34, 118],
  medium_azure: [106, 206, 224],
  olive_green: [171, 169, 83],
  orange: [255, 126, 20],
  red: [179, 0, 6],
  reddish_brown: [130, 66, 42],
  sand_blue: [136, 153, 171],
  sand_green: [162, 191, 163],
  tan: [238, 217, 164],
  white: [255, 255, 255],
  yellow: [255, 224, 1],
  yellowish_green: [231, 242, 167],
  flat_silver: [141, 148, 156],
  pearl_gold: [231, 158, 29],
  metallic_silver: [192, 192, 192],
};

// mapowanie RGB jako string "r,g,b" -> colorId LEGO
// TODO: uzupełnij faktyczne colorId LEGO dla każdego koloru
const rgbToColorId = {};
Object.entries(colors).forEach(([name, rgb], idx) => {
  rgbToColorId[rgb.join(",")] = idx + 1; // przykładowe ID (1,2,3...) -> zmień według BrickLink
});

const analyzeImage = (req, res) => {
  const filePath = path.join(__dirname, "..", req.file.path);

  fs.createReadStream(filePath)
    .pipe(new PNG())
    .on("parsed", async function () {
      try {
        const colorCount = {};
        const colorsWithPrice = {};

        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const r = this.data[idx];
            const g = this.data[idx + 1];
            const b = this.data[idx + 2];
            const a = this.data[idx + 3];
            if (a === 0) continue;

            const key = `${r},${g},${b}`;
            
            if (rgbToColorId[key] !== undefined) {
              colorCount[key] = (colorCount[key] || 0) + 1;
            }
          }
        }

       
        for (const rgb of Object.keys(colorCount)) {
          const colorId = rgbToColorId[rgb];
          const avgPrice = await getAvgPrice("3024", colorId); 
          colorsWithPrice[rgb] = {
            count: colorCount[rgb],
            avgPrice,
          };
        }

        fs.unlinkSync(filePath);

        res.json({
          width: this.width,
          height: this.height,
          colors: colorsWithPrice,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Error analyzing image");
      }
    });
};

module.exports = { analyzeImage };
