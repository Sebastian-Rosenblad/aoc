import { useRef, useEffect } from 'react';

type InputType = 'example' | 'real';

interface UseAnimationLoopOptions {
  animationSpeed?: number;
  initialize: (input: InputType) => void;
  step: () => boolean;
}

export function useAnimationLoop({
  animationSpeed = 75,
  initialize,
  step
}: UseAnimationLoopOptions) {
  const animationIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const timeSinceUpdateRef = useRef<number>(0);

  function loop(timestamp: number) {
    const lastTime = lastTimeRef.current;
    const dt = lastTime === null ? 0 : timestamp - lastTime;
    lastTimeRef.current = timestamp;
    let newTimeSinceUpdate = timeSinceUpdateRef.current + dt;
    let shouldEnd = false;
    if (newTimeSinceUpdate >= animationSpeed) {
      newTimeSinceUpdate %= animationSpeed;
      shouldEnd = step();
    }
    timeSinceUpdateRef.current = newTimeSinceUpdate;
    if (!shouldEnd) animationIdRef.current = requestAnimationFrame(loop);
    else animationIdRef.current = null;
  }

  function start(input: InputType) {
    if (animationIdRef.current !== null) return;
    initialize(input);
    timeSinceUpdateRef.current = 0;
    lastTimeRef.current = null;
    animationIdRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return { start };
}
