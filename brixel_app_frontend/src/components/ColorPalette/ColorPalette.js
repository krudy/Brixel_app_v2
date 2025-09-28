function ColorPalette({ colors, onChange }) {
  const handleChange = (e, color) => {
    if (e.target.checked) {
      onChange((prev) => [...prev, color]);
    } else {
      onChange((prev) => prev.filter((c) => c !== color));
    }
  };

  return (
    <div className="color-palette">
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
            onChange={(e) => handleChange(e, color)}
          />
          <span
            style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              backgroundColor: `rgb(${color.join(",")})`,
              marginLeft: "5px",
              border: "1px solid #ccc",
            }}
          ></span>
        </label>
      ))}
    </div>
  );
}

export default ColorPalette;
