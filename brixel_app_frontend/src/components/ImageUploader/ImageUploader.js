import { useRef } from "react";

export default function ImageUploader({ onImageLoad }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => onImageLoad(img);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        border: "2px dashed #aaa",
        borderRadius: "8px",
        width: "300px",
        height: "300px",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: "#777" }}>Click canvas to select image</span>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
