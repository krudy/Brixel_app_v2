import { useState } from "react";
import ImageUploader from "../ImageUploader/ImageUploader";
import PixelCanvas from "../PixelCanvas/PixelCanvas";
import PixelDimensions from "../PixelDimensions/PixelDimensions";
import ColorPalette from "../ColorPalette/ColorPalette";
import AnalysisTable from "../AnalysisTable/AnalysisTable";

export default function Workbench({ colors }) {
  const [img, setImg] = useState(null);
  const [pixelWidth, setPixelWidth] = useState(300);
  const [pixelHeight, setPixelHeight] = useState(300);
  const [selectedColors, setSelectedColors] = useState([]);
  const [canvas, setCanvas] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleSavePNG = () => {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleAnalyze = async () => {
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
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
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
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

  return (
    <div className="workbench d-flex flex-column align-items-center">
      <ImageUploader onImageLoad={setImg} />

      <PixelCanvas
        img={img}
        selectedColors={selectedColors}
        width={pixelWidth}
        height={pixelHeight}
        onCanvasReady={setCanvas}
      />

      <ColorPalette
        colors={colors}
        selectedColors={selectedColors}
        onChange={setSelectedColors}
      />

      <PixelDimensions
        width={pixelWidth}
        height={pixelHeight}
        onWidthChange={setPixelWidth}
        onHeightChange={setPixelHeight}
      />

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" onClick={handleSavePNG}>
          Save as PNG
        </button>
        <button className="btn btn-info" onClick={handleAnalyze}>
          Analyze Colors
        </button>
        <button className="btn btn-success" onClick={handleGeneratePDF}>
          Generate PDF
        </button>
      </div>

      <AnalysisTable analysisResult={analysisResult} />
    </div>
  );
}
