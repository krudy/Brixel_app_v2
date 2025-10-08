// brixel_app_backend/controllers/pdf-controller.js
const PDFDocument = require("pdfkit");
const sharp = require("sharp");

const generatePixelPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }

    // wczytaj surowe dane RGBA
    const { data, info } = await sharp(req.file.path)
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;

    // ustaw PDF
    const doc = new PDFDocument({ size: "A4", margin: 20 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=pixel-art.pdf");
    doc.pipe(res);

    // parametry mozaiki/strony
    const tileSize = 24; // rozmiar macierzy w pikselach (24x24)
    // dla każdego piksela rysujemy jedno okrąg (rozmiar dobrany do strony)
    let pageIndex = 0;

    // przechodzimy po rzędach macierzy (y)
    for (let tileY = 0; tileY < height; tileY += tileSize) {
      // przechodzimy po kolumnach macierzy (x)
      for (let tileX = 0; tileX < width; tileX += tileSize) {
        // nowa strona (pierwsza już istnieje w dokumencie)
        if (pageIndex > 0) doc.addPage();
        pageIndex++;

        // rozmiar tej macierzy (może być mniejszy na krawędzi obrazu)
        const cols = Math.min(tileSize, width - tileX);
        const rows = Math.min(tileSize, height - tileY);

        // obszar rysowania wewnątrz marginesów strony
        const marginLeft = doc.page.margins.left;
        const marginRight = doc.page.margins.right;
        const marginTop = doc.page.margins.top;
        const marginBottom = doc.page.margins.bottom;

        const availWidth = doc.page.width - marginLeft - marginRight;
        const availHeight = doc.page.height - marginTop - marginBottom;

        // krok (odległość między środkami okręgów) — dopasuj tak, żeby siatka w całości zmieściła się na stronie
        const stepX = availWidth / cols;
        const stepY = availHeight / rows;
        const step = Math.min(stepX, stepY);

        // promień okręgu (trochę mniejszy niż pół kroku, by zostało trochę odstępu)
        const radius = Math.max(0.5, (step * 0.45));

        // centrowanie siatki w dostępnym obszarze (jeśli np. cols < 24 na krawędziu)
        const usedWidth = step * cols;
        const usedHeight = step * rows;
        const offsetX = marginLeft + (availWidth - usedWidth) / 2 + step / 2;
        const offsetY = marginTop + (availHeight - usedHeight) / 2 + step / 2;

        // opcjonalnie: nagłówek z informacją która macierz/zakres jest na stronie (możesz usunąć)
        // np. "X: {tileX+1}-{tileX+cols}, Y: {tileY+1}-{tileY+rows}"
        const label = `X: ${tileX + 1}-${tileX + cols}, Y: ${tileY + 1}-${tileY + rows}`;
        doc.fontSize(10).fillColor("black").text(label, marginLeft, 10);

        // rysuj okręgi: każdy piksel w macierzy => jeden okrąg
        for (let py = 0; py < rows; py++) {
          for (let px = 0; px < cols; px++) {
            const imgX = tileX + px;
            const imgY = tileY + py;

            const idx = (imgY * width + imgX) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3] / 255;

            // jeśli piksel całkowicie przezroczysty — możesz pominąć rysowanie
            if (a === 0) continue;

            // kolor w formacie hex
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
              .toString(16)
              .slice(1)}`;

            const centerX = offsetX + px * step;
            const centerY = offsetY + py * step;

            // ustaw kolor wypełnienia i narysuj kółko
            doc.fillColor(hex).circle(centerX, centerY, radius).fill();
          }
        }
        // przejdziemy do następnej macierzy/strony
      } // koniec pętli po tileX
    } // koniec pętli po tileY

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
};

module.exports = { generatePixelPDF };
