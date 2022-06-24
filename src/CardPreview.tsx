import * as React from 'react'
import { Card } from './Card'

export default function CardPreview (
  props: {card?: Card }): React.ReactElement {
  const [mousePosition, setMousePosition] =
    React.useState<{ x: number, y: number }>({ x: 0, y: 0 })

  React.useEffect(() => {
    document.addEventListener('mousemove', (event) => {
      const { x, y } = event
      setMousePosition({ x, y })
    })
  })

  const card = props.card
  if (!card) {
    return <div />
  }

  const imageUrls = card.faces.map(face => face.imageUrls.png).filter(el => el)

  return (<div>
    {imageUrls.map((imageUrl: string, index: number) =>
      <div
        key={index}
        style={{
          left: `${mousePosition.x + 20 + 255 * index}px`,
          top: `${mousePosition.y - 20}px`,
          position: 'fixed'
        }}>
        <img src={imageUrl} width="250" />
        </div>
    )}
    </div>)
}
