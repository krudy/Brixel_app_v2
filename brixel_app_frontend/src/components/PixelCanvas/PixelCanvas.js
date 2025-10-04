import { useEffect, useRef } from "react";
import PixelArtProcessor from "../../lib/pixelArtProcessor";
import styles from "./PixelCanvas.module.css";

export default function PixelCanvas({
  img,
  selectedColors,
  width,
  height,
  onCanvasReady,
  onSelectImage,
}) {
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

  return (
    <div className={styles.canvasWrapper}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={onSelectImage}
        className={`${styles.canvas} ${img ? styles.canvasLoaded : ""}`}
      />

      {!img && (
        <div className={styles.overlay}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Click to select an image</span>
        </div>
      )}
    </div>
  );
}
