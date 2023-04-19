<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Game Over!</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>You won the game with a score of {{ score }}%</div>
        <div>{{ scoreBasedCongrats }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Play Again"
          color="primary"
          @click="store.playAgain"
          v-close-popup
        />
        <q-btn
          flat
          label="Open Settings"
          color="warning"
          @click="$emit('openSettings')"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { useVModel } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue', 'openSettings']);

const dialog = useVModel(props, 'modelValue', emit);

const store = useGameStore();
const { score } = storeToRefs(store);

const scoreBasedCongrats = computed(() => {
  let response = '';
  if (score.value === 100 && store.cardsCount <= 4) {
    response = 'Good job... I guess.  Maybe try again with a few more cards?';
  } else if (score.value === 100) {
    response = "Unbelievable! You're an absolute genius!";
  } else if (score.value >= 90) {
    response = 'You did outstanding!';
  } else if (score.value >= 80) {
    response = 'Great job!';
  } else if (score.value >= 70) {
    response = 'Nice!';
  } else if (score.value >= 60) {
    response = 'Keep practicing!';
  } else if (score.value >= 50) {
    response = 'Not great... not bad';
  } else if (score.value >= 40) {
    response = 'That was a rough one';
  } else if (score.value >= 30) {
    response = "I've seen better";
  } else if (score.value >= 20) {
    response = 'Yikes';
  } else if (score.value >= 10) {
    response = "At least it's over now";
  } else if (score.value >= 0) {
    response = 'I hope that was done blindfolded';
  } else {
    response = "That's... actually impressive.  Sad, but impressive";
  }
  return response;
});
</script>

<style lang="scss" scoped></style>
