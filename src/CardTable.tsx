import * as React from 'react'
import Card from './Card'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import CardPreview from './CardPreview'
import { Link, Button } from '@mui/material'
import MuiCard from '@mui/material/Card'
import UploadIcon from '@mui/icons-material/Upload'
import Papa from 'papaparse'

import './Mana.css'
import { getCard } from './Scryfall'

const columns: GridColDef[] = [
  { field: 'set', headerName: 'SET', width: 75 },
  { field: 'quantity', headerName: 'QTY', width: 75 },
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

export default function CardTable (props: { cards: any }): React.ReactElement {
  const [previewCard, setPreviewCard] = React.useState<Card>()
  const [collection, setCollection] = React.useState<Card[]>(props.cards)

  const handleFileChange = (e: any) => {
    if (e.target.files.length <= 0) {
      return
    }

    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results)
        Promise.all(
          results.data.map((csvRow: any) => {
            console.log('csvRow', csvRow)
            return getCard({
              set: csvRow['Set Code'].toLowerCase(),
              number: csvRow['Card Number']
            }).then((card: Card) => {
              card.quantity = csvRow.Quantity
              return card
            })
          })
        ).then((fetchedCards: Card[]) => {
          const filteredCollection = fetchedCards.filter((card: Card) => card.id)
          console.log('filteredCollection', filteredCollection)
          setCollection(filteredCollection)
        })
      }
    })
  }

  const CustomToolbar = () => (
    <GridToolbarContainer>
    <input
      accept="csv/*"
      style={{ display: 'none' }}
      id="raised-button-file"
      type="file"
      onChange={handleFileChange}
    />
    <label htmlFor="raised-button-file">
      <Button component="span" startIcon={<UploadIcon />}>
        Import
      </Button>
    </label>

      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  )

  React.useEffect(() => {
    // setCollection(props.cards)
  })

  const handleRowOver = (e: any) => {
    const rowId = e.currentTarget.dataset.id
    const card: Card | undefined = collection.find((card: Card) => card.id === rowId)
    // console.log('rowId, card:', rowId, card)
    // console.log(e.currentTarget.dataset)
    setPreviewCard(card)
  }

  const handleMouseLeave = (event: any) => {
    setPreviewCard(undefined)
  }

  return (
    <MuiCard style={{ height: 650, width: '100%' }}>
      <DataGrid
        components={{
          Toolbar: CustomToolbar
        }}
        rows={collection}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
        componentsProps={{
          row: {
            onMouseEnter: handleRowOver,
            onMouseLeave: handleMouseLeave
          }
        }}
      />

      <CardPreview card={previewCard} />
    </MuiCard>
  )
}
