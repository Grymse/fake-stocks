import { animations } from "@/components/utils/Animations";
import { Animation } from "@/hooks/useAnimations";
import React, { createContext, useRef, useState } from "react";

type AnimationsProviderProps = {
  children: React.ReactNode;
};

type AnimationsContextType = {
  animate: (animation: Animation, duration?: number) => void;
};

export const AnimationsContext = createContext<AnimationsContextType>({
  animate: () => {},
});

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
      {children}
      {animation && animations[animation]}
    </AnimationsContext.Provider>
  );
};
