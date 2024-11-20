import { Button } from "@mui/material";
import "../lib/PacmanCovid/styles/index.scss";
import PacmanCovid from "../lib/PacmanCovid";
import { gameRunningAtom, predictionAtom, trainingEndedAtom } from "../GlobalState";
import { useAtom } from "jotai";

export default function PacMan() {
    const [isRunning, setIsRuning] = useAtom(gameRunningAtom);
    const [predictionDirection] = useAtom(predictionAtom);
    const [trainingEnded] = useAtom(trainingEndedAtom); 

    const pacManProps = {
        gridSize: 17,
        animate: process.env.NODE_ENV !== "development",
        locale: "pt",
        onEnd: () => {
            console.log("onEnd");
        },
    };

    return (
        <>
            <PacmanCovid
                {...pacManProps}
                isRunning={isRunning}
                setIsRuning={setIsRuning}
                predictions={predictionDirection}
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
