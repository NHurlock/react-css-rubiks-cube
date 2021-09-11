import React from 'react'
import { equals } from 'ramda'
import { piecesDetail } from '../config'
import Piece from './Piece'

function Rubiks({ cube, rotateClasses, sideRotate }) {
  return (
    <div className={`rubiks ${rotateClasses}`}>
      {piecesDetail.map(({ x, y, xOffset, yOffset, xAxis, yAxis, className, sideName, edges }) => (
        <Piece
          key={`${sideName}-${x}-${y}`}
          edges={edges}
          className={className}
          color={cube[sideName][y][x]}
          onRotateCW={sideRotate[sideName].cw}
          onRotateCCW={sideRotate[sideName].ccw}
          onEdgeRotate={sideRotate[sideName].edge(xAxis, xOffset, yAxis, yOffset)}
        />
      ))}
    </div>
  )
}

export default React.memo(Rubiks, (prevProps, nextProps) => {
  const rotateClassesEqual = prevProps.rotateClasses === nextProps.rotateClasses
  const cubeEqual = equals(prevProps.cube, nextProps.cube)

  if (rotateClassesEqual && cubeEqual) {
    return true
  }
})