import Input from "./Input"

// prettier-ignore
const FormField = ({ label, type = "text", autoComplete = "on", required = true, errors, ...props }) => {
  return (
    <div className="flex flex-col relative">
      <label
        htmlFor={props.name}
        className="after:content-['*'] after:ml-1 after:text-xl after:text-red-500"
      >
        {label}
      </label>
      <Input
        id={props.name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        {...props}
      />
      {errors && errors.code === props.name && (
        <p className="text-red-500 text-sm absolute -bottom-5 left-0">{errors.message}</p>
      )}
    </div>
  )
}

export default FormField
