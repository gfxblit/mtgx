import Card from './Card'

function extractTokensFromName (card: Card): string[] {
  return card.name.split(/\s+/)
}

function extractTokensFromText (card: Card): string[] {
  return card.text.split(/\s+/)
}

function extractTokensFromType (card: Card): string[] {
  return card.type.split(/\s+/)
}

function extractTokens (card: Card) {
  return extractTokensFromName(card)
    .concat(extractTokensFromText(card))
    .concat(extractTokensFromType(card))
}

class CardIndex {
  readonly index: Map<string, Map<string, Card>> = new Map()

  constructor (cards: Card[]) {
    cards.forEach((card: Card) => {
      const tokens = extractTokens(card)

      tokens.forEach(token => {
        const lowerToken = token.toLowerCase()
        const valuesForToken: Map<string, Card> | undefined = this.index.get(lowerToken)
        if (valuesForToken) {
          valuesForToken.set(card.id, card)
        } else {
          this.index.set(lowerToken, new Map<string, Card>([[card.id, card]]))
        }
      })
    })
    console.log(this.index)
  }

  getCards (token: string): Map<string, Card> | undefined {
    return this.index.get(token.toLowerCase())
  }
}

export default CardIndex
