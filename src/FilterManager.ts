import Card from './Card'
import CardIndex from './CardIndex'

type Filter = (card: Card) => boolean

function cardHasColorIdentity (card: Card, color: string): boolean {
  if (card.colorIdentity) {
    const res = card.colorIdentity.find(el => color === el)
    return res !== undefined
  } else {
    return true
  }
}

class FilterManager {
  colorFilters: Map<string, Filter> = new Map()
  textFilter?: Filter
  collection: Map<string, Card> = new Map()
  cardIndex?: CardIndex

  addColor (color:string) {
    const filter: Filter =
      (card: Card) =>
        (card.manaCost ? card.manaCost.search(`{${color}}`) >= 0 : false) ||
        cardHasColorIdentity(card, color)

    this.colorFilters.set(color, filter)
  }

  deleteColor (color: string) {
    this.colorFilters.delete(color)
  }

  setText (text: string) {
    if (!this.cardIndex || text.length === 0) {
      this.textFilter = undefined
      return
    }

    const cardsWithText: Map<string, Card> | undefined =
      this.cardIndex.getCards(text)

    if (cardsWithText) {
      this.textFilter = (card: Card) => cardsWithText.has(card.id)
    }
  }

  setCollection (cards: Map<string, Card>) {
    this.collection = cards
    this.cardIndex = new CardIndex(Array.from(cards.values()))
  }

  allowedByColorFilters (card: Card): boolean {
    if (this.colorFilters.size === 0) {
      return true
    }

    let allowed = false

    const filterArr = Array.from(this.colorFilters.values())
    for (const filter of filterArr) {
      if (filter(card)) {
        allowed = true
        break
      }
    }

    return allowed
  }

  allowedByTextFilter (card: Card): boolean {
    return this.textFilter === undefined || this.textFilter(card)
  }

  getCardIndex (): string[] {
    if (!this.cardIndex) {
      return []
    } else {
      return this.cardIndex.getIndex()
    }
  }

  getFilteredCollection (): Map<string, Card> {
    const filteredCollection = new Map(this.collection)

    if (this.colorFilters.size === 0 && this.textFilter === undefined) {
      return filteredCollection
    }

    filteredCollection.forEach((card: Card) => {
      const allowed = this.allowedByColorFilters(card) &&
        this.allowedByTextFilter(card)

      if (!allowed) {
        filteredCollection.delete(card.id)
      }
    })
    return filteredCollection
  }
}

export default FilterManager
