import { delay } from '@most/core'
import { fromAscii } from '../ascii'
import { rejects } from '@briancavalier/assert'
import { streamEqual } from './streamEqual'

describe(`streamEqual`, () => {
  describe(`given 2 identical streams`, () => {
    it(`returns a successful promise`, () => {
      const actual = fromAscii(`-a-b-c-|`)
      const expected = fromAscii(`-a-b-c-|`)

      return streamEqual(actual, expected)
    })
  })

  describe(`given 2 identical streams with delayed time`, () => {
    it(`returns a successful promise`, () => {
      const actual = delay(1000, fromAscii(`-a-b-c-|`))

      return streamEqual(actual, actual)
    })
  })

  describe(`given 2 unlike streams`, () => {
    it(`returns a rejected promise`, () => {
      const actual = fromAscii(`-a-b-c-|`)
      const expected = fromAscii(`-1-2-3-|`)

      return rejects(streamEqual(actual, expected))
    })
  })
})
