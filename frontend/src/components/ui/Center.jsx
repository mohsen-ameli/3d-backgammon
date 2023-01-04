const Center = (props) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
      {props.children}
    </div>
  )
}

export default Center
