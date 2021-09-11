import { map, clone, identity, mapObjIndexed } from 'ramda'
import { wArr, baseCube, cubeWidth, maxCubeWidthIndex, sideMap, offsets } from "./config"

export const fillSide = value =>
  Array(cubeWidth)
    .fill(null)
    .map(() => Array(cubeWidth).fill(value))

const getXEdge = x =>
  x === 0 ? 'left' : x === maxCubeWidthIndex ? 'right' : null

const getYEdge = y =>
  y === 0 ? 'top' : y === maxCubeWidthIndex ? 'bottom' : null

export const getEdgeDetail = (x, y) =>
  [getXEdge(x), getYEdge(y)].filter(identity)

export const invertOffset = offset => Math.abs(maxCubeWidthIndex - offset)

const rotateSide = (CCW, arr) =>
  arr.reduce((acc, row, ri) => {
    row.map((val, ci) => {
      if (CCW) {
        acc[maxCubeWidthIndex - ci][ri] = val
      } else {
        acc[ci][maxCubeWidthIndex - ri] = val
      }
      return val
    })
    return acc
  }, fillSide(null))

const rotateEdgeOfCube = (axis, offset) => (side, sideInfo, from, fromInfo, reverse) => {
  const isX = axis === sideInfo.xAxis
  const isY = axis === sideInfo.yAxis
  const isFromX = axis === fromInfo.xAxis
  const xOffsetType = sideInfo.xNegate ? 'neg' : 'pos'
  const yOffsetType = sideInfo.yNegate ? 'neg' : 'pos'
  const fromIndexType = reverse ? 'neg' : 'pos'
  const fromXOffsetType = fromInfo.xNegate ? 'neg' : 'pos'
  const fromYOffsetType = fromInfo.yNegate ? 'neg' : 'pos'
  
  return wArr.reduce((acc, i) => {
    const x = isX ? offsets[offset][xOffsetType] : i
    const y = isY ? offsets[offset][yOffsetType] : i

    if (isFromX) {
      acc[y][x] = from[offsets[i][fromIndexType]][offsets[offset][fromXOffsetType]]
    } else {
      acc[y][x] = from[offsets[offset][fromYOffsetType]][offsets[i][fromIndexType]]
    }

    return acc
  }, side)
}

export const handleRotation = (CCW, axis, offset) => cube => {
  const rotateEdge = rotateEdgeOfCube(axis, offset)

  return mapObjIndexed((side, sideName) => {
    const sideInfo = sideMap[sideName]

    if (axis === sideInfo.axis && offset === sideInfo.axisOffset) {
      return rotateSide((CCW && !sideInfo.reverse) || (!CCW && sideInfo.reverse), cube[sideName])
    } else if (axis === sideInfo.xAxis) {
      const counter = sideInfo.xCounter ? CCW : !CCW
      const { side: fromName, reverse } = sideInfo.sides[counter ? 'bottom' : 'top']
      return rotateEdge(side, sideInfo, cube[fromName], sideMap[fromName], reverse)
    } else if (axis === sideInfo.yAxis) {
      const counter = sideInfo.yCounter ? CCW : !CCW
      const { side: fromName, reverse } = sideInfo.sides[counter ? 'right' : 'left']
      return rotateEdge(side, sideInfo, cube[fromName], sideMap[fromName], reverse)
    }
    return side
  }, clone(cube))
}

export const generateRandomCube = () => {
  const ccwOptions = [true, false]
  const axisOptions = ['x', 'y', 'z']
  const offsetOptions = wArr
  let cube = clone(baseCube)

  Array(Math.ceil(Math.random() * 90) + 10)
    .fill(null)
    .forEach(() => {
      const CCW = ccwOptions[Math.ceil(Math.random() * ccwOptions.length) - 1]
      const axis = axisOptions[Math.ceil(Math.random() * axisOptions.length) - 1]
      const offset = offsetOptions[Math.ceil(Math.random() * offsetOptions.length) - 1]
      cube = handleRotation(CCW, axis, offset)(cube)
    })

  return cube
}

export const rotateSides = rotate => map(({ axis, axisOffset, axisCounter, xAxis, xCounter, yAxis, yCounter }) => {
  const handleRotate = (CCW, rAxis, offset = axisOffset) => e => {
    e.preventDefault()
    const counter = rAxis === xAxis ? xCounter : rAxis === yAxis ? yCounter : axisCounter
    rotate((CCW && !counter) || (!CCW && counter), rAxis, offset)
  }

  return {
    cw: handleRotate(false, axis),
    ccw: handleRotate(true, axis),
    edge: (xAxis, xOffset, yAxis, yOffset) => dir => e => {
      e.stopPropagation()
      if (['left', 'right'].includes(dir)) {
        handleRotate(dir === 'right', yAxis, yOffset)(e)
      }
      if (['top', 'bottom'].includes(dir)) {
        handleRotate(dir === 'bottom', xAxis, xOffset)(e)
      }
    }
  }
}, sideMap)