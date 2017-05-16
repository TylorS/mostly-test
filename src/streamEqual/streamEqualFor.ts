import { VirtualEvent, collectEvents, ticks } from '../testEnv'
import { periodic, skip, until } from '@most/core'

import { Stream } from '@most/types'
import { curry3 } from '@most/prelude'
import { eq } from '@briancavalier/assert'

export const streamEqualFor: StreamEqualForArity3 = curry3(
  function streamEqualFor<A>(elapsedTime: number, expected: Stream<A>, actual: Stream<A>): Promise<ReadonlyArray<VirtualEvent<A>>> {
    const scheduler = ticks(elapsedTime)

    const untilTime = until<A>(skip(1, periodic(elapsedTime)))

    const expectedEvents = collectEvents(untilTime(expected), scheduler)
    const actualEvents = collectEvents(untilTime(actual), scheduler)

    return Promise.all([ expectedEvents, actualEvents ])
      .then(([ a, b ]) => eq(a, b))
      .then(() => actualEvents)
  },
)

export interface StreamEqualForArity3 {
  <A>(elapsedTime: number, expected: Stream<A>, actual: Stream<A>): Promise<ReadonlyArray<VirtualEvent<A>>>
  <A>(elapsedTime: number, expected: Stream<A>): StreamEqualForArity1<A>
  (elapsedTime: number): StreamEqualForArity2
}

export interface StreamEqualForArity2 {
  <A>(expected: Stream<A>, actual: Stream<A>): Promise<ReadonlyArray<VirtualEvent<A>>>
  <A>(expected: Stream<A>): StreamEqualForArity1<A>
}

export interface StreamEqualForArity1<A> {
  (actual: Stream<A>): Promise<ReadonlyArray<VirtualEvent<A>>>
}
