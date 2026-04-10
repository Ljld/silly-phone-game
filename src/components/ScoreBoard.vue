<script setup>
import { computed } from 'vue';
import { useVibrate } from '../composables/useVibrate.js';
import { useSound } from '../composables/useSound.js';

const props = defineProps({
  scores: { type: Object, required: true },
  winner: { type: String, required: true },
});
const emit = defineEmits(['play-again', 'home']);
const { winBuzz } = useVibrate();
const sound = useSound();

winBuzz();
sound.win();

const winnerLabel = computed(() => props.winner === 'p1' ? 'Player 1' : 'Player 2');
const loserLabel = computed(() => props.winner === 'p1' ? 'Player 2' : 'Player 1');
const winnerColor = computed(() => props.winner === 'p1' ? 'var(--p1-color)' : 'var(--p2-color)');

const finalMessages = [
  'has achieved ULTIMATE SILLY SUPREMACY! 👑',
  'is the UNDISPUTED PHONE CHAMPION! 📱',
  'has HUMILIATED their opponent! 💀',
  'reigns supreme in silliness! 🤡',
  'is simply BUILT DIFFERENT! 🏗️',
];

const loserMessages = [
  'Maybe try using your toes next time? 🦶',
  'Have you considered a career change? 📋',
  'There\'s always next time... maybe 🤷',
  'That was... something 😬',
];

const finalMsg = finalMessages[Math.floor(Math.random() * finalMessages.length)];
const loserMsg = loserMessages[Math.floor(Math.random() * loserMessages.length)];
</script>

<template>
  <div class="scoreboard">
    <div class="confetti-container">
      <span v-for="i in 20" :key="i" class="confetti" :style="{
        '--delay': `${Math.random() * 2}s`,
        '--x': `${Math.random() * 100}vw`,
        '--color': ['#ff6b6b','#4ecdc4','#f9ca24','#6c5ce7','#fd79a8','#00b894'][i % 6],
      }" />
    </div>

    <div class="board-content">
      <div class="crown">👑</div>
      <h1 class="winner" :style="{ color: winnerColor }">{{ winnerLabel }}</h1>
      <p class="final-msg">{{ finalMsg }}</p>

      <div class="final-score">
        <div class="fs-player" :class="{ 'is-winner': winner === 'p1' }">
          <span class="fs-label" style="color: var(--p1-color)">P1</span>
          <span class="fs-num">{{ scores.p1 }}</span>
        </div>
        <span class="fs-vs">vs</span>
        <div class="fs-player" :class="{ 'is-winner': winner === 'p2' }">
          <span class="fs-label" style="color: var(--p2-color)">P2</span>
          <span class="fs-num">{{ scores.p2 }}</span>
        </div>
      </div>

      <p class="loser-msg">{{ loserLabel }}: {{ loserMsg }}</p>

      <div class="actions">
        <button class="action-btn rematch" @click="emit('play-again')">
          🔄 Rematch!
        </button>
        <button class="action-btn home-btn" @click="emit('home')">
          🏠 Home
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scoreboard {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-medium));
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  top: -10px;
  left: var(--x);
  width: 10px;
  height: 10px;
  background: var(--color);
  animation: confetti-fall 3s ease-in var(--delay) infinite;
  border-radius: 2px;
}

@keyframes confetti-fall {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.board-content {
  text-align: center;
  z-index: 1;
}

.crown {
  font-size: 4rem;
  animation: crownBounce 1s ease infinite;
}

@keyframes crownBounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.winner {
  font-size: 2.5rem;
  margin: 0.3rem 0;
}

.final-msg {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 1.5rem;
}

.final-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.fs-player {
  text-align: center;
  opacity: 0.6;
  transition: all 0.3s;
}

.fs-player.is-winner {
  opacity: 1;
  transform: scale(1.1);
}

.fs-label {
  display: block;
  font-weight: 700;
  font-size: 1rem;
}

.fs-num {
  font-size: 3rem;
  font-weight: 700;
}

.fs-vs {
  color: #666;
  font-size: 1.2rem;
}

.loser-msg {
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.7rem 1.8rem;
  border-radius: 50px;
  color: white;
  transition: transform 0.1s;
}

.action-btn:active {
  transform: scale(0.95);
}

.rematch {
  background: linear-gradient(135deg, var(--p1-color), var(--p2-color));
}

.home-btn {
  background: rgba(255,255,255,0.1);
}
</style>
