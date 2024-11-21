# Fractal Snowflakes Game

This is a fun interactive fractal snowflake game developed with Three.js, OrbitControls, and dat.GUI. In this project, you can create fractal snowflakes that fall from the sky and click on them to make them disappear with a sound effect. It uses WebGL and various advanced techniques to generate unique fractal snowflakes, giving each snowflake a distinct shape.

## Features
- **Fractal Snowflakes**: Generates fractal snowflakes using Koch curves and randomness to create unique shapes.
- **Interactive GUI**: Adjust the number of snowflakes, their complexity, and falling speed using an interactive control panel.
- **Snowflake Popping Sound**: Click on a snowflake to make it disappear with a sound effect.
- **Orbit Controls**: Pan, zoom, and rotate around the scene using mouse controls.

## Tech Stack
- **Three.js**: A JavaScript 3D library that makes creating 3D scenes easier.
- **dat.GUI**: A lightweight GUI for tweaking parameters interactively.
- **HTML5 & JavaScript**: For building the core functionality.

## Installation
1. **Clone the repository**
   ```sh
   git clone <repository_url>
   cd fractal-snowflakes-game
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```sh
   npm install
   ```

3. **Run the Game**
   ```sh
   npm start
   ```
   The project will start on `http://localhost:9000`.

## Project Structure
- **src/index.js**: Main JavaScript file containing the game logic.
- **src/pop.mp3**: Audio file used for the snowflake popping sound.
- **webpack.config.js**: Webpack configuration for bundling the project.

## How to Play
1. **Adjust Snowflake Parameters**: Use the provided control panel (dat.GUI) to set the number of snowflakes, their complexity, and the fall speed.
2. **Interact with Snowflakes**: Click or tap on snowflakes to make them disappear. The pop sound will play whenever a snowflake is removed.

## Controls
- **Mouse Click / Touch**: Click or tap on a snowflake to make it disappear.
- **Orbit Controls**: Use the mouse to orbit around the scene.
  - Left-click to rotate.
  - Right-click to pan.
  - Scroll to zoom in or out.

## Audio Issue Troubleshooting
If you do not hear the pop sound when clicking on a snowflake:
- Make sure the audio files are correctly placed in the `src` or `assets` folder.
- Ensure your browser supports the audio formats used (`.mp3`, `.ogg`, `.wav`).

## Building for Production
To build the project for production:
```sh
npm run build
```
The optimized output will be in the `dist` folder.

## Contributions
Feel free to contribute to this project by opening issues or submitting pull requests. Whether it's adding new features, improving visuals, or fixing bugs, your help is greatly appreciated!

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- **Three.js**: A powerful and simple-to-use library for creating 3D content on the web.
- **dat.GUI**: For providing an easy-to-use control panel to adjust parameters on the fly.

Enjoy creating and interacting with these beautiful fractal snowflakes!