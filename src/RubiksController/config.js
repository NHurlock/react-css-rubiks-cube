import { keys, mapObjIndexed } from 'ramda'
import { fillSide, getEdgeDetail, invertOffset } from './helpers'

export const cubeWidth = 3
export const maxCubeWidthIndex = cubeWidth - 1
export const wArr = Array(cubeWidth).fill(null).map((v, i) => i)
export const fillerEdges = ['top', 'bottom', 'left', 'right']

export const baseCube = mapObjIndexed(fillSide, {
  front: 'green',
  back: 'yellow',
  left: 'orange',
  right: 'red',
  top: 'white',
  bottom: 'blue'
})

const first = 0
const last = maxCubeWidthIndex
export const sideMap = {
  front: {
    axis: 'z',
    axisOffset: first,
    xAxis: 'x',
    yAxis: 'y',
    sides: {
      top: {
        side: 'top'
      },
      bottom: {
        side: 'bottom'
      },
      left: {
        side: 'left'
      },
      right: {
        side: 'right'
      }
    }
  },
  back: {
    axis: 'z',
    axisOffset: last,
    axisNegate: true,
    axisCounter: true,
    xAxis: 'x',
    xNegate: true,
    xCounter: true,
    yAxis: 'y',
    reverse: true,
    sides: {
      top: {
        side: 'top',
        reverse: true
      },
      bottom: {
        side: 'bottom',
        reverse: true
      },
      left: {
        side: 'right'
      },
      right: {
        side: 'left'
      }
    }
  },
  left: {
    axis: 'x',
    axisOffset: first,
    axisCounter: true,
    xAxis: 'z',
    xNegate: true,
    yAxis: 'y',
    reverse: true,
    sides: {
      top: {
        side: 'top',
        reverse: true
      },
      bottom: {
        side: 'bottom'
      },
      left: {
        side: 'back'
      },
      right: {
        side: 'front'
      }
    }
  },
  right: {
    axis: 'x',
    axisOffset: last,
    axisNegate: true,
    xAxis: 'z',
    xCounter: true,
    yAxis: 'y',
    sides: {
      top: {
        side: 'top'
      },
      bottom: {
        side: 'bottom',
        reverse: true
      },
      left: {
        side: 'front'
      },
      right: {
        side: 'back'
      }
    }
  },
  top: {
    axis: 'y',
    axisOffset: first,
    xAxis: 'x',
    yAxis: 'z',
    yNegate: true,
    yCounter: true,
    sides: {
      top: {
        side: 'back',
        reverse: true
      },
      bottom: {
        side: 'front'
      },
      left: {
        side: 'left',
        reverse: true
      },
      right: {
        side: 'right'
      }
    }
  },
  bottom: {
    axis: 'y',
    axisOffset: last,
    axisNegate: true,
    axisCounter: true,
    xAxis: 'x',
    yAxis: 'z',
    reverse: true,
    sides: {
      top: {
        side: 'front'
      },
      bottom: {
        side: 'back',
        reverse: true
      },
      left: {
        side: 'left'
      },
      right: {
        side: 'right',
        reverse: true
      }
    }
  }
}

export const offsets = wArr.map(offset => ({
  pos: offset,
  neg: invertOffset(offset)
}))
export const piecesDetail = keys(sideMap).reduce((acc, sideName) => {
  const { axis, axisOffset, xAxis, xNegate, yAxis, yNegate } = sideMap[sideName]
  const xOffsetType = xNegate ? 'neg' : 'pos'
  const yOffsetType = yNegate ? 'neg' : 'pos'

  wArr.forEach(x => {
    const xOffset = offsets[x][xOffsetType]
    
    wArr.forEach(y => {
      const yOffset = offsets[y][yOffsetType]
      const className = [
        sideName,
        'piece',
        `x-${x}`,
        `y-${y}`,
        `axis-${axis}-${axisOffset}`,
        `axis-${xAxis}-${xOffset}`,
        `axis-${yAxis}-${yOffset}`,
      ].join(' ')
      const edges = getEdgeDetail(x, y)
      
      acc.push({ x, y, xOffset, yOffset, xAxis, yAxis, className, sideName, edges })
    })
  })

  return acc
}, [])