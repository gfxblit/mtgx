import * as React from 'react'
import MuiCard from '@mui/material/Card'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import Card from './Card'
import { Fab, Stack, Button } from '@mui/material'

export default function Deck (
  props: {
    cards: Map<string, Card>,
    onCardSelected: (card: Card) => void,
    onRowOver?: (card: Card) => void,
    onRowLeave?: (card: Card) => void,
    onCountClicked?: (card: Card) => void
  }): React.ReactElement {
  const handleMouseDown = (e: any) => {
    const card = props.cards.get(e.target.id)
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

  const handleMouseLeave = (e: any) => {
    const card = props.cards.get(e.currentTarget.dataset.id)
    if (props.onRowLeave && card) {
      props.onRowLeave(card)
    }
  }

  const handleOnCountClicked = (e: any) => {
    console.log('count clicked', e)
    const card = props.cards.get(e.target.id)
    console.log(props.onCountClicked, card)
    if (props.onCountClicked && card) {
      props.onCountClicked(card)
    }
  }

  const columns = [{
    field: 'name',
    headerName: 'Deck',
    width: 250,
    renderCell: (params: GridRenderCellParams<Card>) =>
        <Stack direction='row' alignItems='center' spacing={1} >
        <Fab size='small' onClick={handleOnCountClicked} id={params.row.id} >
            {`${params.row.quantityInDeck}x`}
        </Fab>
        <Button
          size='small'
          onClick={handleMouseDown}
          id={params.row.id}
        >
          {params.row.name}
        </Button>
        </Stack>
  }]

  return (
    <MuiCard style={{ height: 650, width: 300 }}>
      <DataGrid
        columns={columns}
        rows={Array.from(props.cards.values())}
        componentsProps={{
          row: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave
          }
        }}
      />
    </MuiCard>
  )
}
