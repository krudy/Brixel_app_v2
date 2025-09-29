import { useEffect, useRef, useState, useCallback } from "react";
import PixelArtProcessor from "../../lib/pixelArtProcessor";
import ColorPalette from "../ColorPalette/ColorPalette";

function Workbench({ colors }) {
  const [selectedColors, setSelectedColors] = useState([]);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const processImage = useCallback(() => {
    if (!imgRef.current || !canvasRef.current || selectedColors.length === 0) return;

    const px = new PixelArtProcessor({
      sourceImage: imgRef.current,
      targetCanvas: canvasRef.current,
      colorPalette: selectedColors,
      maxCanvasHeight: 300,
      maxCanvasWidth: 300,
    });

    px.renderImage().pixelateImage().convertToPalette().resizeCanvasImage();
  }, [selectedColors]);

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

  // Konwertujemy canvas na Blob
  canvasRef.current.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "pixel-art.png");

    const res = await fetch("http://localhost:9999/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Wynik analizy:", data);
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

      <button className="btn btn-primary mt-3" onClick={handleSavePNG}>
        Save as PNG
      </button>

      <button className="btn btn-info mt-3" onClick={handleAnalyze}>
        Analyze Colors
      </button>

    </div>
  );
}

export default Workbench;
