export function useVibrate() {
  const vibrate = (pattern = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const shortBuzz = () => vibrate(30);
  const longBuzz = () => vibrate(150);
  const doubleBuzz = () => vibrate([50, 50, 50]);
  const winBuzz = () => vibrate([100, 50, 100, 50, 200]);

  return { vibrate, shortBuzz, longBuzz, doubleBuzz, winBuzz };
}
