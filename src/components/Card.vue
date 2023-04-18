<template>
  <div class="image-wrapper q-ma-sm row justify-center fit align-center">
    <Transition name="flip" mode="out-in">
      <q-img
        v-if="!card.isGuessing && !card.isMatched"
        :src="cardback"
        class="image"
        fit="contain"
        loading="eager"
        @click="flipImage" />
      <q-img
        v-else
        :src="card.url"
        fit="contain"
        class="image"
        loading="eager"
        @click="flipImage"
    /></Transition>
    <Checkmark :show-icon="card.isMatched" class="checkmark" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import cardback from '@/assets/cardback.avif';
import Checkmark from '@/components/Checkmark.vue';

const props = defineProps({
  card: { type: Object as PropType<Card>, required: true },
});

const emit = defineEmits(['flipped']);

function flipImage() {
  if (!props.card.isMatched) {
    emit('flipped');
  }
}
</script>

<style lang="scss" scoped>
.image {
  cursor: pointer;
  height: 100%;
  width: 10rem;
}

.image-wrapper {
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
  width: 300px;
  height: 400px;
}

.flip-enter-active {
  transition: all 0.2s ease-out;
}

.flip-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.flip-enter-from {
  transform: rotateY(90deg);
}
.flip-leave-to {
  transform: rotateY(-90deg);
}

.checkmark {
  position: absolute;
  left: 0;
  text-shadow: 1px 1px 1px #5a5a5a;
}
</style>
