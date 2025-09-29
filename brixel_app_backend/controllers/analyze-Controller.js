const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const analyzeImage = (req, res) => {
  const filePath = path.join(__dirname, "..", req.file.path);

  fs.createReadStream(filePath)
    .pipe(new PNG())
    .on("parsed", function () {
      const colorCount = {};

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          const r = this.data[idx];
          const g = this.data[idx + 1];
          const b = this.data[idx + 2];
          const a = this.data[idx + 3]; // alpha

          if (a === 0) continue;

          const key = `${r},${g},${b}`;
          colorCount[key] = (colorCount[key] || 0) + 1;
        }
      }

      fs.unlinkSync(filePath);

      res.json({
        width: this.width,
        height: this.height,
        colors: colorCount,
      });
    });
};

module.exports = { analyzeImage };
