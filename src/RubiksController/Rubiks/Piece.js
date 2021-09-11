import React from 'react'
import { fillerEdges } from '../config'
import Icon from '../../common/Icon'

function Piece({ edges, className, color, onRotateCW, onRotateCCW, onEdgeRotate }) {
  return (
    <div className={`${className} ${color}`}>
      <div
        className="face"
        onClick={onRotateCW}
        onContextMenu={onRotateCCW}
      >
        {edges.map(edge => (
          <Icon
            key={edge}
            className={`i-${edge}`}
            name="expand_less"
            onClick={onEdgeRotate(edge)}
          />
        ))}
      </div>
      <div className="filler back" />
      {fillerEdges.map(edge => !edges.includes(edge) && (
        <div key={edge} className={`filler ${edge}`} />
      ))}
    </div>
  )
}

export default React.memo(Piece, (prevProps, nextProps) => {
  if (prevProps.color === nextProps.color) {
    return true
  }
})