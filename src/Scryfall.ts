import { Card, cardFromScryfallJson } from './Card'
import throttledQueue from 'throttled-queue'

// Scryfall recommends rate limits at 10 transactions/sec:
// https://scryfall.com/docs/api
const SCRYFALL_REQUESTS_CAP = 10
const SCYFALL_REQUEST_INTERVAL = 1000
const SCRYFALL_BASE_API_URL = 'https://api.scryfall.com'
const SCRYFALL_CARDS_API_URL = SCRYFALL_BASE_API_URL + '/cards'
// const SCRYFALL_CARDS_NAMED_API_URL = SCRYFALL_CARDS_API_URL + '/named?'

const cardsBySetNumber: Map<{ set: string, number: number }, Card> = new Map()
const throttle = throttledQueue(SCRYFALL_REQUESTS_CAP, SCYFALL_REQUEST_INTERVAL)
const setNameSubstitions = new Map<string, string>([
  ['ppafr', 'pafr'],
  ['ppsnc', 'psnc'],
  ['ppiko', 'piko']
])

async function getCard (setNumber: {set: string, number: number}) {
  const card = cardsBySetNumber.get(setNumber)
  if (card) {
    return new Promise<Card>(resolve => resolve(card))
  }

  return throttle<Card>(() => {
    setNumber.set = setNameSubstitions.get(setNumber.set) || setNumber.set
    return fetch(
      `${SCRYFALL_CARDS_API_URL}/${setNumber.set}/${setNumber.number}`)
      .then(res => res.json())
      .then(json => {
        const card = cardFromScryfallJson(json)
        cardsBySetNumber.set(setNumber, card)
        return card
      })
  })
}

export { getCard }
