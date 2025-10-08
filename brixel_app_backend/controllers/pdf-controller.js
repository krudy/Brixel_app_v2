const PDFDocument = require("pdfkit");
const sharp = require("sharp");

const generatePixelPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No image uploaded");

    const { data, info } = await sharp(req.file.path)
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;

    const doc = new PDFDocument({ size: "A4", margin: 30 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=pixel-art.pdf");
    doc.pipe(res);

    const circleRadius = 10;
    const step = circleRadius * 2 + 1;
    const gridSize = 24;

    const colsPerPage = gridSize;
    const rowsPerPage = gridSize;

    const totalCols = Math.ceil(width / colsPerPage);
    const totalRows = Math.ceil(height / rowsPerPage);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = doc.page.margins.left;

    const gridWidth = colsPerPage * step;
    const gridHeight = rowsPerPage * step;

    // Wyśrodkowanie
    const startXBase = (pageWidth - gridWidth) / 2;
    const startYBase = margin + (pageHeight - 2 * margin - gridHeight) / 2;

    for (let blockY = 0; blockY < totalRows; blockY++) {
      for (let blockX = 0; blockX < totalCols; blockX++) {
        if (blockX !== 0 || blockY !== 0) doc.addPage();

        const startX = blockX * colsPerPage;
        const startY = blockY * rowsPerPage;
        const endX = Math.min(startX + colsPerPage, width);
        const endY = Math.min(startY + rowsPerPage, height);

        let yPos = startYBase;
        for (let y = startY; y < endY; y++) {
          let xPos = startXBase;
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3] / 255;

            if (a > 0) {
              const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
                .toString(16)
                .slice(1)}`;
              doc.circle(xPos, yPos, circleRadius).fillColor(hex).fill();
            }
            xPos += step;
          }
          yPos += step;
        }
      }
    }

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Error generating PDF");
  }
};

module.exports = { generatePixelPDF };
