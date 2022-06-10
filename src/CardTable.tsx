import * as React from 'react'
import Card from './Card'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import CardPreview from './CardPreview'
import { Link, Button } from '@mui/material'
import MuiCard from '@mui/material/Card'
import UploadIcon from '@mui/icons-material/Upload'

import './Mana.css'

const columns: GridColDef[] = [
  { field: 'set', headerName: 'SET', width: 50 },
  {
    field: 'name',
    headerName: 'NAME',
    width: 250,
    renderCell: (params: GridRenderCellParams<Card>) => (
        <Link href={params.row.detailsUrl}>
         {params.row.name}
        </Link>
    )
  },
  {
    field: 'manaCost',
    headerName: 'COST',
    width: 100,
    renderCell: (params: GridRenderCellParams<Card>) => {
      // example: manaCost string: "{U}{U}{3}" translates to
      // <abbr className="card-symbol card-symbol-U" />
      // <abbr className="card-symbol card-symbol-U" />
      // <abbr className="card-symbol card-symbol-3" />
      const matchInsideBraces = /\{([^})]+)\}/

      return (params.row.manaCost.split(matchInsideBraces)
        .filter((e: any) => e) // filter empty strings
        .map((ent: string, index: number) =>
          <abbr key={index} className={`card-symbol card-symbol-${ent}`} />
        ))
    }
  },
  { field: 'type', headerName: 'TYPE', width: 200 },
  {
    field: 'price',
    headerName: 'PRICE',
    description: 'Price of this card in USD'
  }
]

function CustomToolbar () {
  return (
    <GridToolbarContainer>
      <Button startIcon={<UploadIcon />}>
        Import
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

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
    <MuiCard style={{ height: 400, width: '90%' }}>
      <DataGrid
        components={{
          Toolbar: CustomToolbar
        }}
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
    </MuiCard>
  )
}
