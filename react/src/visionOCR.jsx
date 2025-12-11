import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Tesseract from "tesseract.js";

const VisionOCR = () => {
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setShowCropper(true);
    }
  };

  // Convert the cropped area to an actual cropped image
  const getCroppedImage = useCallback(async () => {
    const imageObj = await createImage(image);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      imageObj,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return canvas.toDataURL("image/png");
  }, [image, croppedAreaPixels]);

  const createImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });

  const extractText = async () => {
    const cropped = await getCroppedImage();
    setShowCropper(false);

    setLoading(true);
    setText("");

    const { data } = await Tesseract.recognize(cropped, "eng", {
      logger: (m) => console.log(m),
      tessedit_pageseg_mode: "7",
    });

    setText(data.text.trim());
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>📝 OCR Tool with Auto Crop</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {showCropper && (
        <div
          style={{
            position: "relative",
            width: "300px",
            height: "300px",
            margin: "20px auto",
            background: "#333",
          }}
        >
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, croppedPixels) =>
              setCroppedAreaPixels(croppedPixels)
            }
          />
        </div>
      )}

      {showCropper && (
        <button
          onClick={extractText}
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            borderRadius: "5px",
          }}
        >
          Crop & Extract Text
        </button>
      )}

      {loading && <p>Processing... ⏳</p>}

      {text && (
        <textarea
          rows="4"
          value={text}
          readOnly
          style={{ width: "80%", marginTop: "20px" }}
        />
      )}
    </div>
  );
};

export default VisionOCR;
