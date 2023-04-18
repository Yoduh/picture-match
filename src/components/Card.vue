<template>
  <div class="image-wrapper q-ma-md row justify-center full-width full-height">
    <q-img
      v-if="!card.isGuessing && !card.isMatched"
      :src="cardback"
      class="image"
      fit="contain"
      @click="flipImage"
    />
    <q-img v-else :src="card.url" class="image" @click="flipImage" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import cardback from '@/assets/cardback.avif';

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
  height: 20rem;
  width: 10rem;
}

.image-wrapper {
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
  width: 300px;
  height: 400px;
}
// .image-wrapper .image {
//   position: absolute;
//   backface-visibility: hidden;
//   transition: 1s;
// }
// .image-wrapper .image:nth-child(2) {
//   transform: rotateY(180deg);
// }
// .image-wrapper:hover .image:nth-child(2) {
//   transform: rotateY(0deg);
// }
// .image-wrapper:hover .image:nth-child(1) {
//   transform: rotateY(-180deg);
// }
</style>
