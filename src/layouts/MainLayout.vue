<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <Toolbar @toggleDrawer="leftDrawerOpen = !leftDrawerOpen" ref="toolbar" />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered overlay ref="drawer">
      <q-list>
        <q-item-label header> Settings </q-item-label>
        <q-item>
          <q-item-section>
            Number of Cards: {{ cardsCount }}
            <q-slider
              v-model="cardsCount"
              :min="2"
              :max="24"
              :step="2"
              snap
              label
              color="light-green"
            ></q-slider
          ></q-item-section>
        </q-item>
        <q-item>
          <q-btn color="positive full-width" @click="newGame">New Game</q-btn>
          <div class="text-caption q-ml-md">
            Start new game using current settings
          </div>
        </q-item>
        <q-item>
          <q-btn color="warning" @click="restart">Restart</q-btn>
          <div class="text-caption q-ml-md">
            Reset current game (will not shuffle)
          </div>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view @openSettings="leftDrawerOpen = true" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Toolbar from '@/components/Toolbar.vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { onClickOutside } from '@vueuse/core'
import { useFetchImages } from '@/composable/fetchImages'

const store = useGameStore()
const { cardsCount, selectedDeck } = storeToRefs(store)

const leftDrawerOpen = ref(false)
const drawer = ref(null)
const toolbar = ref(null)

onClickOutside(drawer, () => (leftDrawerOpen.value = false), {
  ignore: [toolbar]
})

const $q = useQuasar()

async function newGame() {
  leftDrawerOpen.value = false
  if (selectedDeck.value === 'Custom') {
    const { fetchImages, photos } = useFetchImages()
    await fetchImages()
    store.playAgain(photos.value)
  } else {
    store.playAgain()
  }
  $q.notify({
    message: 'New game started!',
    position: 'center',
    color: 'positive',
    timeout: 500
  })
}

function restart() {
  leftDrawerOpen.value = false
  store.resetGame()
}
</script>

<style scoped>
.q-btn {
  max-width: 110px;
}
</style>
