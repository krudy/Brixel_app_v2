import { useEffect, useRef } from "react";
import PixelArtProcessor from "../../lib/pixelArtProcessor";

export default function PixelCanvas({ img, selectedColors, width, height, onCanvasReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!img || !canvasRef.current || selectedColors.length === 0) return;

    const px = new PixelArtProcessor({
      sourceImage: img,
      targetCanvas: canvasRef.current,
      colorPalette: selectedColors,
      maxCanvasHeight: height,
      maxCanvasWidth: width,
    });

    px.renderImage().pixelateImage().convertToPalette().resizeCanvasImage();

    if (onCanvasReady) onCanvasReady(canvasRef.current);
  }, [img, selectedColors, width, height, onCanvasReady]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}
