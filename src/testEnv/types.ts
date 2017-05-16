import { Scheduler } from '@most/types'

export type TestScheduler =
  {
    tick: (n: number) => void,
    scheduler: Scheduler,
  }

export type VirtualEvent<A> =
  {
    time: number,
    value: A,
  }
