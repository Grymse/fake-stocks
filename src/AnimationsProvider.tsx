// Create a provider that provides a method to trigger animations

import React, { createContext, useContext, useRef, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";
import Snow from "react-canvas-confetti/dist/presets/snow";
import Pride from "react-canvas-confetti/dist/presets/pride";
import { Button } from "./components/ui/button";

type AnimationsProviderProps = {
  children: React.ReactNode;
};

const animations = {
  fireworks: <Fireworks autorun={{ speed: 4, duration: 800 }} />,
  explosion: <Explosion autorun={{ speed: 10, duration: 500 }} />,
  realistic: <Realistic autorun={{ speed: 2, duration: 500 }} />,
  crossfire: <Crossfire autorun={{ speed: 20, duration: 1000 }} />,
  snow: <Snow autorun={{ speed: 300, duration: 1000 }} />,
  pride: <Pride autorun={{ speed: 100, duration: 1000 }} />,
};

export function getRandomAnimation(): Animation {
  const keys = Object.keys(animations);
  return keys[Math.floor(Math.random() * keys.length)] as Animation;
}

type Animation = keyof typeof animations | null;

type AnimationsContextType = {
  animate: (animation: Animation, duration?: number) => void;
};

const AnimationsContext = createContext<AnimationsContextType>({
  animate: () => {},
});

export const useAnimations = () => {
  return useContext(AnimationsContext);
};

export const AnimationsProvider = ({ children }: AnimationsProviderProps) => {
  const [animation, setAnimation] = useState<Animation | null>(null);

  const animateTimeout = useRef<NodeJS.Timeout | null>(null);

  const animate = (animation: Animation, duration?: number) => {
    setAnimation(animation);
    if (animateTimeout.current) clearTimeout(animateTimeout.current);
    animateTimeout.current = setTimeout(() => {
      setAnimation(null);
    }, duration ?? 5000);
  };

  return (
    <AnimationsContext.Provider value={{ animate }}>
      <Button onClick={() => animate("pride")}>animate</Button>
      {children}
      {animation && animations[animation]}
    </AnimationsContext.Provider>
  );
};
