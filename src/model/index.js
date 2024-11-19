import * as tf from "@tensorflow/tfjs";
import { getDefaultStore } from "jotai";
import { stopTrainingAtom, trainingProgressAtom } from "../GlobalState";

export async function loadTruncatedMobileNet() {
  const mobilenet = await tf.loadLayersModel(
    "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
  );

  const layer = mobilenet.getLayer("conv_pw_13_relu");
  let truncatedMobileNet = tf.model({
    inputs: mobilenet.inputs,
    outputs: layer.output,
  });

  console.info("Truncated MobileNet model has been loaded.");

  return truncatedMobileNet;
}

export async function processImages(imgSrcArr, truncatedMobileNet) {
  let xs = null;
  let ys = null;

  await Promise.all(
    imgSrcArr.map(async (image) => {
      const imgTensor = await base64ToTensor(image.src);
      const embeddings = truncatedMobileNet.predict(imgTensor);

      let labelNum;
      switch (image.label) {
        case "up":
          labelNum = 0;
          break;
        case "down":
          labelNum = 1;
          break;
        case "left":
          labelNum = 2;
          break;
        case "right":
          labelNum = 3;
          break;
      }

      const y = tf.tidy(() => tf.oneHot(tf.tensor1d([labelNum]).toInt(), 4));

      if (xs == null) {
        xs = tf.keep(embeddings);
        ys = tf.keep(y);
      } else {
        const oldX = xs;
        xs = tf.keep(oldX.concat(embeddings, 0));

        const oldY = ys;
        ys = tf.keep(oldY.concat(y, 0));

        oldX.dispose();
        oldY.dispose();
        y.dispose();
      }
    })
  );

  return { xs, ys };
}
export async function buildModel(
  truncatedMobileNet,
  setLoss,
  controllerDataset,
  hiddenUnits = 100,
  batchSize = 1,
  epochs = 100,
  learningrate = 0.0001
) {
  const model = tf.sequential({
    layers: [
      tf.layers.flatten({
        inputShape: truncatedMobileNet.outputs[0].shape.slice(1),
      }),
      tf.layers.dense({
        units: hiddenUnits,
        activation: "relu",
        kernelInitializer: "varianceScaling",
        useBias: true,
      }),
      //tf.layers.globalAveragePooling2d(), // Ensure this is correctly added
      tf.layers.dense({
        units: 4,
        kernelInitializer: "varianceScaling",
        useBias: false,
        activation: "softmax",
      }),
    ],
  });

  const optimizer = tf.train.adam(learningrate);
  model.compile({ optimizer: optimizer, loss: "categoricalCrossentropy" });
  const store = getDefaultStore();

  model.fit(controllerDataset.xs, controllerDataset.ys, {
    batchSize,
    epochs: epochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        setLoss(logs.loss.toFixed(5));
      },
      onTrainEnd: async () => {
        store.set(trainingProgressAtom, -1);
        console.log("Training has ended.");
      },
      onEpochEnd: async (epoch, logs) => {
        store.set(
          trainingProgressAtom,
          Math.floor(((epoch + 1) / epochs) * 100)
        );
        if (store.get(stopTrainingAtom)) {
          model.stopTraining = true;
          store.set(stopTrainingAtom, false);
          console.log("Training has been stopped.");
        }
      },
    },
  });

  return model;
}
export async function predict(truncatedMobileNet, model, img) {
  const embeddings = truncatedMobileNet.predict(img);
  const predictions = await model.predict(embeddings);
  const predictedClass = predictions.as1D().argMax();
  const classId = (await predictedClass.data())[0];
  return classId;
}

export async function predictDirection(webcamRef, truncatedMobileNet, model) {
  const newImageSrc = webcamRef.current.getScreenshot();
  if (newImageSrc) {
    const imgTensor = await base64ToTensor(newImageSrc);
    const prediction = await predict(truncatedMobileNet, model, imgTensor);

    switch (prediction) {
      case 0:
        return 1;
      case 1:
        return 3;
      case 2:
        return 2;
      case 3:
        return 0;
      default:
        return -1;
    }
  }
}

export async function base64ToTensor(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image(224, 224);
    img.crossOrigin = "Anonymous";

    img.onerror = (error) => {
      reject(new Error("Failed to load image: " + error.message));
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas 2D context"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let tensor = tf.browser.fromPixels(imageData);
      tensor = tensor.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1.0));
      const expandedTensor = tensor.expandDims(0);

      resolve(expandedTensor);
    };

    // Assign the base64 image source
    img.src = base64;
  });
}
export async function generateGradCAM(model, truncatedMobileNet, imgTensor, classIndex) {
  return tf.tidy(() => {
    // Get the last conv layer of MobileNet
    const lastConvLayer = truncatedMobileNet.getLayer("conv_pw_13_relu");
    
    // First, get the conv layer outputs
    const convOutputs = lastConvLayer.apply(imgTensor);
    
    // Then pass through our custom model
    const predictions = model.predict(convOutputs);
    
    // Calculate gradients of the target class with respect to conv outputs
    const targetClassPredictions = predictions.gather([classIndex], 1);
    const grads = tf.grad((t) => {
      const predsFromConv = model.predict(t);
      return predsFromConv.gather([classIndex], 1);
    })(convOutputs);
    
    // Global average pooling on gradients
    const pooledGrads = tf.mean(grads, [1, 2]);
    
    // Weight the conv outputs with gradients
    const weightedOutputs = tf.mul(
      convOutputs,
      pooledGrads.reshape([1, 1, 1, pooledGrads.shape[0]])
    );
    
    // Generate heatmap
    let heatmap = tf.mean(weightedOutputs, -1);
    heatmap = tf.relu(heatmap);
    
    // Normalize heatmap
    const max = tf.max(heatmap);
    const min = tf.min(heatmap);
    heatmap = heatmap.sub(min).div(max.sub(min));
    
    return heatmap;
  });
}

