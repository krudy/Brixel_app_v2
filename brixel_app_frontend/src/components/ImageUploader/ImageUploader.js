import { useRef } from "react";

export default function ImageUploader({ onImageLoad }) {
  const imgRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    imgRef.current.src = URL.createObjectURL(file);
    imgRef.current.onload = () => onImageLoad(imgRef.current);
  };

  return (
    <>
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
    </>
  );
}
