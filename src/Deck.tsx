import * as React from 'react'
import MuiCard from '@mui/material/Card'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import Card from './Card'

export default function Deck (
  props: {
    cards: Map<string, Card>,
    onCardSelected: (card: Card) => void,
    onRowOver?: (card: Card) => void
  }): React.ReactElement {
  const handleMouseDown = (e: any) => {
    const card = props.cards.get(e.currentTarget.dataset.id)
    if (card) {
      props.onCardSelected(card)
    }
  }

  const handleMouseEnter = (e: any) => {
    const card = props.cards.get(e.currentTarget.dataset.id)
    if (props.onRowOver && card) {
      props.onRowOver(card)
    }
  }
  return (
    <MuiCard style={{ height: 650, width: 300 }}>
      <DataGrid
        columns={[{
          field: 'name',
          headerName: 'Deck',
          width: 250,
          renderCell: (params: GridRenderCellParams<Card>) => (
            `${params.row.quantityInDeck}x ${params.row.name}`
          )
        }
        ]}
        rows={Array.from(props.cards.values())}
        componentsProps={{
          row: {
            onMouseDown: handleMouseDown,
            onMouseEnter: handleMouseEnter
          }
        }}
      />
    </MuiCard>
  )
}
