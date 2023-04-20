import { defineStore } from 'pinia'
import animals from '@/assets/animals'
import { api } from '@/boot/axios'

export const useGameStore = defineStore('game', {
  state: () => ({
    cards: [] as Card[],
    newGameFlag: false,
    cardsCount: 12,
    guesses: {
      total: 0,
      incorrect: 0,
      correct: 0
    },
    selectedDeck: 'Animals',
    customDeckName: ''
  }),
  getters: {
    guessedCards: state => {
      return state.cards.filter(c => c.isGuessing)
    },
    guessComplete(): boolean {
      return this.guessedCards.length >= 2
    },
    correctGuess(): boolean {
      return (
        this.guessComplete &&
        this.guessedCards[0].id === this.guessedCards[1].matchId
      )
    },
    score(): number {
      const validTotal = this.guesses.correct + this.guesses.incorrect
      if (validTotal === 0) return 100
      return Number(
        (
          (this.guesses.correct /
            (this.guesses.correct + this.guesses.incorrect)) *
          100
        ).toFixed(2)
      )
    },
    gameWon(): boolean {
      return this.cards.filter(c => c.isMatched).length === this.cards.length
    }
  },
  actions: {
    loadCards(cards: string[]) {
      const doubles = []
      for (let i = 0; i < this.cardsCount; i += 2) {
        doubles.push({
          id: i,
          url: cards[i / 2],
          isGuessing: false,
          isMatched: false,
          matchId: i + 1,
          clicks: 0
        })
        doubles.push({
          id: i + 1,
          url: cards[i / 2],
          isGuessing: false,
          isMatched: false,
          matchId: i,
          clicks: 0
        })
      }
      this.cards = shuffle(doubles)
    },
    keepCorrect() {
      const guessedCards = this.guessedCards
      guessedCards.forEach(c => {
        c.isGuessing = false
        c.isMatched = true
      })
    },
    flipIncorrect() {
      const guessedCards = this.guessedCards
      guessedCards.forEach(c => {
        c.isGuessing = false
      })
    },
    resetGame() {
      this.cards.forEach(c => {
        c.isGuessing = false
        c.isMatched = false
        c.clicks = 0
      })
      this.guesses = {
        total: 0,
        incorrect: 0,
        correct: 0
      }
    },
    recordGuess() {
      this.guesses.total++
      let newCards = true
      const guessedCards = this.cards.filter(c => c.isGuessing)
      guessedCards.forEach(c => {
        c.clicks++
        if (c.clicks > 1) newCards = false
      })

      if (this.correctGuess) {
        this.guesses.correct++
        this.keepCorrect()
        return true
      } else if (!newCards) {
        this.guesses.incorrect++
        return false
      }
    },
    playAgain(customCards?: string[]) {
      this.newGameFlag = true
      this.guesses = {
        total: 0,
        incorrect: 0,
        correct: 0
      }
      switch (this.selectedDeck) {
        case 'Animals': {
          this.loadCards(animals)
          return
        }
        case 'Space': {
          api
            .get(
              `https://api.nasa.gov/planetary/apod?api_key=${
                import.meta.env.VITE_NASA_KEY
              }&count=${this.cardsCount}`
            )
            .then((res: any) => {
              const space: string[] = res.data.map(
                (d: { url: string }) => d.url
              )
              this.loadCards(space)
            })
          return
        }
        case 'Pokémon': {
          const pokemonIds = randomIds(this.cardsCount, 151)
          const calls = pokemonIds.map(id =>
            api.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
          )
          Promise.all(calls).then(results => {
            const pokemon: string[] = results.map(
              (res: any) => res.data.sprites.other.dream_world.front_default
            )
            this.loadCards(pokemon)
          })
          return
        }
        // case 'Random': {
        //   const url =
        //     'https://www.mediawiki.org/w/api.php?action=query&format=json&prop=imageinfo&meta=&generator=random&formatversion=2&grnnamespace=0&iiprop=url&iiurlwidth=200&origin=*'
        //   api.get(url).then((res: any) => console.log(res.data))
        // }
        case 'Custom': {
          if (customCards) {
            this.loadCards(customCards)
          }
          return
        }
        default: {
          this.loadCards(animals)
          return
        }
      }
    }
  }
})

function shuffle(array: Card[]) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }

  return array
}

function randomIds(idCount: number, maxId: number) {
  const array = []
  while (array.length < idCount) {
    const r = Math.floor(Math.random() * maxId) + 1
    if (array.indexOf(r) === -1) array.push(r)
  }
  return array
}
