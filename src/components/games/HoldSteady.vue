<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useVibrate } from '../../composables/useVibrate.js';
import { useSound } from '../../composables/useSound.js';

const emit = defineEmits(['win']);
const { shortBuzz, longBuzz } = useVibrate();
const sound = useSound();

const HOLD_TIME = 5;
const p1Holding = ref(false);
const p2Holding = ref(false);
const p1Progress = ref(0);
const p2Progress = ref(0);
const p1Failed = ref(false);
const p2Failed = ref(false);
const message = ref('Hold your side! Don\'t lift!');
let animFrame = null;
let p1Start = 0;
let p2Start = 0;

const update = () => {
  const now = Date.now();

  if (p1Holding.value && !p1Failed.value) {
    p1Progress.value = Math.min(((now - p1Start) / (HOLD_TIME * 1000)) * 100, 100);
    if (p1Progress.value >= 100) {
      emit('win', 'p1');
      return;
    }
  }

  if (p2Holding.value && !p2Failed.value) {
    p2Progress.value = Math.min(((now - p2Start) / (HOLD_TIME * 1000)) * 100, 100);
    if (p2Progress.value >= 100) {
      emit('win', 'p2');
      return;
    }
  }

  animFrame = requestAnimationFrame(update);
};

const p1Down = (e) => {
  e.preventDefault();
  if (p1Failed.value) return;
  p1Holding.value = true;
  p1Start = Date.now() - (p1Progress.value / 100 * HOLD_TIME * 1000);
  shortBuzz();
};

const p1Up = (e) => {
  e.preventDefault();
  if (!p1Holding.value || p1Failed.value) return;
  p1Holding.value = false;
  if (p1Progress.value < 100) {
    p1Failed.value = true;
    p1Progress.value = 0;
    longBuzz();
    sound.fail();
    message.value = 'P1 lifted! 😱';
    if (p2Failed.value) {
      emit('win', Math.random() > 0.5 ? 'p1' : 'p2');
    }
  }
};

const p2Down = (e) => {
  e.preventDefault();
  if (p2Failed.value) return;
  p2Holding.value = true;
  p2Start = Date.now() - (p2Progress.value / 100 * HOLD_TIME * 1000);
  shortBuzz();
};

const p2Up = (e) => {
  e.preventDefault();
  if (!p2Holding.value || p2Failed.value) return;
  p2Holding.value = false;
  if (p2Progress.value < 100) {
    p2Failed.value = true;
    p2Progress.value = 0;
    longBuzz();
    sound.fail();
    message.value = 'P2 lifted! 😱';
    if (p1Failed.value) {
      emit('win', Math.random() > 0.5 ? 'p1' : 'p2');
    }
  }
};

onMounted(() => {
  animFrame = requestAnimationFrame(update);
});

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame);
});
</script>

<template>
  <div class="hold-steady">
    <div class="info-bar">
      <span>{{ message }}</span>
      <span>Hold for {{ HOLD_TIME }}s!</span>
    </div>
    <div class="halves">
      <button
        class="half p1-half"
        :class="{ holding: p1Holding, failed: p1Failed }"
        @touchstart="p1Down"
        @touchend="p1Up"
        @touchcancel="p1Up"
        @mousedown="p1Down"
        @mouseup="p1Up"
        @mouseleave="p1Up"
      >
        <div class="hold-content">
          <div class="hold-bar-bg">
            <div class="hold-bar-fill p1-fill" :style="{ height: p1Progress + '%' }" />
          </div>
          <span v-if="p1Failed" class="failed-text">LIFTED! 💀</span>
          <span v-else class="hold-text">{{ p1Holding ? 'HOLDING...' : 'PRESS & HOLD' }}</span>
        </div>
      </button>
      <button
        class="half p2-half"
        :class="{ holding: p2Holding, failed: p2Failed }"
        @touchstart="p2Down"
        @touchend="p2Up"
        @touchcancel="p2Up"
        @mousedown="p2Down"
        @mouseup="p2Up"
        @mouseleave="p2Up"
      >
        <div class="hold-content">
          <div class="hold-bar-bg">
            <div class="hold-bar-fill p2-fill" :style="{ height: p2Progress + '%' }" />
          </div>
          <span v-if="p2Failed" class="failed-text">LIFTED! 💀</span>
          <span v-else class="hold-text">{{ p2Holding ? 'HOLDING...' : 'PRESS & HOLD' }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hold-steady {
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
  transition: all 0.2s;
}

.p1-half { background: var(--p1-dark); }
.p2-half { background: var(--p2-dark); }
.p1-half.holding { background: var(--p1-color); }
.p2-half.holding { background: var(--p2-color); }
.half.failed { background: #444; }

.hold-content {
  text-align: center;
  position: relative;
}

.hold-bar-bg {
  width: 40px;
  height: 150px;
  background: rgba(0,0,0,0.3);
  border-radius: 20px;
  margin: 0 auto 0.5rem;
  overflow: hidden;
  position: relative;
}

.hold-bar-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  transition: height 0.1s linear;
}

.p1-fill { background: var(--p1-light); }
.p2-fill { background: var(--p2-light); }

.hold-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
}

.failed-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #e74c3c;
}
</style>
