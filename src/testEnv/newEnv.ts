import { newScheduler, newTimeline } from '@most/scheduler'

import { TestScheduler } from './types'
import { VirtualTimer } from './VirtualTimer'

export function newEnv(): TestScheduler {
  const timer = new VirtualTimer()

  return {
    tick: (n: number) => timer.tick(n),
    scheduler: newScheduler(timer, newTimeline()),
  }
}
