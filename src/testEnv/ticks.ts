import { Scheduler } from '@most/types'
import { newEnv } from './newEnv'

export function ticks(dt: number): Scheduler {
  const { tick, scheduler } = newEnv()

  tick(dt)

  return scheduler
}
