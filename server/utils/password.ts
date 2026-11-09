import { scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

export async function isCorrectPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(':')
  if (!salt || !expectedHex) return false

  const expected = Buffer.from(expectedHex, 'hex')
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer

  return timingSafeEqual(actual, expected)
}
