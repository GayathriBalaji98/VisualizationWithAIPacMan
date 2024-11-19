import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { generateGradCAM, base64ToTensor } from "../model";

export default function GradCAMViewer({ model, truncatedMobileNet }) {
  const [showGradCAM, setShowGradCAM] = useState(false);
  const [gradCAMImage, setGradCAMImage] = useState(null);
  const [gradCAM, setGradCAM] = useState(null);

  const handleGenerateGradCAM = async () => {
    const imgTensor = await base64ToTensor(gradCAMImage);
    const classIndex = 0; // Change this to the desired class index
    const gradCAM = await generateGradCAM(model, truncatedMobileNet, imgTensor, classIndex);
    setGradCAM(gradCAM);
  };

  useEffect(() => {
    if (gradCAM) {
      const canvas = document.getElementById("gradCAMCanvas");
      const ctx = canvas.getContext("2d");
      const imageData = new ImageData(new Uint8ClampedArray(gradCAM.dataSync()), gradCAM.shape[1], gradCAM.shape[0]);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [gradCAM]);

  return (
    <Box>
      <Button variant="contained" onClick={() => setShowGradCAM(!showGradCAM)}>
        {showGradCAM ? "Hide Grad-CAM" : "Show Grad-CAM"}
      </Button>
      {showGradCAM && (
        <Box>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGradCAMImage(URL.createObjectURL(e.target.files[0]))}
          />
          <Button variant="contained" onClick={handleGenerateGradCAM}>
            Generate Grad-CAM
          </Button>
          <canvas id="gradCAMCanvas" width="224" height="224"></canvas>
        </Box>
      )}
    </Box>
  );
}