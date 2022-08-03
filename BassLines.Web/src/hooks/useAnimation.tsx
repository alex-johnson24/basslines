// Great demo and implementation here: https://www.joshwcomeau.com/react/boop/
import * as React from "react";
import { SpringValue, useSpring } from "react-spring";

export type HookStyle = {
  transform: SpringValue<string>;
  display: SpringValue<string>;
};

const useAnimation = ({
  x = 0,
  y = 0,
  rotation = 0,
  scale = 1,
  timing = 150,
}): [HookStyle, () => void] => {
  const [doAnimation, setDoAnimation] = React.useState(false);

  const style = useSpring({
    transform: doAnimation
      ? `translate(${x}px, ${y}px)
      rotate(${rotation}deg)
      scale(${scale})`
      : `translate(0px, 0px)
    rotate(0deg)
    scale(1)`,
    display: "inline-block",
    config: { tension: 500, friction: 10 },
  });

  React.useEffect(() => {
    if (!doAnimation) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setDoAnimation(false);
    }, timing);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [doAnimation]);

  const trigger = React.useCallback(() => {
    setDoAnimation(true);
  }, []);

  return [style, trigger];
};

export default useAnimation;
