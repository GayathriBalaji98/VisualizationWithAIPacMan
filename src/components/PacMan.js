import { Button } from "@mui/material";
import "../lib/PacmanCovid/styles/index.scss";
import PacmanCovid from "../lib/PacmanCovid";
import { gameRunningAtom, predictionAtom, trainingEndedAtom } from "../GlobalState";
import { useAtom } from "jotai";

import GestureFeedback from "./GestureFeedback"; //import feedback component
import { useEffect, useState } from 'react';

export default function PacMan() {
    const [isRunning, setIsRuning] = useAtom(gameRunningAtom);
    const [predictionDirection] = useAtom(predictionAtom);
    const [trainingEnded] = useAtom(trainingEndedAtom); 
    const [gestureFeedback, setGestureFeedback] = useState(null); // add gesture feedback state
    const [delayedPrediction, setDelayedPrediction] = useState(null); //add state for delayed execution
    const [gestureConfirmed, setGestureConfirmed] = useState(false);

    const pacManProps = {
        gridSize: 17,
        animate: process.env.NODE_ENV !== "development",
        locale: "pt",
        onEnd: () => {
            console.log("onEnd");
        },
    };

    // Effect: Handle new predictions and update gesture feedback
    useEffect(() => {
        if (predictionDirection !== null) {
            const gestureMapping = {
                0: "UP",
                1: "DOWN",
                2: "LEFT",
                3: "RIGHT"
            };
            const newGesture = gestureMapping[predictionDirection] || "UNKNOWN";
            setGestureFeedback(newGesture);
            console.log("Set Gesture Feedback:", newGesture); // Debug log
            setGestureConfirmed(false); // Reset confirmation on new gesture

        }
    }, [predictionDirection]);

    // Effect: Delay execution of confirmed gestures
    useEffect(() => {
        console.log("Gesture Confirmed State:", gestureConfirmed); // Log gesture confirmation state
        if (gestureConfirmed && predictionDirection !== null) {
            const delayTimeout = setTimeout(() => {
                setDelayedPrediction(predictionDirection);
                console.log("Delayed Prediction Set:", predictionDirection); // Log delayed prediction
            }, 500); // 500ms delay

            return () => clearTimeout(delayTimeout); // Clean up timeout on re-render
        }
    }, [gestureConfirmed, predictionDirection]);

    // Effect: Debugging feedback state
    useEffect(() => {
        console.log("Gesture Feedback Cleared:", gestureFeedback);
    }, [gestureFeedback]);

    // Effect: Debugging delayed prediction
    useEffect(() => {
        console.log("Delayed Prediction:", delayedPrediction);
    }, [delayedPrediction]);

    return (
        <>
            <GestureFeedback gesture={gestureFeedback} /> {/* gesture feedback component */}

            {gestureFeedback && !gestureConfirmed && (
                <div style={{ position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => {
                            setGestureConfirmed(true);
                            console.log("Confirm Gesture Clicked"); // Log confirm click
                            }}
                    >
                        Confirm Gesture
                    </Button>
                    <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={() => {
                                setGestureFeedback(null)
                                console.log("Gesture Cancelled"); // Log cancellation
                            }}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            <PacmanCovid
                {...pacManProps}
                isRunning={isRunning}
                setIsRuning={setIsRuning}
                predictions={delayedPrediction} //***&*& */
                gestureConfirmed={gestureConfirmed} // Pass gesture confirmation
            />
            {!isRunning && (
                <Button variant="contained" onClick={() => setIsRuning(!isRunning)}
                disabled={!trainingEnded}
                >
                    {" "}
                    Start
                </Button>
            )}
        </>
    );
}
