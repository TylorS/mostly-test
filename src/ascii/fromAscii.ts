import { Disposable, Scheduler, Sink, Stream } from '@most/types'
import { propagateEndTask, propagateErrorTask, propagateEventTask } from '@most/core'

import { disposeAll } from '@most/disposable'

/**
 * Given an ascii diagram creates a stream of values over time
 * Optionally takes a Record of values to create a stream of particular values
 * @example
 * import { fromAscii } from '@mostly/test
 *
 * const stream: Stream<string> = fromAscii('-a-b-c-|')
 * // or
 * const stream: Stream<number> = fromAscii('-a-b-c-|', { a: 1, b: 2, c: 3 })
 */
export function fromAscii(ascii: string): Stream<string>
export function fromAscii<A>(ascii: string, values: Record<string, A> & { error?: Error }): Stream<A>
export function fromAscii<A>(ascii: string, values?: Record<string, A> & { error?: Error }): Stream<A> {
  return new Ascii<A>(ascii, values)
}

class Ascii<A> implements Stream<A> {
  private ascii: string
  private values: Record<string, A> & { error?: Error }

  constructor(ascii: string, values: Record<string, A> & { error?: Error } = {}) {
    this.ascii = ascii
    this.values = values
  }

  public run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    const { ascii, values } = this

    const disposables: Array<Disposable> = []

    for (let i = 0; i < ascii.length; ++i) {
      const character = ascii[i]

      // time
      if (character === '-') continue

      // end -- no events occur after end
      if (character === '|')
        return disposeAll(disposables.concat([ scheduler.delay(i + 1, propagateEndTask(sink)) ]))

      // error -- no events occur after error
      if (character === '#') {
        const error = values.error || new Error(character)

        return disposeAll(disposables.concat([ scheduler.delay(i + 1, propagateErrorTask(error, sink)) ]))
      }

      // events
      const value = values.hasOwnProperty(character) ? values[character] : character

      const scheduledTask = scheduler.delay(i + 1, propagateEventTask(value, sink))

      disposables.push(scheduledTask)
    }

    return disposeAll(disposables)
  }
}
