<template>
  <q-page class="page flex justify-center">
    <div class="row full-height justify-evenly items-center">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="q-mx-sm full-height"
      >
        <Card :card="card" @flipped="cardFlipped(card)" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue';
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';

const store = useGameStore();

const { cards } = storeToRefs(store);

let reverseTimer: number | undefined = undefined;

const cardFlipped = (card: Card) => {
  if (reverseTimer !== undefined) {
    // flip incorrect guess immediately if user does not wait for 2 second timer
    window.clearTimeout(reverseTimer);
    reverseTimer = undefined;
    store.reverseIncorrect();
  }
  card.isGuessing = true;
  if (store.guessComplete) {
    if (store.correctGuess) {
      store.keepCorrect();
    } else {
      // flip incorrect cards after 2 seconds
      reverseTimer = window.setTimeout(() => {
        store.reverseIncorrect();
        reverseTimer = undefined;
      }, 2000);
    }
  }
};
</script>

<style scoped>
.row {
  width: 80vw;
}
</style>
