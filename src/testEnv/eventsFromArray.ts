import { Stream } from '@most/types'
import { atTimes } from './atTimes'
import { curry2 } from '@most/prelude'

export const eventsFromArray: MakeEventsFromArrayFn =
  curry2(<A>(dt: number, a: Array<A>) =>
    atTimes(a.map((value, i) => ({ time: i * dt, value }))))

export interface MakeEventsFromArrayFn {
  <A>(dt: number, array: Array<A>): Stream<A>
  <A>(dt: number): (array: Array<A>) => Stream<A>
}

export const makeEvents: MakeEventsFn =
  curry2((dt: number, amount: number) =>
    eventsFromArray<number>(dt, Array.from(Array(amount), (_, i) => i)))

export interface MakeEventsFn {
  (dt: number, amount: number): Stream<number>
  (dt: number): (amount: number) => Stream<number>
}
