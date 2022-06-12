import * as React from 'react'
import MuiCard from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import Card from './Card'

export default function Deck (props: { cards: Map<{ set: string, number: number }, Card> }): React.ReactElement {
  return (
    <MuiCard style={{ height: 650, width: 300 }}>
      <DataGrid
        columns={[
          { field: 'name', headerName: 'Deck', width: 250 }
        ]}
        rows={Array.from(props.cards.values())}
      />
    </MuiCard>
  )
}
