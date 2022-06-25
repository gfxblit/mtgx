import * as React from 'react'
import { Card } from './Card'
import { DataGrid, GridColDef, GridComparatorFn, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { Button, Stack, Checkbox, TextField, Autocomplete } from '@mui/material'
import MuiCard from '@mui/material/Card'
import UploadIcon from '@mui/icons-material/Upload'
import Papa from 'papaparse'
import FilterManager from './FilterManager'

import './Mana.css'
import * as Scryfall from './Scryfall'
import * as CardDb from './CardDb'
import { throttle } from 'throttle-debounce'

interface CardRow {
  id: string,
  name: string,
  set: string,
  manaCost: string,
  type: string,
  card: Card
}

const filterManager = new FilterManager()

const countMana = (costs: string[]): number => {
  return costs
    .filter(el => el)
    .map(val => {
      const intOrNaN = parseInt(val)
      return isNaN(intOrNaN) ? 1 : intOrNaN
    })
    .reduce((prev, curr) => prev + curr, 0)
}

const manaCostComparator: GridComparatorFn<string> = (mc1, mc2) => {
  const matchInsideBraces = /\{([^})]+)\}/
  const costs1 = countMana(mc1?.split(matchInsideBraces).filter(el => el))
  const costs2 = countMana(mc2?.split(matchInsideBraces).filter(el => el))
  return costs1 - costs2
}

const columns: GridColDef[] = [
  { field: 'set', headerName: 'SET', width: 75 },
  { field: 'quantity', headerName: 'QTY', width: 75 },
  {
    field: 'name',
    headerName: 'NAME',
    width: 250,
    renderCell: (params: GridRenderCellParams<Card>) => (
        <Button size='small' id={params.row.id}>
          {params.row.name}
        </Button>
    )
  },
  {
    field: 'manaCost',
    headerName: 'COST',
    width: 100,
    sortComparator: manaCostComparator,
    renderCell: (params: GridRenderCellParams<Card>) => {
      // example: manaCost string: "{U}{U}{3}" translates to
      // <abbr className="card-symbol card-symbol-U" />
      // <abbr className="card-symbol card-symbol-U" />
      // <abbr className="card-symbol card-symbol-3" />
      if (params.row.manaCost) {
        const matchInsideBraces = /\{([^})]+)\}/

        return (params.row.manaCost.split(matchInsideBraces)
          .filter((e: any) => e) // filter empty strings
          .map((ent: string, index: number) =>
            <abbr key={index} className={`card-symbol card-symbol-${ent}`} />
          ))
      }
      return <div />
    }
  },
  {
    field: 'type',
    headerName: 'TYPE',
    width: 200
  }
]

export default function CardTable (
  props: {
    cards: any,
    onCardSelected: (card: Card) => void,
    onRowOver?: (card: Card) => void,
    onRowLeave?: (card: Card) => void
  }): React.ReactElement {
  const [collection, setCollection] = React.useState<Map<string, Card>>(props.cards)

  const handleFileChange = (e: any) => {
    if (e.target.files.length <= 0) {
      return
    }

    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results)
        let loaded = 0
        Promise.all(
          results.data.map((csvRow: any) => {
            console.log('csvRow', csvRow)
            const set = csvRow['Set Code'].toLowerCase()
            const number = csvRow['Card Number']

            const maybeCachedCard = CardDb.getCard(set, number)

            loaded++
            console.log(`${loaded}/${results.data.length}`)

            if (maybeCachedCard) {
              return new Promise<Card>(resolve => {
                resolve(maybeCachedCard as Card)
              })
            } else {
              return Scryfall.getCard({ set, number }).then((card: Card) => {
                card.quantity = csvRow.Quantity

                if (card.id) {
                  CardDb.setCard(card)
                }

                return card
              })
            }
          })
        ).then((fetchedCards: Card[]) => {
          const filteredCollection: Map<string, Card> = new Map(
            fetchedCards
              .filter((card: Card) => card.id)
              .map(card => [card.id, card]))

          filterManager.setCollection(filteredCollection)
          setCollection(filterManager.getFilteredCollection())
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

  const handleRowLeave = (event: any) => {
    const card = findCard(event.currentTarget.dataset.id)
    if (props.onRowLeave && card) {
      props.onRowLeave(card)
    }
  }

  const handleMouseDown = (e: any) => {
    const card = findCard(e.currentTarget.dataset.id)
    if (card) {
      props.onCardSelected(card)
    }
  }

  const handleColorCheckboxChange = (event: any, checked: boolean) => {
    const color = event.target.id

    checked ? filterManager.addColor(color) : filterManager.deleteColor(color)
    setCollection(filterManager.getFilteredCollection())
  }

  const throttledHandleSearchChange = throttle(250,
    (event: any, value: string) => {
      const searchText = value
      filterManager.setText(searchText)
      setCollection(filterManager.getFilteredCollection())
    },
    { noLeading: true }
  )

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
          options={filterManager.getCardIndex()}
          renderInput={(params) => <TextField {...params} label='Search' />}
          onInputChange={throttledHandleSearchChange}
        />
        </Stack>
      </MuiCard>
      <MuiCard style={{ height: 650 }}>
        <DataGrid
          components={{
            Toolbar: CustomToolbar
          }}
          rows={Array.from(collection.values())
            .map(card => {
              const row: CardRow = {
                id: card.id,
                name: card.faces[0].name,
                manaCost: card.faces[0].manaCost,
                type: card.faces[0].type,
                set: card.set,
                card
              }
              return row
            })}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          componentsProps={{
            row: {
              onMouseEnter: handleRowOver,
              onMouseLeave: handleRowLeave,
              onMouseDown: handleMouseDown
            }
          }}
        />
      </MuiCard>
    </Stack>
  )
}
