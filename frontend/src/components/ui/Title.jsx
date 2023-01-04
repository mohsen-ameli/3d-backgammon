const Title = ({ className, ...props }) => {
  return (
    <h1 className={`text-xl font-semibold text-center ${className}`}>
      {props.children}
    </h1>
  )
}

export default Title
