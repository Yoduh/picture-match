<template>
  <q-toolbar>
    <q-btn
      flat
      dense
      round
      icon="menu"
      aria-label="Menu"
      @click="$emit('toggleDrawer')"
    />

    <q-toolbar-title> Picture Matching Game </q-toolbar-title>
    <div class="text-h4 col-grow">
      Guesses: {{ guesses.incorrect + guesses.correct }}
    </div>
    <div class="text-h4 col-grow">Score: {{ store.score }}%</div>
    <q-btn color="positive" class="q-mr-md" size="lg" @click="newGame"
      >New Game</q-btn
    >
    <q-select
      v-model="selectedDeck"
      :options="categories"
      outlined
      class="q-my-sm"
      bg-color="blue-3"
      @update:model-value="selected"
      @popup-hide="checkCustomClick"
    >
    </q-select>
  </q-toolbar>
  <CustomImageDialog
    v-model="dialog"
    @hide="selectPrevious"
    @custom-loaded="prevSelectedDeck = 'Custom'"
  />
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import CustomImageDialog from './CustomImageDialog.vue'
import { useFetchImages } from '@/composable/fetchImages'

/* user should be able to choose "Custom" option to open dialog even if "Custom" is already selected
 Quasar has no event to detect option clicks, only v-model change, this is my work-around
*/
const checkCustomClick = (e: Event) => {
  // select was closed by clicking outside it's focus: ignore
  if (e?.type === 'MouseEvent') return
  else if (selectedDeck.value === 'Custom') {
    dialog.value = true
  }
}

defineEmits(['toggleDrawer'])

const categories = ref(['Animals', 'Nature', 'Space', 'Pokémon', 'Custom'])

const store = useGameStore()
const { guesses, selectedDeck } = storeToRefs(store)

const $q = useQuasar()
async function newGame() {
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

const prevSelectedDeck = ref('Animals')
const selectPrevious = (e: Event) => {
  if (e && e.type === 'click') {
    selectedDeck.value = prevSelectedDeck.value
  }
}

const dialog = ref(false)

const selected = (selection: string) => {
  if (selection === 'Custom') {
    dialog.value = true
  } else {
    store.playAgain()
  }
}

watch(selectedDeck, (newVal, oldVal) => {
  prevSelectedDeck.value = oldVal
})
</script>
