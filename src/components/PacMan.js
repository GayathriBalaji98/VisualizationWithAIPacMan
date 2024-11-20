import { Button } from "@mui/material";
import "../lib/PacmanCovid/styles/index.scss";
import PacmanCovid from "../lib/PacmanCovid";
import { gameRunningAtom, predictionAtom } from "../GlobalState";
import { useAtom } from "jotai";

import GestureFeedback from './GestureFeedback'; // Import your feedback component
import { useState } from 'react';

export default function PacMan() {
    const [isRunning, setIsRuning] = useAtom(gameRunningAtom);
    const [predictionDirection] = useAtom(predictionAtom);
    const [gestureFeedback, setGestureFeedback] = useState(null); // Add gesture feedback state
    const [delayedPrediction, setDelayedPrediction] = useState(null); // Add state for delayed execution

    const pacManProps = {
        gridSize: 17,
        animate: process.env.NODE_ENV !== "development",
        locale: "pt",
        onEnd: () => {
            console.log("onEnd");
        },
    };

    // Update gesture feedback when prediction changes
    useEffect(() => {
        if (predictionDirection !== null) {
            const gestureMapping = {
                0: "UP",
                1: "DOWN",
                2: "LEFT",
                3: "RIGHT",
            };
            setGestureFeedback(gestureMapping[predictionDirection] || "UNKNOWN");

            // Delay the execution of the move
            const delayTimeout = setTimeout(() => {
                setDelayedPrediction(predictionDirection);
            }, 500); // 500ms delay

            return () => clearTimeout(delayTimeout); // Clear timeout on prediction change
        }
    }, [predictionDirection]);


    return (
        <>
            <GestureFeedback gesture={gestureFeedback} /> {/* Gesture feedback component */}
            <PacmanCovid
                {...pacManProps}
                isRunning={isRunning}
                setIsRuning={setIsRuning}
                predictions={delayedPrediction} // Use delayed prediction for movement
            />
            {!isRunning && (
                <Button variant="contained" onClick={() => setIsRuning(!isRunning)}>
                    {" "}
                    Start
                </Button>
            )}
        </>
    );
}
