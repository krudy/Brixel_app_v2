const PDFDocument = require("pdfkit");
const sharp = require("sharp");

/**
 * Tworzy PDF z obrazem w formie kółek 16x24 na stronę.
 */
const generatePixelPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }

    // odczytaj obraz jako dane RGBA
    const { data, info } = await sharp(req.file.path)
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;

    // PDF setup
    const doc = new PDFDocument({
      size: "A4",
      margin: 20,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=pixel-art.pdf"
    );

    doc.pipe(res);

    const circleRadius = 10;
    const step = circleRadius * 2 + 1;
    const cols = 16;
    const rows = 24;

    let col = 0;
    let row = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3] / 255;

        // zamiana na hex
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)}`;

        const posX = 50 + col * step;
        const posY = 50 + row * step;

        doc.circle(posX, posY, circleRadius)
          .fillColor(hex)
          .fill();

        col++;
        if (col >= cols) {
          col = 0;
          row++;
        }
        if (row >= rows) {
          doc.addPage();
          col = 0;
          row = 0;
        }
      }
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
};

module.exports = { generatePixelPDF };
