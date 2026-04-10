<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useVibrate } from '../../composables/useVibrate.js';
import { useSound } from '../../composables/useSound.js';

const emit = defineEmits(['win']);
const { shortBuzz, longBuzz } = useVibrate();
const sound = useSound();

const colors = [
  { name: 'RED', hex: '#e74c3c' },
  { name: 'BLUE', hex: '#3498db' },
  { name: 'GREEN', hex: '#2ecc71' },
  { name: 'YELLOW', hex: '#f1c40f' },
  { name: 'PURPLE', hex: '#9b59b6' },
  { name: 'ORANGE', hex: '#e67e22' },
];

const p1Score = ref(0);
const p2Score = ref(0);
const targetColor = ref(null);
const p1Color = ref(null);
const p2Color = ref(null);
const roundActive = ref(false);
const feedback = ref('');
const ROUNDS_TO_WIN = 5;
let roundTimer = null;

const pickColors = () => {
  const shuffled = [...colors].sort(() => Math.random() - 0.5);
  targetColor.value = shuffled[0];
  p1Color.value = shuffled[Math.random() > 0.5 ? 0 : 1];
  p2Color.value = shuffled[Math.random() > 0.5 ? 0 : 2];

  if (Math.random() > 0.4) {
    if (Math.random() > 0.5) {
      p1Color.value = shuffled[0];
    } else {
      p2Color.value = shuffled[0];
    }
  }

  roundActive.value = true;
  feedback.value = '';
};

const handleTap = (player) => {
  if (!roundActive.value) return;

  const playerColor = player === 'p1' ? p1Color.value : p2Color.value;
  const isMatch = playerColor.name === targetColor.value.name;

  if (isMatch) {
    roundActive.value = false;
    if (player === 'p1') p1Score.value++;
    else p2Score.value++;
    shortBuzz();
    sound.tap();
    feedback.value = `${player === 'p1' ? 'P1' : 'P2'} matched it! ✅`;

    if (p1Score.value >= ROUNDS_TO_WIN) {
      setTimeout(() => emit('win', 'p1'), 800);
      return;
    }
    if (p2Score.value >= ROUNDS_TO_WIN) {
      setTimeout(() => emit('win', 'p2'), 800);
      return;
    }

    setTimeout(pickColors, 1000);
  } else {
    roundActive.value = false;
    longBuzz();
    sound.fail();
    const other = player === 'p1' ? 'p2' : 'p1';
    if (other === 'p1') p1Score.value++;
    else p2Score.value++;
    feedback.value = `Wrong color, ${player === 'p1' ? 'P1' : 'P2'}! ❌`;

    if (p1Score.value >= ROUNDS_TO_WIN) {
      setTimeout(() => emit('win', 'p1'), 800);
      return;
    }
    if (p2Score.value >= ROUNDS_TO_WIN) {
      setTimeout(() => emit('win', 'p2'), 800);
      return;
    }

    setTimeout(pickColors, 1000);
  }
};

onMounted(() => {
  pickColors();
});

onUnmounted(() => {
  if (roundTimer) clearTimeout(roundTimer);
});
</script>

<template>
  <div class="color-match">
    <div class="target-bar" :style="{ background: targetColor?.hex }">
      <span class="target-text">Tap if you have: {{ targetColor?.name }}</span>
      <span class="scores-text">P1: {{ p1Score }} | P2: {{ p2Score }}</span>
    </div>
    <div v-if="feedback" class="feedback">{{ feedback }}</div>
    <div class="halves">
      <button
        class="half p1-half"
        :style="{ background: p1Color?.hex }"
        @touchstart.prevent="handleTap('p1')"
        @mousedown.prevent="handleTap('p1')"
      >
        <span class="color-label">P1</span>
        <span class="color-name">{{ p1Color?.name }}</span>
      </button>
      <button
        class="half p2-half"
        :style="{ background: p2Color?.hex }"
        @touchstart.prevent="handleTap('p2')"
        @mousedown.prevent="handleTap('p2')"
      >
        <span class="color-label">P2</span>
        <span class="color-name">{{ p2Color?.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.color-match {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.target-bar {
  padding: 0.6rem 0.8rem;
  text-align: center;
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.target-text {
  font-weight: 700;
  font-size: 1rem;
}

.scores-text {
  font-size: 0.8rem;
  opacity: 0.8;
}

.feedback {
  text-align: center;
  padding: 0.3rem;
  font-size: 1rem;
  font-weight: 600;
  background: rgba(0,0,0,0.5);
}

.halves {
  flex: 1;
  display: flex;
}

.half {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: filter 0.1s;
}

.half:active {
  filter: brightness(1.3);
}

.color-label {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255,255,255,0.6);
}

.color-name {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.8);
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}
</style>
