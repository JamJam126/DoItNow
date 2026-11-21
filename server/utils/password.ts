import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)
const keyLength = 64

export async function isCorrectPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(':')
  if (!salt || !expectedHex) return false

  const expected = Buffer.from(expectedHex, 'hex')
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer

  return timingSafeEqual(actual, expected)
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scryptAsync(password, salt, keyLength)) as Buffer
  return `${salt}:${hash.toString('hex')}`
}
