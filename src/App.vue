<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="app-container">
    <nav v-if="route.name !== 'game'" class="app-nav">
      <router-link to="/" class="nav-link">🎮 Game</router-link>
      <router-link to="/city" class="nav-link">🏙️ City</router-link>
    </nav>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-nav {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-medium);
  z-index: 100;
  flex-shrink: 0;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, var(--p1-color), var(--p2-color));
}
</style>
