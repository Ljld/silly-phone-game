<script setup>
import { ref, computed, onUnmounted } from 'vue';
import TapRace from './games/TapRace.vue';
import QuickDraw from './games/QuickDraw.vue';
import ColorMatch from './games/ColorMatch.vue';
import HoldSteady from './games/HoldSteady.vue';
import ShakeOff from './games/ShakeOff.vue';
import CountdownOverlay from './CountdownOverlay.vue';
import RoundResult from './RoundResult.vue';
import { useSound } from '../composables/useSound.js';

const props = defineProps({
  scores: { type: Object, required: true },
  roundsToWin: { type: Number, default: 3 },
});
const emit = defineEmits(['round-won', 'quit']);

const sound = useSound();

const games = [
  { component: TapRace, name: 'Tap Race', emoji: '👆', description: 'Tap as fast as you can!' },
  { component: QuickDraw, name: 'Quick Draw', emoji: '⚡', description: 'Tap when you see GO!' },
  { component: ColorMatch, name: 'Color Clash', emoji: '🎨', description: 'Tap your matching color!' },
  { component: HoldSteady, name: 'Hold Steady', emoji: '🤫', description: 'Hold without lifting!' },
  { component: ShakeOff, name: 'Shake Off', emoji: '📳', description: 'Shake the phone like crazy!' },
];

const phase = ref('countdown');
const currentGameIndex = ref(Math.floor(Math.random() * games.length));
const roundWinner = ref(null);
let usedGames = new Set();

const currentGame = computed(() => games[currentGameIndex.value]);

const pickNextGame = () => {
  if (usedGames.size >= games.length) usedGames.clear();
  let idx;
  do {
    idx = Math.floor(Math.random() * games.length);
  } while (usedGames.has(idx));
  usedGames.add(idx);
  currentGameIndex.value = idx;
};

const onCountdownDone = () => {
  phase.value = 'playing';
};

const onGameWon = (winner) => {
  if (phase.value !== 'playing') return;
  roundWinner.value = winner;
  phase.value = 'result';
  sound.win();
  emit('round-won', winner);
};

const nextRound = () => {
  pickNextGame();
  roundWinner.value = null;
  phase.value = 'countdown';
};

onUnmounted(() => {
  usedGames.clear();
});
</script>

<template>
  <div class="game-manager">
    <div class="score-bar">
      <div class="score p1-score">
        <span class="score-label">P1</span>
        <span class="score-dots">
          <span
            v-for="i in roundsToWin"
            :key="i"
            class="dot"
            :class="{ filled: i <= scores.p1 }"
          />
        </span>
      </div>
      <button class="quit-btn" @click="emit('quit')">✕</button>
      <div class="score p2-score">
        <span class="score-dots">
          <span
            v-for="i in roundsToWin"
            :key="i"
            class="dot"
            :class="{ filled: i <= scores.p2 }"
          />
        </span>
        <span class="score-label">P2</span>
      </div>
    </div>

    <div class="game-area">
      <CountdownOverlay
        v-if="phase === 'countdown'"
        :game-name="currentGame.name"
        :game-emoji="currentGame.emoji"
        :game-description="currentGame.description"
        @done="onCountdownDone"
      />

      <component
        v-else-if="phase === 'playing'"
        :is="currentGame.component"
        @win="onGameWon"
      />

      <RoundResult
        v-else-if="phase === 'result'"
        :winner="roundWinner"
        :scores="scores"
        :rounds-to-win="roundsToWin"
        @next="nextRound"
      />
    </div>
  </div>
</template>

<style scoped>
.game-manager {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.score-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.8rem;
  background: var(--bg-medium);
  z-index: 10;
}

.score {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.score-label {
  font-weight: 700;
  font-size: 0.85rem;
}

.p1-score .score-label { color: var(--p1-color); }
.p2-score .score-label { color: var(--p2-color); }

.score-dots {
  display: flex;
  gap: 0.25rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #555;
  transition: all 0.3s;
}

.p1-score .dot.filled {
  background: var(--p1-color);
  border-color: var(--p1-color);
}

.p2-score .dot.filled {
  background: var(--p2-color);
  border-color: var(--p2-color);
}

.quit-btn {
  background: rgba(255,255,255,0.1);
  color: #888;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
