const audioCtx = typeof AudioContext !== 'undefined'
  ? new AudioContext()
  : null;

function playTone(frequency, duration = 0.1, type = 'square', volume = 0.15) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function useSound() {
  const tap = () => playTone(600, 0.06);
  const countdown = () => playTone(440, 0.15, 'sine');
  const go = () => playTone(880, 0.3, 'sine', 0.2);
  const win = () => {
    playTone(523, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 150);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.2), 300);
  };
  const fail = () => playTone(200, 0.3, 'sawtooth', 0.1);
  const tick = () => playTone(1000, 0.03, 'sine', 0.08);

  return { tap, countdown, go, win, fail, tick };
}
