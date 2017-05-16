import { fromAscii } from '../ascii'
import { streamEqualFor } from './streamEqualFor'

describe(`streamEqualFor`, () => {
  describe(`given an elapsed time and 2 equal streams`, () => {
    it(`returns a fufilled promise`, () => {
      const expected = fromAscii(`-a-b-c-d-----e--|`)
      const actual = fromAscii(`-a-b-c-d--|`)

      return streamEqualFor(10, expected, actual)
    })
  })
})
