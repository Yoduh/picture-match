<template>
  <div class="image-wrapper q-ma-sm row justify-center fit align-center">
    <Transition :name="flipType" mode="out-in">
      <q-img
        v-if="!card.isGuessing && !card.isMatched"
        :src="cardback"
        class="image"
        fit="contain"
        loading="eager"
        :class="{ newGameFlip: newGameFlag }"
        @animationend="animationEnded"
        @click="flipImage" />
      <q-img
        v-else
        :src="card.url"
        :fit="imageFit"
        class="image"
        loading="eager"
        @click="flipImage"
    /></Transition>
    <Checkmark :show-icon="card.isMatched" class="checkmark" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, Ref, watch } from 'vue'
import cardback from '@/assets/cardback.avif'
import Checkmark from '@/components/Checkmark.vue'
import { QImgProps } from 'quasar'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

const store = useGameStore()
const { newGameFlag } = storeToRefs(store)

const props = defineProps({
  card: { type: Object as PropType<Card>, required: true }
})

const emit = defineEmits(['flipped'])

const flipType = ref('flip')
function flipImage() {
  if (!props.card.isMatched) {
    emit('flipped')
  }
}

const imageFit: Ref<QImgProps['fit']> = ref('contain')

watch(newGameFlag, newVal => {
  if (newVal) {
    flipType.value = ''
    if (store.selectedDeck === 'Space') imageFit.value = 'cover'
    else imageFit.value = 'contain'
  } else {
    flipType.value = 'flip'
  }
})

function animationEnded() {
  if (newGameFlag.value) {
    newGameFlag.value = false
  }
}
</script>

<style lang="scss" scoped>
.image {
  cursor: pointer;
  height: 100%;
  height: 267px;
}

.image-wrapper {
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
  height: auto !important;
  width: auto !important;
  // height: 290px !important;
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
.newGameFlip {
  animation-name: fakeFlip;
  animation-duration: 1s;
}

@keyframes fakeFlip {
  0% {
    transform: scaleX(1);
    animation-timing-function: ease-out;
  }
  50% {
    transform: scaleX(-1);
    animation-timing-function: ease-out;
  }
  100% {
    transform: scaleX(1);
    animation-timing-function: ease-in;
  }
}

.checkmark {
  position: absolute;
  left: 0;
  text-shadow: 1px 1px 1px #5a5a5a;
}
</style>
