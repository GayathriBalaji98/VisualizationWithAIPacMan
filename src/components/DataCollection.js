import Webcam from "react-webcam";
import { Grid, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; 
import {
    ArrowUpward,
    ArrowDownward,
    ArrowBack,
    ArrowForward,
} from "@mui/icons-material/";
import { useState, useRef } from "react";
import { useAtom } from "jotai";
import {
    imgSrcArrAtom,
    dataSetSizeAtom,
    batchArrayAtom,
    batchSizeAtom,
    gameRunningAtom,
} from "../GlobalState";

const DIRECTIONS = {
    up: <ArrowUpward />,
    down: <ArrowDownward />,
    left: <ArrowBack />,
    right: <ArrowForward />,
};

export default function DataCollection({ webcamRef }) {
    const [isCameraOn, setIsCameraOn] = useState(false);

    // ---- Model Training ----
    const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);

    // ---- Configurations ----
    const [, setBatchSize] = useAtom(batchSizeAtom);
    const [gameRunning] = useAtom(gameRunningAtom);

    // ---- UI Display ----

    const capture = (direction) => async () => {
        // Capture image from webcam
        const newImageSrc = webcamRef.current.getScreenshot();

        // If image is not null, proceed with adding it to the dataset
        if (newImageSrc) {

            // Add example to the dataset
            const newImageArr = [...imgSrcArr, { src: newImageSrc, label: direction }];
            setImgSrcArr(newImageArr);
            setBatchSize(Math.floor(newImageArr.length * 0.4));
        }
    };

    const cameraPlaceholder = (
        <Box
            display="flex"
            textAlign={"center"}
            justifyContent="center"
            alignItems="center"
            sx={{
                p: 2,
                border: "1px dashed grey",
                height: "224px",
                width: "224px",
                margin: "auto",
                backgroundColor: "#ddd",
            }}
        >
            Camera is off
        </Box>
    );

    return (
        <Grid container>
            {/* first row */}

            <Grid
                item
                xs={12}
                sx={{ marginBottom: 2 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        disabled={gameRunning}
                    >
                        {" "}
                        {isCameraOn ? "Stop" : "Start"} Camera
                    </Button>
                </Box>
                <Box sx={{ marginTop: 1 }}>
                    {isCameraOn ? (
                        <Webcam
                            mirrored
                            width={224}
                            height={224}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                width: 224,
                                height: 224,
                                facingMode: "user",
                            }}
                        />
                    ) : (
                        cameraPlaceholder
                    )}
                </Box>
            </Grid>

            {Object.keys(DIRECTIONS).map((directionKey) => {
                return (
                    <OneDirection
                        key={directionKey}
                        directionKey={directionKey}
                        disabled={!isCameraOn}
                        directionIcon={DIRECTIONS[directionKey]}
                        onCapture={capture(directionKey)}
                        dirImgSrcArr={imgSrcArr.filter((d) => d.label == directionKey)}
                    />
                );
            })}
        </Grid>
    );
}

const OneDirection = ({ directionKey, directionIcon, onCapture, dirImgSrcArr, disabled }) => {
    const [, setImgSrcArr] = useAtom(imgSrcArrAtom);
    const handleDelete = () => {
        setImgSrcArr((prevArr) => prevArr.filter((img) => img.label !== directionKey));
    };

    return (
        <Grid item xs={3}>
            <Box textAlign="center">
                <Button
                    variant="outlined"
                    endIcon={directionIcon}
                    onClick={onCapture}
                    disabled={disabled}
                >
                    Add to
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDelete}
                    disabled={dirImgSrcArr.length === 0}
                    sx={{ marginLeft: 1 }}
                >
                    <DeleteIcon></DeleteIcon>
                </Button>
            </Box>
            <Box textAlign="center" sx={{ width: "100%", height: "100px" }}>
                {dirImgSrcArr.length > 0 && (
                    <img
                        height={"100%"}
                        src={dirImgSrcArr[dirImgSrcArr.length - 1].src}
                        style={{ padding: "2px" }}
                    />
                )}
            </Box>
        </Grid>
    );
};
