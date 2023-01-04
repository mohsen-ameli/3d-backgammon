import Input from "./Input"

const FormField = ({ label, name, type = "text", placeholder }) => {
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
    </div>
  )
}

export default FormField
