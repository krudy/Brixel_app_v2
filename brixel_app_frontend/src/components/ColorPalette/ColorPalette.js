
function ColorPalette({ colors, selectedColors, onChange }) {
  const handleChange = (e, color) => {
    if (e.target.checked) {
      onChange((prev) => [...prev, color]);
    } else {
      onChange((prev) => prev.filter((c) => c !== color));
    }
  };

  const handleSelectAll = () => {
    if (selectedColors.length === colors.length) {
      // all checked → uncheck all
      onChange([]);
    } else {
      // select all
      onChange(colors);
    }
  };

  return (
    <div className="color-palette">
      <button
        type="button"
        className="btn btn-sm btn-secondary mb-2"
        onClick={handleSelectAll}
      >
        {selectedColors.length === colors.length
          ? "uncheck all"
          : "check all"}
      </button>

      <div>
        {colors.map((color, index) => (
          <label
            key={index}
            style={{
              display: "inline-block",
              margin: "5px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={selectedColors.some(
                (c) => c.toString() === color.toString()
              )}
              onChange={(e) => handleChange(e, color)}
            />
            <span
              style={{
                display: "inline-block",
                width: "42px",
                height: "42px",
                backgroundColor: `rgb(${color.join(",")})`,
                marginLeft: "5px",
                border: "1px solid #ccc",
              }}
            ></span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ColorPalette;
