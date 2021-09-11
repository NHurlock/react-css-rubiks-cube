import { useEffect, useRef, useState } from 'react'
import { find, propEq, append, clone, init, last } from 'ramda'
import { baseCube, cubeWidth } from './config'
import { handleRotation, generateRandomCube, rotateSides } from './helpers'

function useCube() {
  const [cube, setCube] = useState(clone(baseCube))
  const [rotateQueue, setRotatingQueue] = useState([])
  const [rotating, setRotating] = useState([])
  const [moveSet, setMoveSet] = useState([])
  const rotatingTimeout = useRef(null)
  const canUndo = rotating.length === 0 && moveSet.length !== 0
  const rotateClasses = rotating.map(({ ccw, axis, offset }) => `rotated-${axis}-${offset}${ccw ? '-ccw' : ''}`).join(' ')

  const reset = () => {
    setMoveSet([])
    setCube(clone(baseCube))
  }

  const scramble = () => {
    setCube(generateRandomCube())
  }

  const rotate = (ccw, axis, offset = 0) => {
    setRotatingQueue(append({ ccw, axis, offset }))
  }

  const undo = () => {
    if (canUndo) {
      setMoveSet(moves => {
        const { ccw, axis, offset } = last(moves)
        setRotating(append({ ccw: !ccw, axis, offset }))
        return init(moves)
      })
    }
  }

  useEffect(() => {
    if (rotateQueue.length > 0) {
      rotateQueue.forEach(move => {
        const { axis, offset } = move
        const canRotate = !find(rotate => {
          if (!propEq('axis', axis, rotate)) {
            return true
          }
          if (propEq('axis', axis, rotate) && propEq('offset', offset, rotate)) {
            return true
          }
        }, rotating)
        if (rotating.length < cubeWidth && canRotate) {
          setRotating(append(move))
          setMoveSet(append(move))
        }
      })
      setRotatingQueue([])
    }
  }, [rotateQueue]) // eslint-disable-line

  useEffect(() => {
    if (rotating.length > 0) {
      rotatingTimeout.current = clearTimeout(rotatingTimeout.current)
      rotatingTimeout.current = setTimeout(() => {
        setCube(c => {
          rotating.forEach(({ ccw, axis, offset }) => {
            c = handleRotation(ccw, axis, offset)(c)
          })
          return c
        })
        setRotating([])
      }, 500)
    }
  }, [rotating])

  useEffect(() => () => {
    rotatingTimeout.current = clearTimeout(rotatingTimeout.current)
  }, [])

  return [cube, rotateClasses, canUndo, rotateSides(rotate), undo, reset, scramble]
}

export default useCube