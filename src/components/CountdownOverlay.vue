<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useSound } from '../composables/useSound.js';

const props = defineProps({
  gameName: { type: String, required: true },
  gameEmoji: { type: String, required: true },
  gameDescription: { type: String, required: true },
});
const emit = defineEmits(['done']);
const sound = useSound();

const count = ref(null);
const showInfo = ref(true);
let timer = null;

onMounted(() => {
  setTimeout(() => {
    showInfo.value = false;
    count.value = 3;
    sound.countdown();

    timer = setInterval(() => {
      count.value--;
      if (count.value > 0) {
        sound.countdown();
      } else if (count.value === 0) {
        sound.go();
      } else {
        clearInterval(timer);
        emit('done');
      }
    }, 800);
  }, 1500);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="countdown-overlay">
    <Transition name="fade" mode="out-in">
      <div v-if="showInfo" key="info" class="game-info">
        <div class="game-emoji">{{ gameEmoji }}</div>
        <h2 class="game-name">{{ gameName }}</h2>
        <p class="game-desc">{{ gameDescription }}</p>
      </div>
      <div v-else key="count" class="count-display">
        <span v-if="count > 0" class="count-number" :key="count">{{ count }}</span>
        <span v-else-if="count === 0" class="count-go">GO!</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.countdown-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-dark);
  z-index: 5;
}

.game-info {
  text-align: center;
  animation: popIn 0.3s ease;
}

.game-emoji {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.game-name {
  font-size: 2rem;
  margin-bottom: 0.3rem;
}

.game-desc {
  color: #aaa;
  font-size: 1rem;
}

.count-display {
  text-align: center;
}

.count-number {
  font-size: 6rem;
  font-weight: 700;
  color: var(--gold);
  animation: popIn 0.3s ease;
  display: block;
}

.count-go {
  font-size: 5rem;
  font-weight: 700;
  color: #2ecc71;
  animation: popIn 0.3s ease;
  display: block;
}

@keyframes popIn {
  0% { transform: scale(0.3); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
