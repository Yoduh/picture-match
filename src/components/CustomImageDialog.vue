<template>
  <q-dialog v-model="dialog" ref="dialogRef">
    <q-card>
      <q-card-section>
        <div class="text-h6">Custom Images</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          The game will attempt to use images described by a given search term
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="customDeckName"
          placeholder="Image search"
          :error-message="`Not enough images found (${totalResults}) try again`"
          ref="input"
          @update:model-value="isValid = true"
          :error="!isValid"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="primary"
          @click="$emit('cancel')"
          v-close-popup
        />
        <q-btn flat label="Ok" color="warning" @click="search" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useVModel } from '@vueuse/core'
import { useFetchImages } from '@/composable/fetchImages'
import type { QInput } from 'quasar'
import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits([
  'update:modelValue',
  'cancel',
  'close',
  'customLoaded'
])
const dialog = useVModel(props, 'modelValue', emit)

const dialogRef = ref(null)

const store = useGameStore()
const { customDeckName } = storeToRefs(store)
const input: Ref<QInput | null> = ref(null)

const { fetchImages, photos, totalResults, isValid } = useFetchImages()
async function search() {
  await fetchImages()
  if (isValid.value) {
    dialog.value = false
    emit('customLoaded')
    store.playAgain(photos.value)
  }
}
</script>
