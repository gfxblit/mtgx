import * as React from 'react'
import './App.css'
import Card from './Card'
import CardTable from './CardTable'
import { getCardByName } from './Scryfall'

function App () {
  // const cards = [
  //   ['AFR', 'Aberrant Mind Sorcerer', 'cost', 'type', '$0.02'],
  //   ['IKO', 'Adventurous Impulse', 'cost', 'type', '$0.02'],
  //   ['AFR', 'Xanathar, Guild Kingpin', 'cost', 'type', '$5.53']
  // ]

  const [cards, setCards] = React.useState<Card[]>([])
  const [cardsLoading, setCardsLoading] = React.useState(false)

  if (!cardsLoading) {
    setCardsLoading(true)

    Promise.all([
      getCardByName('Abherrant Mind Sorcerer'),
      getCardByName('Adventurous Impulse'),
      getCardByName('Xanathar, Guild Kingpin')
    ]).then(setCards)
  }

  return (
    <div className="App">
      <header className="App-header">
        <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <CardTable cards={cards}/>
      </header>
    </div>
  )
}

export default App
