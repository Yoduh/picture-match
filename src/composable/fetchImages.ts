import { useGameStore } from '@/stores/game'
import { createClient } from 'pexels'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const store = useGameStore()
const { customDeckName } = storeToRefs(store)

const pexels = createClient(import.meta.env.VITE_PEXEL_KEY)
const totalResults = ref(0)
const photos = ref([] as string[])
const isValid = ref(true)

export const useFetchImages = () => {
  async function fetchImages() {
    const query = customDeckName.value
    return pexels.photos.search({ query, per_page: 1 }).then((res: any) => {
      totalResults.value = res.total_results
      if (totalResults.value < store.cardsCount) {
        isValid.value = false
      } else {
        const pageCount = Math.floor(totalResults.value / store.cardsCount)
        const randomPage = Math.floor(Math.random() * pageCount + 1)
        return pexels.photos
          .search({ query, per_page: store.cardsCount, page: randomPage })
          .then((res: any) => {
            photos.value = res.photos.map((p: any) => p.src.medium)
          })
      }
    })
  }

  return {
    fetchImages,
    photos,
    totalResults,
    isValid
  }
}
