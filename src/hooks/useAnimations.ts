import { animations } from "@/components/utils/Animations";
import { AnimationsContext } from "@/contexts/AnimationsProvider";
import { useContext } from "react";

export type Animation = keyof typeof animations | null;

export const useAnimations = () => {
  return useContext(AnimationsContext);
};

export function getRandomAnimation(): Animation {
  const keys = Object.keys(animations);
  return keys[Math.floor(Math.random() * keys.length)] as Animation;
}
