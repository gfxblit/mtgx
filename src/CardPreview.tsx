import * as React from 'react'
import Card from './Card'

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

  return (
      <div style={{
        left: `${mousePosition.x + 10}px`,
        top: `${mousePosition.y + 10}px`,
        position: 'fixed'
      }}>
        <img src={props.card ? props.card.imageUrls.png : ''} width="250" />
      </div>
  )
}
