interface Face {
  readonly name: string
  readonly colorIdentity?: string[]
  readonly manaCost: string
  readonly imageUrls: { png: string }
  readonly type: string
  readonly text: string
}

export interface Card {
  readonly id: string
  readonly set: string
  readonly number: number
  readonly price?: string
  readonly detailsUrl: string
  readonly faces: Face[]
  quantity: number
  quantityInDeck: number
}

function faceFromScryfallJson (json: any): Face {
  return {
    name: json.name,
    colorIdentity: json.color_identity,
    manaCost: json.mana_cost,
    imageUrls: json.image_uris,
    type: json.type_line,
    text: json.oracle_text
  }
}

export function cardFromScryfallJson (json: any): Card {
  let cardFaces: Face[]

  if (json.card_faces?.length > 0) {
    cardFaces = json.card_faces.map(faceFromScryfallJson)
  } else {
    cardFaces = [faceFromScryfallJson(json)]
  }
  const card: Card = {
    id: json.id,
    set: json.set,
    number: json.collector_number,
    detailsUrl: json.scryfall_uri,
    faces: cardFaces,
    quantity: 1,
    quantityInDeck: 0
  }

  return card
}
