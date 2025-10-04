export default function AnalysisTable({ analysisResult }) {
  if (!analysisResult) return null;

  return (
    <table className="table table-bordered table-sm mt-3">
      <thead>
        <tr>
          <th>Color (RGB)</th>
          <th>Count</th>
          <th>Average LEGO Price ($)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(analysisResult.colors).map(([rgb, data], index) => {
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
                <span>{rgbString}</span>
              </td>
              <td>{data.count}</td>
              <td>${Number(data.avgPrice).toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
