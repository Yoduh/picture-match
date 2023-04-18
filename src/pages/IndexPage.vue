<template>
  <q-page class="row items-start justify-evenly">
    <div v-for="(card, index) in cards" :key="index">
      <Card :card="card" @flipped="cardFlipped(card)" />
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
    window.clearTimeout(reverseTimer);
    reverseTimer = undefined;
    store.reverseIncorrect();
  }
  card.isGuessing = true;
  if (store.guessComplete) {
    if (store.correctGuess) {
      store.keepCorrect();
    } else {
      reverseTimer = window.setTimeout(() => {
        store.reverseIncorrect();
        reverseTimer = undefined;
      }, 2000);
    }
  }
};
</script>
