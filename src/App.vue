<script setup>
import { ref } from 'vue';
import HomeScreen from './components/HomeScreen.vue';
import GameManager from './components/GameManager.vue';
import ScoreBoard from './components/ScoreBoard.vue';

const screen = ref('home');
const roundsToWin = ref(3);
const scores = ref({ p1: 0, p2: 0 });
const lastWinner = ref(null);

const startGame = () => {
  scores.value = { p1: 0, p2: 0 };
  lastWinner.value = null;
  screen.value = 'game';
};

const onRoundWon = (winner) => {
  scores.value[winner]++;
  lastWinner.value = winner;
  if (scores.value[winner] >= roundsToWin.value) {
    screen.value = 'scoreboard';
  }
};

const goHome = () => {
  screen.value = 'home';
};
</script>

<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      <HomeScreen
        v-if="screen === 'home'"
        @start="startGame"
      />
      <GameManager
        v-else-if="screen === 'game'"
        :scores="scores"
        :rounds-to-win="roundsToWin"
        @round-won="onRoundWon"
        @quit="goHome"
      />
      <ScoreBoard
        v-else-if="screen === 'scoreboard'"
        :scores="scores"
        :winner="lastWinner"
        @play-again="startGame"
        @home="goHome"
      />
    </Transition>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
