/**
 * I mean do I really need to explain this? :D
 * @param {*} str -> A string
 * @returns Capital verrsion of that string
 */
const toCapitalize = (str: string | undefined): string => {
  if (!str) return ""
  return str[0].toUpperCase() + str.slice(1)
}

export default toCapitalize
