import * as React from 'react'
import Card from './Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CardPreview from './CardPreview'

const columns: GridColDef[] = [
  { field: 'set', headerName: 'SET', width: 50 },
  { field: 'name', headerName: 'NAME', width: 250 },
  { field: 'manaCost', headerName: 'COST', width: 100 },
  { field: 'type', headerName: 'TYPE', width: 200 },
  {
    field: 'price',
    headerName: 'PRICE',
    description: 'Price of this card in USD'
  }
]

interface Props {
  cards: any
}

export default function CardTable (props: Props): React.ReactElement {
  const [previewCard, setPreviewCard] = React.useState<Card>()

  const handleRowOver = (e: any) => {
    const rowId = e.currentTarget.dataset.id
    const card: Card = props.cards.find((card: Card) => card.id === rowId)
    console.log(rowId, card)
    console.log(e.currentTarget.dataset)
    setPreviewCard(card)
  }

  const handleMouseLeave = (event: any) => {
    setPreviewCard(undefined)
  }

  return (
    <div style={{ height: 400, width: '90%' }}>
      <DataGrid
        rows={props.cards}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        componentsProps={{
          row: {
            onMouseEnter: handleRowOver,
            onMouseLeave: handleMouseLeave
          }
        }}
      />

      <CardPreview
        card={previewCard}
      />
    </div>
  )
}
