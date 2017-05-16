import { Disposable, ScheduledTask, Scheduler, Sink } from '@most/types'
import { propagateEndTask, propagateEventTask } from '@most/core'

import { TaskTime } from './types'
import { VirtualEvent } from '../types'
import { disposeWith } from '@most/disposable'

export const runEvents = <A>(events: Array<VirtualEvent<A>>, sink: Sink<A>, scheduler: Scheduler): Disposable => {
  const s = events.reduce(appendEvent(sink, scheduler), { tasks: [], time: 0 })
  const end = scheduler.delay(s.time, propagateEndTask(sink))

  return disposeWith(cancelAll, s.tasks.concat(end))
}

const appendEvent = <T, A extends VirtualEvent<T>>(sink: Sink<T>, scheduler: Scheduler) => ({ tasks, time }: TaskTime<A>, event: A) => {
  const task = scheduler.delay(event.time, propagateEventTask<T>(event.value, sink))

  return { tasks: tasks.concat(task), time: Math.max(time, event.time) }
}

const cancelAll = (tasks: Array<ScheduledTask>) => Promise.all(tasks.map(cancelOne))

const cancelOne = (task: ScheduledTask) => task.dispose()
