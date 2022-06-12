import * as React from 'react'
import './App.css'
import Card from './Card'
import CardTable from './CardTable'
import { getCard } from './Scryfall'
import Deck from './Deck'
import Stack from '@mui/material/Stack'

function App () {
  // const cards = [
  //   ['AFR', 'Aberrant Mind Sorcerer', 'cost', 'type', '$0.02'],
  //   ['IKO', 'Adventurous Impulse', 'cost', 'type', '$0.02'],
  //   ['AFR', 'Xanathar, Guild Kingpin', 'cost', 'type', '$5.53']
  // ]

  const [cards, setCards] = React.useState<Card[]>([])
  const [deck, setDeck] = React.useState<Map<string, Card>>(
    new Map())
  const [cardsLoading, setCardsLoading] = React.useState(false)

  const handleCardSelectedInCollection = (card: Card) => {
    if (card.quantity > 0) {
      card.quantity--
      card.quantityInDeck++
    }
    const newDeck = new Map(deck)
    newDeck.set(card.id, card)
    setDeck(newDeck)
  }

  const handleCardSelectedInDeck = (card: Card) => {
    card.quantity++
    card.quantityInDeck--
    if (card.quantityInDeck === 0) {
      const newDeck = new Map(deck)
      newDeck.delete(card.id)
      setDeck(newDeck)
    }
  }

  if (!cardsLoading) {
    setCardsLoading(true)

    Promise.all([
      getCard({ set: 'xln', number: 96 }),
      getCard({ set: 'afr', number: 131 }),
      getCard({ set: 'afr', number: 89 })
    ]).then(setCards)
  }

  return (
    <div className="App">
      <header className="App-header">
        <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <Stack direction="row" spacing={1} style={{ width: '90%' }}>
          <CardTable
            cards={cards}
            onCardSelected={handleCardSelectedInCollection}
          />
          <Deck
            cards={deck}
            onCardSelected={handleCardSelectedInDeck}
          />
        </Stack>
      </header>
    </div>
  )
}

export default App
