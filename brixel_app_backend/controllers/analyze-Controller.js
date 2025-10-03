const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");
const { getAvgPrice } = require("../utils/bricklink");

// Lista kolorów w formie RGB
const colors = {
  black: [5, 19, 29],
  blue: [0, 85, 191],
  bright_green: [75, 159, 74],
  bright_light_orange: [248, 187, 61],
  bright_light_yellow: [255, 240, 58],
  bright_pink: [228, 173, 200],
  brown: [88, 57, 39],
  dark_blue: [10, 52, 99],
  dark_bluish_gray: [108, 110, 104],
  dark_gray: [109, 110, 92],
  dark_orange: [169, 85, 0],
  dark_pink: [200, 112, 160],
  dark_purple: [63, 54, 145],
  dark_red: [114, 14, 15],
  dark_tan: [149, 138, 115],
  dark_turquoise: [0, 143, 155],
  green: [35, 120, 65],
  light_aqua: [173, 195, 192],
  light_bluish_gray: [160, 165, 169],
  light_gray: [155, 161, 157],
  lime: [187, 233, 11],
  magenta: [146, 57, 120],
  medium_azure: [54, 174, 191],
  olive_green: [155, 154, 90],
  orange: [254, 138, 24],
  red: [201, 26, 9],
  reddish_brown: [88, 42, 18],
  sand_blue: [96, 116, 161],
  sand_green: [160, 188, 172],
  tan: [228, 205, 158],
  white: [255, 255, 255],
  yellow: [242, 205, 55],
  yellowish_green: [223, 238, 165],
  flat_silver: [137, 135, 136],
  pearl_gold: [170, 127, 46],
  metallic_silver: [165, 169, 180],
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
            // tylko kolory z naszej listy
            if (rgbToColorId[key] !== undefined) {
              colorCount[key] = (colorCount[key] || 0) + 1;
            }
          }
        }

        // pobieramy średnie ceny z BrickLink
        for (const rgb of Object.keys(colorCount)) {
          const colorId = rgbToColorId[rgb];
          const avgPrice = await getAvgPrice("3001", colorId); // 3001 = kostka 2x4 LEGO
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
