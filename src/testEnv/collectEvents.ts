import { Scheduler, Stream } from '@most/types'
import { runEffects, tap } from '@most/core'

import { VirtualEvent } from './types'
import { curry2 } from '@most/prelude'

export const collectEvents: CollectEventsFn = curry2(
  function collectEvents<A>(stream: Stream<A>, scheduler: Scheduler): Promise<ReadonlyArray<VirtualEvent<A>>> {
    const into: Array<VirtualEvent<A>> = []
    const s = tap((x) => into.push({ time: scheduler.now(), value: x }), stream)

    return runEffects(s, scheduler).then(() => into)
  },
)

export interface CollectEventsFn {
  <A>(stream: Stream<A>, scheduler: Scheduler): Promise<ReadonlyArray<VirtualEvent<A>>>
  <A>(stream: Stream<A>): (scheduler: Scheduler) => Promise<ReadonlyArray<VirtualEvent<A>>>
}
