export default function PixelDimensions({ width, height, onWidthChange, onHeightChange }) {
  return (
    <div className="d-flex gap-2 mb-3">
      <div>
        <label>Width (px)</label>
        <input
          type="number"
          min="1"
          value={width}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          className="form-control"
          style={{ width: "100px" }}
        />
      </div>
      <div>
        <label>Height (px)</label>
        <input
          type="number"
          min="1"
          value={height}
          onChange={(e) => onHeightChange(Number(e.target.value))}
          className="form-control"
          style={{ width: "100px" }}
        />
      </div>
    </div>
  );
}
