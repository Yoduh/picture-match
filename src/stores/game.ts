import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    cards: [] as Card[],
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
  },
  actions: {
    loadCards(cards: string[]) {
      const doubles = [];
      let matchAdjust = cards.length;
      const idAdjust = cards.length;
      for (let j = 0; j < 2; j++) {
        for (let i = 0; i < cards.length; i++) {
          const idNum = i + idAdjust * j;
          doubles.push({
            id: idNum,
            url: cards[i],
            isGuessing: false,
            isMatched: false,
            matchId: idNum + matchAdjust,
          });
        }
        matchAdjust *= -1;
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
