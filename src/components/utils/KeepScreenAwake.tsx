import { useEffect, useRef } from "react";

type Props = { active?: boolean };

export default function KeepScreenAwake({ active }: Props) {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = async () => {
    try {
      wakeLock.current = await navigator.wakeLock.request("screen");
    } catch (err) {
      // @ts-expect-error this is a hack to get the error message
      console.error(`${err.name}, ${err.message}`);
    }
  };

  useEffect(() => {
    if (active === false) return;
    requestWakeLock();

    const interval = setInterval(() => {
      if (wakeLock.current?.released) requestWakeLock();
    }, 5000);

    return () => {
      clearInterval(interval);
      wakeLock.current?.release();
    };
  }, [active]);

  return null;
}
