class Card {
  readonly id: string
  readonly name: string
  readonly set: string
  readonly manaCost: string
  readonly imageUrls: { png: string }
  readonly type: string
  readonly price: string
  readonly detailsUrl: string
  quantity: number

  constructor (
    id: string,
    name: string,
    set: string,
    manaCost: string,
    imageUrls: { png: string },
    type: string,
    price: string,
    detailsUrl: string,
    quantity: number = 1) {
    this.id = id
    this.name = name
    this.set = set
    this.manaCost = manaCost
    this.imageUrls = imageUrls
    this.type = type
    this.price = price
    this.detailsUrl = detailsUrl
    this.quantity = quantity
  }

  static fromJson (json: any): Card {
    const card: Card = new Card(
      json.id,
      json.name,
      json.set,
      json.mana_cost,
      json.image_uris,
      json.type_line,
      json.price,
      json.scryfall_uri)
    return card
  }
}

export default Card
