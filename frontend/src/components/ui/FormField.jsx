import Input from "./Input"

const FormField = ({ label, name, type = "text", placeholder, errors }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="after:content-['*'] after:ml-1 after:text-red-500"
      >
        {label}
      </label>
      <Input
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete="on"
        className="mt-2"
      />
      {errors && errors.code === name && (
        <p className="text-red-500 text-sm">{errors.message}</p>
      )}
    </div>
  )
}

export default FormField
