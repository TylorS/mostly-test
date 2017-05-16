import { collectEvents, newEnv } from '../testEnv'

import { eq } from '@briancavalier/assert'
import { fromAscii } from './fromAscii'
import { time } from './time'

describe(`fromAscii`, () => {
  describe(`given an ascii diagram`, () => {
    it(`returns a stream of values`, () => {
      const stream = fromAscii(`-a-b-${time(100)}-c-|`)

      const { tick, scheduler } = newEnv()

      tick(1000)

      const expected =
        [
          { time: 2, value: 'a' },
          { time: 4, value: 'b' },
          { time: 107, value: 'c' },
        ]

      return collectEvents(stream, scheduler).then(eq(expected))
    })

    it(`schedules errors`, () => {
      const stream = fromAscii(`-a-b-#--`)

      const { tick, scheduler } = newEnv()

      tick(100)

      collectEvents(stream, scheduler).catch((err) => eq(err.message, '#'))
    })
  })

  describe(`given an ascii diagram and a Record of values`, () => {
    it(`returns a stream of specified values`, () => {
      const stream = fromAscii(`-a-b-c-|`, { a: 1, b: 2, c: 3 })

      const { tick, scheduler } = newEnv()

      tick(100)

      const expected =
        [
          { time: 2, value: 1 },
          { time: 4, value: 2 },
          { time: 6, value: 3 },
        ]

      return collectEvents(stream, scheduler).then(eq(expected))
    })
  })
})
