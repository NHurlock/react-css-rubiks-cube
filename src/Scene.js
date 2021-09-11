import { useEffect, useRef, useState } from 'react'
import RubiksController from './RubiksController'
import Icon from './common/Icon'

function Scene() {
  const [yRotate, setYRotate] = useState(-45)
  const [zRotate, setZRotate] = useState(35)
  const rotatingYInterval = useRef(null)
  const rotatingZInterval = useRef(null)
  const rotateStyle = {
    transform: `rotateY(${yRotate}deg) rotateZ(${zRotate}deg)`
  }

  const startYRotate = inverse => e => {
    if (e.button === 0) {
      rotatingYInterval.current = setInterval(() => {
        setYRotate(deg => deg + (inverse ? -5 : 5))
      }, 110)
    }
  }

  const startZRotate = inverse => e => {
    if (e.button === 0) {
      rotatingZInterval.current = setInterval(() => {
        setZRotate(deg => deg + (inverse ? -5 : 5))
      }, 110)
    }
  }

  const stopYRotate = e => e.button === 0 && clearInterval(rotatingYInterval.current)
  const stopZRotate = e => e.button === 0 && clearInterval(rotatingZInterval.current)

  useEffect(() => () => {
    clearInterval(rotatingYInterval.current)
    clearInterval(rotatingZInterval.current)
  }, [])

  return (
    <div className="scene">
      <RubiksController rotateStyle={rotateStyle} />
      <div className="scene-controls">
        <div className="rotate-controls-holder">
          <div className="rotate-controls y-axis">
            <div
              className="button rotate-left"
              onMouseDown={startYRotate(false)}
              onMouseUp={stopYRotate}
            >
              <Icon name="chevron_left" />
            </div>
            <div
              className="button rotate-right"
              onMouseDown={startYRotate(true)}
              onMouseUp={stopYRotate}
            >
              <Icon name="chevron_right" />
            </div>
          </div>
        </div>
        <div className="rotate-controls-holder">
          <div className="rotate-controls z-axis">
            <div
              className="button rotate-up"
              onMouseDown={startZRotate(false)}
              onMouseUp={stopZRotate}
            >
              <Icon name="expand_less" />
            </div>
            <div
              className="button rotate-down"
              onMouseDown={startZRotate(true)}
              onMouseUp={stopZRotate}
            >
              <Icon name="expand_more" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scene
