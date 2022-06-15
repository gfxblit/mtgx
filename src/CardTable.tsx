import * as React from 'react'
import Card from './Card'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { Link, Button, Stack, Checkbox, TextField, Autocomplete } from '@mui/material'
import MuiCard from '@mui/material/Card'
import UploadIcon from '@mui/icons-material/Upload'
import Papa from 'papaparse'
import CardIndex from './CardIndex'

import './Mana.css'
import { getCard } from './Scryfall'

let cardIndex: CardIndex

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

export default function CardTable (
  props: {
    cards: any,
    onCardSelected: (card: Card) => void,
    onRowOver?: (card: Card) => void
  }): React.ReactElement {
  const [collection, setCollection] = React.useState<Map<string, Card>>(props.cards)
  const [importedCollection, setImportedCollection] =
    React.useState<Map<string, Card>>(new Map())

  type Filter = (card: Card) => boolean
  const [filters, setFilters] = React.useState<Map<string, Filter>>(new Map())

  const filterCollection = (
    collection: Map<string, Card>,
    filters: Map<string, Filter>): Map<string, Card> => {
    const filteredCollection = new Map(collection)

    if (filters.size === 0) {
      return filteredCollection
    }

    filteredCollection.forEach((card: Card) => {
      let allow = false
      filters.forEach((filter: Filter, filterId: string) => {
        if (filter(card)) {
          allow = true
        }
      })
      if (!allow) {
        filteredCollection.delete(card.id)
      }
    })
    return filteredCollection
  }

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
          const filteredCollection: Map<string, Card> = new Map(
            fetchedCards.filter((card: Card) => card.id).map(
              card => [card.id, card]
            ))
          setImportedCollection(filteredCollection)
          setCollection(filterCollection(filteredCollection, filters))
          cardIndex = new CardIndex(Array.from(filteredCollection.values()))
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

  const findCard = (rowId: any): Card | undefined => {
    // console.log('rowId, card:', rowId, card)
    // console.log(e.currentTarget.dataset)
    return collection.get(rowId)
  }

  const handleRowOver = (e: any) => {
    const card = findCard(e.currentTarget.dataset.id)
    if (props.onRowOver && card) {
      props.onRowOver(card)
    }
  }

  const handleMouseLeave = (event: any) => {
  }

  const handleMouseDown = (e: any) => {
    const card = findCard(e.currentTarget.dataset.id)
    if (card) {
      props.onCardSelected(card)
    }
  }

  const handleColorCheckboxChange = (event: any, checked: boolean) => {
    const newFilters: Map<string, Filter> = new Map(filters)
    const color = event.target.id
    const filterKey = `filter-for-${color}`

    if (checked) {
      newFilters.set(
        filterKey,
        (card: Card) => card.manaCost.search(`{${color}}`) >= 0)
    } else {
      newFilters.delete(filterKey)
    }
    setFilters(newFilters)
    setCollection(filterCollection(importedCollection, newFilters))
  }

  const handleSearchChange = (event: any, value: string) => {
    const searchText = value
    console.log(searchText)
    console.log(cardIndex.getCards(searchText))
  }

  return (
    <Stack spacing={1} style={{ height: 650, width: '100%' }}>
      <MuiCard style={{ height: 52 }}>
        <Stack
          direction="row"
          alignItems={'center'}
        >
        {['B', 'G', 'R', 'U', 'W'].map((color: string) =>
          <Checkbox key={color}
            id={color}
            icon={<abbr className={`card-symbol-big card-symbol-${color}`} />}
            checkedIcon=
              {<abbr className=
                {`card-symbol-big-selected card-symbol-${color}`} />}
            onChange={handleColorCheckboxChange}
          />
        )}
        <Autocomplete
          freeSolo
          size='small'
          sx={{ width: 300 }}
          id='autocomplete-card-filter'
          options={cardIndex ? cardIndex.getIndex() : []}
          renderInput={(params) => <TextField {...params} label='Search' />}
          onInputChange={handleSearchChange}
        />
        </Stack>
      </MuiCard>
      <MuiCard style={{ height: 650 }}>
        <DataGrid
          components={{
            Toolbar: CustomToolbar
          }}
          rows={Array.from(collection.values())}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          componentsProps={{
            row: {
              onMouseEnter: handleRowOver,
              onMouseLeave: handleMouseLeave,
              onMouseDown: handleMouseDown
            }
          }}
        />
      </MuiCard>
    </Stack>
  )
}
