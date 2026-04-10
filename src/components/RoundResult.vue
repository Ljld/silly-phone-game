<script setup>
import { computed } from 'vue';
import { useVibrate } from '../composables/useVibrate.js';

const props = defineProps({
  winner: { type: String, required: true },
  scores: { type: Object, required: true },
  roundsToWin: { type: Number, required: true },
});
const emit = defineEmits(['next']);
const { winBuzz } = useVibrate();

winBuzz();

const isGameOver = computed(
  () => props.scores.p1 >= props.roundsToWin || props.scores.p2 >= props.roundsToWin
);

const winnerLabel = computed(() => props.winner === 'p1' ? 'Player 1' : 'Player 2');
const winnerColor = computed(() => props.winner === 'p1' ? 'var(--p1-color)' : 'var(--p2-color)');

const sillyMessages = [
  'Absolutely DESTROYED! 💀',
  'That was DISGUSTING! 🤮',
  'Too easy! 😎',
  'Skill diff! 🎯',
  'Get rekt! 🔥',
  'Built different! 💪',
  'Is that even legal?! 🚨',
  'SHEEEESH! 🥶',
];

const message = sillyMessages[Math.floor(Math.random() * sillyMessages.length)];
</script>

<template>
  <div class="result" :style="{ '--winner-color': winnerColor }">
    <div class="result-content">
      <div class="trophy">🏆</div>
      <h2 class="winner-name" :style="{ color: winnerColor }">{{ winnerLabel }}</h2>
      <p class="wins-text">wins this round!</p>
      <p class="silly-msg">{{ message }}</p>

      <button
        v-if="!isGameOver"
        class="next-btn"
        @click="emit('next')"
      >
        Next Round →
      </button>
    </div>
  </div>
</template>

<style scoped>
.result {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-dark);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.result-content {
  text-align: center;
}

.trophy {
  font-size: 4rem;
  animation: bounce 0.5s ease infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0) rotate(-5deg); }
  to { transform: translateY(-15px) rotate(5deg); }
}

.winner-name {
  font-size: 2.2rem;
  margin-top: 0.5rem;
}

.wins-text {
  font-size: 1.1rem;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.silly-msg {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}

.next-btn {
  background: var(--winner-color);
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0.8rem 2.5rem;
  border-radius: 50px;
  transition: transform 0.1s;
}

.next-btn:active {
  transform: scale(0.95);
}
</style>
