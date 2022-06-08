import Card from './Card'

const SCRYFALL_BASE_API_URL = 'https://api.scryfall.com'
const SCRYFALL_CARDS_API_URL = SCRYFALL_BASE_API_URL + '/cards'
const SCRYFALL_CARDS_NAMED_API_URL = SCRYFALL_CARDS_API_URL + '/named?'

const cardsByName: Map<string, Card> = new Map()

function toUrlString (str: string): string {
  return str.replace(/ /gi, '+')
}

function getCardByName (name: string): Promise<Card> {
  const card = cardsByName.get(name)

  if (card) {
    return new Promise<Card>((resolve, reject) => {
      resolve(card)
    })
  }

  const newCardName = toUrlString(name)

  return fetch(SCRYFALL_CARDS_NAMED_API_URL + 'fuzzy=' + newCardName)
    .then((res) => res.json())
    .then((json) => {
      const card = Card.fromJson(json)
      cardsByName.set(name, card)
      return card
    })
}

export { getCardByName }
