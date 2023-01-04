export default async function generateHash(string1, string2) {
  // Concatenate the two strings
  let input

  // Doing this, so the string will always be the same, no matter which user is the first one
  if (string1 > string2) {
    input = string2 + string1
  } else {
    input = string1 + string2
  }

  // Generate a hash of the input using crypto.subtle.digest
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  )

  // Convert the hash to a hex string
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
