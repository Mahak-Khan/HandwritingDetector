import React, { useState } from "react";
import Tesseract from "tesseract.js";

const VisionOCR = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleOCR = async () => {
    if (!image) return;
    setLoading(true);
    setText("");

    try {
      const { data } = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });

      setText(data.text.trim());
    } catch (error) {
      console.error("OCR Error:", error);
      setText("Failed to extract text");
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "Arial" }}>
      <h2>📝 Image to Text OCR Tool</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ margin: "10px" }}
      />

      {image && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={image}
            alt="Uploaded Preview"
            style={{
              width: "300px",
              borderRadius: "8px",
              border: "2px solid #000",
              marginBottom: "15px"
            }}
          />
        </div>
      )}

      <button
        onClick={handleOCR}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Extract Text
      </button>

      {loading && <p style={{ marginTop: "10px" }}>Processing... ⏳</p>}

      {text && (
        <textarea
          rows="5"
          readOnly
          value={text}
          style={{ width: "80%", marginTop: "20px", padding: "10px" }}
        />
      )}
    </div>
  );
};

export default VisionOCR;
