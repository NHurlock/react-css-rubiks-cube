function Icon({ className = '', name, round = false, outlined = false, onClick = () => null }) {
  return (
    <i className={`${className} icon material-icons${round ? '-round' : outlined ? '-outlined' : ''}`} onClick={onClick}>
      {name}
    </i>
  )
}

export default Icon