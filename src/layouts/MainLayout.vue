<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
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
          v-model="selection"
          :options="categories"
          outlined
          class="q-my-sm"
          bg-color="blue-3"
        ></q-select>
      </q-toolbar>
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
import { ref } from 'vue';
import { useGameStore } from '@/stores/game';
import useQuasar from 'quasar/src/composables/use-quasar';
import { storeToRefs } from 'pinia';
import { onClickOutside } from '@vueuse/core';

const store = useGameStore();

const { cardsCount, guesses } = storeToRefs(store);

const categories = ref(['Animals', 'Nature', 'Space']);
const selection = ref('Animals');

const leftDrawerOpen = ref(false);
const drawer = ref(null);
onClickOutside(drawer, () => (leftDrawerOpen.value = false));

const $q = useQuasar();
function newGame() {
  store.playAgain(selection.value);
  $q.notify({
    message: 'New game started!',
    position: 'center',
    color: 'positive',
    timeout: 500
  });
}

function restart() {
  leftDrawerOpen.value = false;
  store.resetGame();
}
</script>
