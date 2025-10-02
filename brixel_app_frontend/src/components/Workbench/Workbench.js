import { useEffect, useRef, useState, useCallback } from "react";
import PixelArtProcessor from "../../lib/pixelArtProcessor";
import ColorPalette from "../ColorPalette/ColorPalette";

function Workbench({ colors }) {
  const [pixelWidth, setPixelWidth] = useState(100);
  const [pixelHeight, setPixelHeight] = useState(100);
  const [selectedColors, setSelectedColors] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const processImage = useCallback(() => {
    if (!imgRef.current || !canvasRef.current || selectedColors.length === 0) return;

    const px = new PixelArtProcessor({
      sourceImage: imgRef.current,
      targetCanvas: canvasRef.current,
      colorPalette: selectedColors,
      maxCanvasHeight: pixelHeight,
      maxCanvasWidth: pixelWidth,
    });

    px.renderImage().pixelateImage().convertToPalette().resizeCanvasImage();
  }, [selectedColors, pixelWidth, pixelHeight]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = imgRef.current;
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      processImage();
    };
  };

  const handleAnalyze = async () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "pixel-art.png");

      const res = await fetch("http://localhost:9999/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setAnalysisResult(data);
    }, "image/png");
  };

  const handleGeneratePDF = async () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "pixel-art.png");

      const res = await fetch("http://localhost:9999/api/pixel-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Error generating PDF");
        return;
      }


      const pdfBlob = await res.blob();
      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "brixel-pixel-art.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, "image/png");
  };


  useEffect(() => {
    if (imgRef.current?.src) {
      processImage();
    }
  }, [selectedColors, processImage]);

  const handleSavePNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="workbench d-flex flex-column align-items-center">
      <label className="btn btn-secondary mb-3">
        Select image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      <img ref={imgRef} alt="source" style={{ display: "none" }} />

      <canvas ref={canvasRef} width={300} height={300}></canvas>

      <ColorPalette
        colors={colors}
        selectedColors={selectedColors}
        onChange={setSelectedColors}
      />

      <div className="d-flex gap-2 mb-3">
        <div>
          <label>Width (px)</label>
          <input
            type="number"
            min="1"
            value={pixelWidth}
            onChange={(e) => setPixelWidth(Number(e.target.value))}
            className="form-control"
            style={{ width: "100px" }}
          />
        </div>
        <div>
          <label>Height (px)</label>
          <input
            type="number"
            min="1"
            value={pixelHeight}
            onChange={(e) => setPixelHeight(Number(e.target.value))}
            className="form-control"
            style={{ width: "100px" }}
          />
        </div>
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSavePNG}>
        Save as PNG
      </button>

      <button className="btn btn-info mt-3" onClick={handleAnalyze}>
        Analyze Colors
      </button>

      <button className="btn btn-success mt-3" onClick={handleGeneratePDF}>
        Generate PDF
      </button>


      {analysisResult && (
        <table className="table table-bordered table-sm mt-3">
          <thead>
            <tr>
              <th>Color (RGB)</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(analysisResult.colors).map(([rgb, count], index) => {
              const rgbString = Array.isArray(rgb) ? rgb.join(",") : rgb;

              return (
                <tr key={index}>
                  <td>
                    <div
                      style={{
                        width: "40px",
                        height: "20px",
                        backgroundColor: `rgb(${rgbString})`,
                        display: "inline-block",
                        marginRight: "10px",
                        border: "1px solid #ccc",
                      }}
                    ></div>
                    {rgbString}
                  </td>
                  <td>{count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Workbench;
