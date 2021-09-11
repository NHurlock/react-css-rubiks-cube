import useCube from './useCube'
import Rubiks from './Rubiks'
import Icon from '../common/Icon'

function RubiksController({ rotateStyle }) {
  const [cube, rotateClasses, canUndo, sideRotate, undo, reset, scramble] = useCube()

  return (
    <div className="rubiks-controller">
      <div className="rubiks-controls">
        <div
          className="button undo"
          disabled={!canUndo}
          onClick={undo}
        >
          <Icon name="undo" />
        </div>
        <div
          className="button reset"
          onClick={reset}
        >
          <Icon name="restart_alt" />
        </div>
        <div
          className="button scramble"
          onClick={scramble}
        >
          <Icon name="blender" />
        </div>
      </div>
      <div className="rubiks-display" style={rotateStyle}>
        <Rubiks
          cube={cube}
          rotateClasses={rotateClasses}
          sideRotate={sideRotate}
        />
      </div>
    </div>
  )
}

export default RubiksController