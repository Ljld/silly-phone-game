<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useSound } from '../../composables/useSound.js';

const emit = defineEmits(['win']);
const sound = useSound();

const TARGET = 100;
const p1Taps = ref(0);
const p2Taps = ref(0);
const timeLeft = ref(8);
const message = ref('Tap like CRAZY! 🤪');
let shakeValue = ref(0);
let timer = null;
let motionHandler = null;
let lastAccel = { x: 0, y: 0, z: 0 };
let hasMotion = ref(false);

const handleMotion = (event) => {
  const accel = event.accelerationIncludingGravity;
  if (!accel) return;
  hasMotion.value = true;

  const dx = Math.abs(accel.x - lastAccel.x);
  const dy = Math.abs(accel.y - lastAccel.y);
  const dz = Math.abs(accel.z - lastAccel.z);
  const total = dx + dy + dz;
  lastAccel = { x: accel.x, y: accel.y, z: accel.z };

  if (total > 5) {
    shakeValue.value += total * 0.3;
    p1Taps.value = Math.min(Math.floor(shakeValue.value / 2), TARGET);
    p2Taps.value = Math.min(Math.floor(shakeValue.value / 2), TARGET);
  }
};

const tapP1 = (e) => {
  e.preventDefault();
  p1Taps.value = Math.min(p1Taps.value + 1, TARGET);
  sound.tick();
  checkWin();
};

const tapP2 = (e) => {
  e.preventDefault();
  p2Taps.value = Math.min(p2Taps.value + 1, TARGET);
  sound.tick();
  checkWin();
};

const checkWin = () => {
  if (p1Taps.value >= TARGET) {
    cleanup();
    emit('win', 'p1');
  } else if (p2Taps.value >= TARGET) {
    cleanup();
    emit('win', 'p2');
  }
};

const cleanup = () => {
  if (timer) clearInterval(timer);
  if (motionHandler) window.removeEventListener('devicemotion', motionHandler);
};

onMounted(() => {
  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then((state) => {
        if (state === 'granted') {
          motionHandler = handleMotion;
          window.addEventListener('devicemotion', motionHandler);
        }
      })
      .catch(() => {});
  } else if (typeof DeviceMotionEvent !== 'undefined') {
    motionHandler = handleMotion;
    window.addEventListener('devicemotion', motionHandler);
  }

  timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      cleanup();
      if (p1Taps.value > p2Taps.value) {
        emit('win', 'p1');
      } else if (p2Taps.value > p1Taps.value) {
        emit('win', 'p2');
      } else {
        emit('win', Math.random() > 0.5 ? 'p1' : 'p2');
      }
    }
  }, 1000);
});

onUnmounted(cleanup);
</script>

<template>
  <div class="shake-off">
    <div class="info-bar">
      <span>⏱️ {{ timeLeft }}s</span>
      <span>{{ message }}</span>
    </div>
    <div class="halves">
      <button
        class="half p1-half"
        @touchstart="tapP1"
        @mousedown="tapP1"
      >
        <div class="shake-info">
          <div class="shake-meter">
            <div class="meter-fill p1-meter" :style="{ width: (p1Taps / TARGET * 100) + '%' }" />
          </div>
          <span class="shake-count">{{ p1Taps }}</span>
          <span class="shake-label">TAP FAST! 👆</span>
        </div>
      </button>
      <button
        class="half p2-half"
        @touchstart="tapP2"
        @mousedown="tapP2"
      >
        <div class="shake-info">
          <div class="shake-meter">
            <div class="meter-fill p2-meter" :style="{ width: (p2Taps / TARGET * 100) + '%' }" />
          </div>
          <span class="shake-count">{{ p2Taps }}</span>
          <span class="shake-label">TAP FAST! 👆</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.shake-off {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0.8rem;
  background: rgba(0,0,0,0.5);
  font-size: 0.85rem;
  color: var(--gold);
}

.halves {
  flex: 1;
  display: flex;
}

.half {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.05s;
}

.half:active {
  filter: brightness(1.2);
}

.p1-half { background: linear-gradient(180deg, var(--p1-dark), var(--p1-color)); }
.p2-half { background: linear-gradient(180deg, var(--p2-dark), var(--p2-color)); }

.shake-info {
  text-align: center;
  width: 80%;
}

.shake-meter {
  height: 20px;
  background: rgba(0,0,0,0.3);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.meter-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.1s;
}

.p1-meter { background: var(--p1-light); }
.p2-meter { background: var(--p2-light); }

.shake-count {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  display: block;
}

.shake-label {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  font-weight: 600;
}
</style>
