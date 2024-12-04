const GestureFeedback = ({ gesture }) => {
    console.log("Gesture Feedback Component:", gesture); // Debug log
    if (!gesture) {
        console.log("Gesture Feedback is null or undefined.");
        return null;
    }

    const gestureVisuals = {
        "UP": "⬆️",
        "DOWN": "⬇️",
        "LEFT": "⬅️",
        "RIGHT": "➡️",
        "UNKNOWN": "❓"
    };    

    return (
        
        <div className="gesture-overlay">
            Gesture Detected: {gestureVisuals[gesture] || ""}
        </div>

    );
};

export default GestureFeedback;