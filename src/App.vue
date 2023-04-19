<template>
  <router-view />
</template>

<script setup lang="ts">
import animals from '@/assets/animals'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
store.loadCards(animals)
</script>
