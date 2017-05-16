import { Stream } from '@most/types'
import { VirtualEvent } from './types'
import { collectEvents } from './collectEvents'
import { curry2 } from '@most/prelude'
import { ticks } from './ticks'

export const collectEventsFor: CollectEventsFor =
  curry2(<A>(nticks: number, stream: Stream<A>) =>
    collectEvents(stream, ticks(nticks)))

export interface CollectEventsFor {
  <A>(dt: number, stream: Stream<A>): Promise<ReadonlyArray<VirtualEvent<A>>>
  <A>(dt: number): (stream: Stream<A>) => Promise<ReadonlyArray<VirtualEvent<A>>>
}
