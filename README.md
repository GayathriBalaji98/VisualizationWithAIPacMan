# ML-PACMAN: Gesture-Controlled Pac-Man

ML-PACMAN is an interactive, browser-based adaptation of the classic Pac-Man game that leverages hand gestures for control. A fine-tuned MobileNet model powers gesture recognition, enabling players to navigate the game without a traditional keyboard or controller. Additionally, a dashboard provides real-time insights into model performance and gameplay metrics. We have implemented various ways to visualize AI performance such as confidence score displays, real time interactions, UMAP, loss curve, etc. 

## ✨ Features
- **Custom Gesture Recognition**: Train a MobileNet model to recognize and map hand gestures to game controls.
- **Real-Time Interaction**: Use your webcam to control Pac-Man through intuitive hand movements.
- **Performance Metrics**: View loss rates, confidence scores, and other key model performance statistics.
- **Data Visualization**: Utilize UMAP to explore and analyze input datasets.
- **Classic Gameplay**: Enjoy Pac-Man’s familiar mechanics with an innovative twist.


## 🎮 Demo
Check out the demo: `demo.mov`

## 🔧 Technologies Used
- **React**: Frontend framework for building an interactive user interface.
- **TensorFlow.js**: Deploys and runs the trained model directly in the browser.
- **MobileNet**: Pre-trained model fine-tuned for hand gesture recognition.
- **D3.js**: Provides interactive data visualizations.
- **WebRTC**: Enables real-time webcam access for gesture detection.

## 🚀 Installation
Follow these steps to set up and run ML-PACMAN on your local machine:

1. **Clone the repository**
   ```sh
   git clone [https://github.com/GayathriBalaji98/VisualizationWithAIPacMan.git]
   cd VisualizationWithAIPacMan
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm start
   ```
---

Enjoy the game and happy coding! 🎉

