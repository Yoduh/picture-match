import { defineStore } from 'pinia';
import animals from '@/assets/animals';

export const useGameStore = defineStore('game', {
  state: () => ({
    cards: [] as Card[],
    newGameFlag: false,
    cardsCount: 12,
  }),
  getters: {
    guessedCards: (state) => {
      return state.cards.filter((c) => c.isGuessing);
    },
    guessComplete(): boolean {
      return this.guessedCards.length >= 2;
    },
    correctGuess(): boolean {
      return (
        this.guessComplete &&
        this.guessedCards[0].id === this.guessedCards[1].matchId
      );
    },
    score(): number {
      return this.cards.filter((c) => c.isMatched).length / 2;
    },
  },
  actions: {
    loadCards(cards: string[]) {
      const doubles = [];
      for (let i = 0; i < this.cardsCount; i += 2) {
        doubles.push({
          id: i,
          url: cards[i / 2],
          isGuessing: false,
          isMatched: false,
          matchId: i + 1,
        });
        doubles.push({
          id: i + 1,
          url: cards[i / 2],
          isGuessing: false,
          isMatched: false,
          matchId: i,
        });
      }
      this.cards = shuffle(doubles);
    },
    keepCorrect() {
      const guessedCards = this.guessedCards;
      guessedCards.forEach((c) => {
        c.isGuessing = false;
        c.isMatched = true;
      });
    },
    reverseIncorrect() {
      const guessedCards = this.guessedCards;
      guessedCards.forEach((c) => {
        c.isGuessing = false;
      });
    },
    resetGame() {
      this.cards.forEach((c) => {
        c.isGuessing = false;
        c.isMatched = false;
      });
    },
    playAgain(deckSelection: string) {
      this.newGameFlag = true;
      switch (deckSelection) {
        case 'animals': {
          this.loadCards(animals);
          return;
        }
        default: {
          this.loadCards(animals);
          return;
        }
      }
    },
  },
});

function shuffle(array: Card[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
