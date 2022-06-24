import { Card } from './Card'

function toKey (set: string, number: number): string {
  return set + '/' + number.toString()
}

export function getCard (set: string, number: number): Card | unknown {
  const key = toKey(set, number)
  const maybeCard = localStorage.getItem(key)
  return maybeCard && JSON.parse(maybeCard)
}

export function setCard (card: Card): void {
  const key = toKey(card.set, card.number)
  localStorage.setItem(key, JSON.stringify(card))
}
