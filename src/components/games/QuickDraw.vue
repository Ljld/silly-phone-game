<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useVibrate } from '../../composables/useVibrate.js';
import { useSound } from '../../composables/useSound.js';

const emit = defineEmits(['win']);
const { shortBuzz, longBuzz } = useVibrate();
const sound = useSound();

const phase = ref('wait');
const message = ref('Wait for it...');
const tooEarly = ref(null);
let goTimeout = null;

const sillyWaitMessages = [
  'Wait for it... 🤫',
  'Don\'t you dare tap... 😤',
  'Patience, grasshopper... 🦗',
  'Hold your horses... 🐴',
  'Steady... steady... 🎯',
  'Almost... NOT YET! 😈',
];

const pickWaitMsg = () => {
  return sillyWaitMessages[Math.floor(Math.random() * sillyWaitMessages.length)];
};

onMounted(() => {
  message.value = pickWaitMsg();
  const delay = 2000 + Math.random() * 4000;
  goTimeout = setTimeout(() => {
    phase.value = 'go';
    message.value = 'TAP NOW! ⚡';
    sound.go();
    longBuzz();
  }, delay);
});

const handleTap = (player) => {
  if (phase.value === 'done') return;

  if (phase.value === 'wait') {
    tooEarly.value = player;
    phase.value = 'done';
    sound.fail();
    const winner = player === 'p1' ? 'p2' : 'p1';
    message.value = `${player === 'p1' ? 'P1' : 'P2'} jumped the gun! 🤦`;
    clearTimeout(goTimeout);
    setTimeout(() => emit('win', winner), 1500);
    return;
  }

  if (phase.value === 'go') {
    phase.value = 'done';
    shortBuzz();
    message.value = `${player === 'p1' ? 'P1' : 'P2'} is LIGHTNING FAST! ⚡`;
    setTimeout(() => emit('win', player), 1000);
  }
};

onUnmounted(() => {
  if (goTimeout) clearTimeout(goTimeout);
});
</script>

<template>
  <div class="quick-draw" :class="[`phase-${phase}`]">
    <div class="message-box">
      <p class="message">{{ message }}</p>
    </div>
    <div class="halves">
      <button
        class="half p1-half"
        @touchstart.prevent="handleTap('p1')"
        @mousedown.prevent="handleTap('p1')"
        :class="{ 'too-early': tooEarly === 'p1' }"
      >
        <span class="player-label">P1</span>
      </button>
      <button
        class="half p2-half"
        @touchstart.prevent="handleTap('p2')"
        @mousedown.prevent="handleTap('p2')"
        :class="{ 'too-early': tooEarly === 'p2' }"
      >
        <span class="player-label">P2</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.quick-draw {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: background 0.1s;
}

.message-box {
  padding: 0.8rem;
  text-align: center;
  z-index: 2;
}

.message {
  font-size: 1.3rem;
  font-weight: 600;
}

.phase-wait .message { color: #e67e22; }
.phase-go .message { color: #2ecc71; animation: pulse 0.3s ease infinite alternate; }
.phase-done .message { color: var(--gold); }

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
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
  transition: all 0.1s;
}

.phase-wait .p1-half { background: var(--p1-dark); }
.phase-wait .p2-half { background: var(--p2-dark); }
.phase-go .p1-half { background: var(--p1-color); }
.phase-go .p2-half { background: var(--p2-color); }
.phase-done .half { background: #555; }

.half.too-early {
  background: #c0392b !important;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.player-label {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
}
</style>
