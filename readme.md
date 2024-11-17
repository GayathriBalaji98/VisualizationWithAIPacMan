# Play Pac-Man using Gestures: Teach an ML model to read your gestures in your web browser

This project is part of the programming lab for the UMN CSCI 8980 course: Visualization with AI.

<img width="1776" alt="image" src="https://github.com/user-attachments/assets/eb05a80e-fc76-426c-834f-d5ab68b31522">


In this project, an ML model will predict directions from an image in web camera.
We can fine-tune a pretrained [MobileNet](https://github.com/tensorflow/tfjs-examples/tree/master/mobilenet) model  to predict 4 different classes (i.e, up, down, left, right) as defined by the user.

## How Does the Project Work
Check out the [Live Demo](https://visual-intelligence-umn.github.io/ML-PANCMAN/)



1. **Add Example**: Use your web camera to provide example images for the four different classes (up, down, left, right).
2. **Train**: Fine-tune the ML model with these images.
3. **Play**: Start playing Pac-Man by making gestures in front of your web camera.


## Run and Develop the Project in Your Laptop

#### Preparation
- Ensure you have a code IDE like [VSCode](https://code.visualstudio.com/download) installed. VSCode is recommended, but feel free to use any IDE of your choice.
- [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine.
- (If you are familar with Github) `fork` this repository, and `clone` the forked repository to your local machine. [Learn how to fork and clone](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
- (If you are not familar with Github) directly download the code from this repo

#### Install npm Dependencies
1. Open the cloned project folder with VSCode.
2. Launch the VSCode integrated terminal from menu:  `View > Terminal`.
3. In the terminal, run `npm install` to install necessary npm packages (first-time setup only).

#### Run the Project
  Execute `npm start` in the terminal.
 
  The project will open in your default web browser.
  Any code changes will automatically update the webpage.
  Google Chrome is recommended for the development.
  
## Acknowledgement
This project is a modified version based on the official TensorFlow.js demos. 
For more information and additional context, visit [TensorFlow.js](https://www.tensorflow.org/js/demos).

The PANC-MAN uses the implementation at https://github.com/astraube/pacman-covid-19/

