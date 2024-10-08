import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";
import Snow from "react-canvas-confetti/dist/presets/snow";
import Pride from "react-canvas-confetti/dist/presets/pride";

export const animations = {
  fireworks: <Fireworks autorun={{ speed: 4, duration: 800 }} />,
  explosion: <Explosion autorun={{ speed: 10, duration: 500 }} />,
  realistic: <Realistic autorun={{ speed: 2, duration: 500 }} />,
  crossfire: <Crossfire autorun={{ speed: 20, duration: 1000 }} />,
  snow: <Snow autorun={{ speed: 300, duration: 1000 }} />,
  pride: <Pride autorun={{ speed: 100, duration: 1000 }} />,
};
