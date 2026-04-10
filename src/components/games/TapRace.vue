<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useVibrate } from '../../composables/useVibrate.js';
import { useSound } from '../../composables/useSound.js';

const emit = defineEmits(['win']);
const { shortBuzz } = useVibrate();
const sound = useSound();

const TARGET = 20;
const p1Count = ref(0);
const p2Count = ref(0);
const p1Progress = ref(0);
const p2Progress = ref(0);
const timeLeft = ref(10);
let timer = null;

const tapP1 = (e) => {
  e.preventDefault();
  p1Count.value++;
  p1Progress.value = Math.min((p1Count.value / TARGET) * 100, 100);
  shortBuzz();
  sound.tap();
  if (p1Count.value >= TARGET) {
    emit('win', 'p1');
    cleanup();
  }
};

const tapP2 = (e) => {
  e.preventDefault();
  p2Count.value++;
  p2Progress.value = Math.min((p2Count.value / TARGET) * 100, 100);
  shortBuzz();
  sound.tap();
  if (p2Count.value >= TARGET) {
    emit('win', 'p2');
    cleanup();
  }
};

const cleanup = () => {
  if (timer) clearInterval(timer);
};

onMounted(() => {
  timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      cleanup();
      if (p1Count.value > p2Count.value) {
        emit('win', 'p1');
      } else if (p2Count.value > p1Count.value) {
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
  <div class="tap-race">
    <div class="timer-bar">
      <span>⏱️ {{ timeLeft }}s</span>
      <span>First to {{ TARGET }} taps!</span>
    </div>
    <div class="halves">
      <button
        class="half p1-half"
        @touchstart="tapP1"
        @mousedown="tapP1"
      >
        <div class="tap-info">
          <span class="tap-count">{{ p1Count }}</span>
          <div class="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" class="ring-bg" />
              <circle
                cx="50" cy="50" r="40"
                class="ring-fill p1-ring"
                :style="{ strokeDashoffset: 251 - (251 * p1Progress / 100) }"
              />
            </svg>
          </div>
          <span class="tap-label">TAP!</span>
        </div>
      </button>
      <button
        class="half p2-half"
        @touchstart="tapP2"
        @mousedown="tapP2"
      >
        <div class="tap-info">
          <span class="tap-count">{{ p2Count }}</span>
          <div class="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" class="ring-bg" />
              <circle
                cx="50" cy="50" r="40"
                class="ring-fill p2-ring"
                :style="{ strokeDashoffset: 251 - (251 * p2Progress / 100) }"
              />
            </svg>
          </div>
          <span class="tap-label">TAP!</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tap-race {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.timer-bar {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.8rem;
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

.p1-half { background: var(--p1-color); }
.p2-half { background: var(--p2-color); }

.tap-info {
  text-align: center;
  position: relative;
}

.tap-count {
  font-size: 4rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  position: relative;
  z-index: 1;
}

.progress-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
}

.progress-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255,255,255,0.2);
  stroke-width: 6;
}

.ring-fill {
  fill: none;
  stroke-width: 6;
  stroke-dasharray: 251;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s;
}

.p1-ring { stroke: var(--p1-dark); }
.p2-ring { stroke: var(--p2-dark); }

.tap-label {
  display: block;
  margin-top: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
}
</style>
