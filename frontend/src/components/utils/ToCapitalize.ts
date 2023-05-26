/**
 * I mean do I really need to explain this? :D
 * @param {*} str -> A string
 * @returns Capital version of that string
 */
export default function toCapitalize(str: string | undefined): string {
  if (!str) return ""
  return str[0].toUpperCase() + str.slice(1)
}
