<script setup>
import { ref } from 'vue';

const emit = defineEmits(['start', 'navigate-city']);
const titleEmoji = ref('🤪');
const emojis = ['🤪', '🤡', '👻', '🎉', '🔥', '💥', '🍕', '🦄'];
let emojiIndex = 0;

setInterval(() => {
  emojiIndex = (emojiIndex + 1) % emojis.length;
  titleEmoji.value = emojis[emojiIndex];
}, 400);
</script>

<template>
  <div class="home">
    <div class="home-content">
      <div class="title-emoji">{{ titleEmoji }}</div>
      <h1 class="title">
        <span class="title-silly">Silly</span>
        <span class="title-phone">Phone</span>
        <span class="title-battle">Battle!</span>
      </h1>
      <p class="subtitle">2 players, 1 phone, 0 dignity</p>

      <div class="instructions">
        <div class="instruction">
          <span class="instruction-icon">📱</span>
          <span>Hold the phone between two players</span>
        </div>
        <div class="instruction">
          <span class="instruction-icon">👆</span>
          <span>Each player taps their side of the screen</span>
        </div>
        <div class="instruction">
          <span class="instruction-icon">🏆</span>
          <span>First to win 3 rounds takes the crown!</span>
        </div>
      </div>

      <button class="play-btn" @click="emit('start')">
        <span class="play-text">PLAY!</span>
        <span class="play-emoji">🎮</span>
      </button>

      <button class="city-btn" @click="emit('navigate-city')">
        🏙️ Visit the City
      </button>

      <p class="tip">Tip: Turn your phone sideways for maximum silliness!</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-medium));
  padding: 1.5rem;
}

.home-content {
  text-align: center;
  max-width: 400px;
}

.title-emoji {
  font-size: 4rem;
  animation: bounce 0.5s ease infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

.title {
  font-size: 2.5rem;
  line-height: 1.1;
  margin: 0.5rem 0;
}

.title-silly { color: var(--gold); display: block; }
.title-phone { color: var(--p1-color); display: block; }
.title-battle { color: var(--p2-color); display: block; }

.subtitle {
  font-size: 1rem;
  color: #aaa;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.instruction {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: rgba(255,255,255,0.05);
  padding: 0.6rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  text-align: left;
}

.instruction-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.play-btn {
  background: linear-gradient(135deg, var(--p1-color), var(--p2-color));
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  padding: 1rem 3rem;
  border-radius: 50px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 30px rgba(78, 205, 196, 0.3);
  transition: transform 0.1s;
}

.play-btn:active {
  transform: scale(0.95);
}

.play-emoji {
  font-size: 1.5rem;
}

.city-btn {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-light);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  transition: background 0.2s, transform 0.1s;
}

.city-btn:active {
  transform: scale(0.95);
}

.city-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.tip {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #666;
}
</style>
