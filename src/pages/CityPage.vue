<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useIsometricCity } from '../composables/useIsometricCity.js';

const container = ref(null);
const { init } = useIsometricCity();
let cleanup = null;

onMounted(() => {
  if (container.value) {
    cleanup = init(container.value);
  }
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>

<template>
  <div class="city-page">
    <div ref="container" class="city-canvas" />
    <div class="city-overlay">
      <h2 class="city-title">Isometric City</h2>
      <p class="city-hint">The camera slowly rotates around the city</p>
    </div>
  </div>
</template>

<style scoped>
.city-page {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.city-canvas {
  width: 100%;
  height: 100%;
}

.city-canvas :deep(canvas) {
  display: block;
}

.city-overlay {
  position: absolute;
  bottom: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  z-index: 10;
}

.city-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.2rem;
}

.city-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}
</style>
