const GestureFeedback = ({ gesture }) => {
    if (!gesture) return null;

    const gestureVisuals = {
        "UP": "⬆️",
        "DOWN": "⬇️",
        "LEFT": "⬅️",
        "RIGHT": "➡️",
        "UNKNOWN": "❓"
    };

    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
        }}>
            Gesture Detected: {gestureVisuals[gesture] || "❓"}
        </div>
    );
};

export default GestureFeedback;
