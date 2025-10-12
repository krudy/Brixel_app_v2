import styles from './ColorPalette.module.css'

function ColorPalette({ colors, selectedColors, onChange }) {
  const handleClick = (color) => {
    const isSelected = selectedColors.some(
      (c) => c.toString() === color.toString()
    );
    if (isSelected) {
      onChange((prev) => prev.filter((c) => c.toString() !== color.toString()));
    } else {
      onChange((prev) => [...prev, color]);
    }
  };

  return (
    <div className={styles.paletteWrapper}>
      <button
        type="button"
        className="btn btn-sm btn-secondary mb-2"
        onClick={() => {
          if (selectedColors.length === colors.length) onChange([]);
          else onChange(colors);
        }}
      >
        {selectedColors.length === colors.length ? "Uncheck all" : "Check all"}
      </button>

      <div className={styles.paletteGrid}>
        {colors.map((color, index) => {
          const isSelected = selectedColors.some(
            (c) => c.toString() === color.toString()
          );
          return (
            <div
              key={index}
              className={`${styles.scene} ${isSelected ? styles.selected : ""}`}
              onClick={() => handleClick(color)}
            >
              <div className={styles.cube}>
                <div
                  className={`${styles.face} ${styles.front}`}
                  style={{ backgroundColor: `rgb(${color.join(",")})` }}
                ></div>
                <div
                  className={`${styles.face} ${styles.back}`}
                  style={{ backgroundColor: `rgb(${color.join(",")})` }}
                ></div>
                <div
                  className={`${styles.face} ${styles.left}`}
                  style={{ backgroundColor: `rgb(${color.join(",")})` }}
                ></div>
                <div
                  className={`${styles.face} ${styles.right}`}
                  style={{ backgroundColor: `rgb(${color.join(",")})` }}
                ></div>
                <div
                  className={`${styles.face} ${styles.top}`}
                  style={{ backgroundColor: `rgb(${color.join(",")})` }}
                ></div>
                <div
                  className={`${styles.face} ${styles.bottom}`}
                  style={{ backgroundColor: `rgb(${color.join(",")})` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ColorPalette;
