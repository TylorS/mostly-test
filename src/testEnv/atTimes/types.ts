import { ScheduledTask, Stream } from '@most/types'

import { VirtualEvent } from '../types'

export interface AtTimeFn {
  <A>(time: number, value: A): Stream<VirtualEvent<A>>
  (time: number): <A>(value: A) => Stream<VirtualEvent<A>>
}

export type TaskTime<A> =
  {
    tasks: ReadonlyArray<ScheduledTask>,
    time: number,
  }
