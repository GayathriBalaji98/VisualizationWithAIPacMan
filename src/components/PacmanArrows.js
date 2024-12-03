import React from "react";
import { Box } from "@mui/material";

function PacmanArrows({ predictions }) {
  const positions = {
    up: { top: "10%", left: "50%", transform: "translate(-50%, -50%)" },
    down: { top: "90%", left: "50%", transform: "translate(-50%, -50%)" },
    left: { top: "50%", left: "10%", transform: "translate(-50%, -50%)" },
    right: { top: "50%", left: "90%", transform: "translate(-50%, -50%)" },
  };

  const getColor = (score) => {
    if (score >= 0.4) return "green";
    if (score >= 0.3) return "yellow";
    return "red";
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {predictions.map(({ direction, confidence }, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            ...positions[direction],
            color: getColor(confidence),
            fontSize: "80px", // Increased size for larger arrows
            fontWeight: "bold", // Stronger appearance
          }}
        >
          {direction === "up" && "↑"}
          {direction === "down" && "↓"}
          {direction === "left" && "←"}
          {direction === "right" && "→"}
        </div>
      ))}
    </div>
  );
}

export default PacmanArrows;
