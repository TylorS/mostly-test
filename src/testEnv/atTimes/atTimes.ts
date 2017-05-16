import { Disposable, Scheduler, Sink, Stream } from '@most/types'

import { AtTimeFn } from './types'
import { VirtualEvent } from '../types'
import { curry2 } from '@most/prelude'
import { disposeNone } from '@most/disposable'
import { runEvents } from './runEvents'

export const atTime: AtTimeFn =
  curry2(<A>(time: number, value: A) => atTimes([ { time, value } ]))

export const atTimes = <A>(array: Array<VirtualEvent<A>>) => new AtTimes<A>(array)

export class AtTimes<A> implements Stream<A> {
  private events: Array<VirtualEvent<A>>

  constructor(array: Array<VirtualEvent<A>>) {
    this.events = array
  }

  public run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.events.length === 0
      ? disposeNone()
      : runEvents<A>(this.events, sink, scheduler)
  }
}
