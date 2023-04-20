<template>
  <q-page class="page flex justify-center">
    <div class="row full-height justify-evenly items-center q-mb-lg">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="col-6 col-md-4 col-lg-3 co full-height"
      >
        <Card :card="card" @flipped="cardFlipped(card)" />
      </div>
    </div>
    <WinDialog v-model="dialog" @openSettings="$emit('openSettings')" />
  </q-page>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import WinDialog from '@/components/WinDialog.vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

defineEmits(['openSettings'])

const store = useGameStore()

const { cards } = storeToRefs(store)

const dialog = ref(false)

let reverseTimer: number | undefined = undefined

const cardFlipped = (card: Card) => {
  if (reverseTimer !== undefined) {
    // flip incorrect guess immediately if user does not wait for 2 second timer
    window.clearTimeout(reverseTimer)
    reverseTimer = undefined
    store.flipIncorrect()
  }
  card.isGuessing = true
  if (store.guessComplete) {
    const correct = store.recordGuess()
    if (!correct) {
      // flip incorrect cards after 2 seconds
      reverseTimer = window.setTimeout(() => {
        store.flipIncorrect()
        reverseTimer = undefined
      }, 2000)
    } else if (store.gameWon) {
      dialog.value = true
    }
  }
}
</script>

<style scoped>
.row {
  width: 80vw;
}
</style>
