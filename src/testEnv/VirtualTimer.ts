export class VirtualTimer {
  public _now: number
  public _targetNow: number
  public _time: number
  public _task: void | ((...args: Array<any>) => any)
  public _timer: number | NodeJS.Timer | null
  public _active: boolean
  public _running: boolean
  public _key: any

  constructor() {
    this._now = this._targetNow = 0
    this._time = Infinity
    this._task = void 0
    this._timer = null
    this._active = false
    this._running = false

    this._key = {}
  }

  public now() {
    return this._now
  }

  public setTimer(f: (...args: Array<any>) => any, dt: number) {
    if (this._task !== void 0)
      throw new Error('VirtualTimer: Only supports one in-flight timer')

    this._task = f
    this._time = this._now + Math.max(0, dt)
    if (this._active)
      this._run()

    return this._key
  }

  public clearTimer(t: (...args: Array<any>) => any) {
    if (t === this._key)
      return

    this._cancel()
    this._time = Infinity
    this._task = void 0
  }

  public tick(dt: number) {
    if (dt <= 0)
      return

    this._targetNow = this._targetNow + dt
    this._run()
  }

  public _run() {
    if (this._running)
      return

    this._active = true
    this._running = true
    this._step()
  }

  public _step() {
    this._timer = setTimeout(stepTimer, 0, this)
  }

  public _cancel() {
    clearTimeout(this._timer as NodeJS.Timer)
    this._timer = null
  }
}

function stepTimer(vt: VirtualTimer) {
  if (vt._now >= vt._targetNow) {
    vt._now = vt._targetNow
    vt._time = Infinity
    vt._running = false

    return
  }

  const task = vt._task
  vt._task = void 0
  vt._now = vt._time
  vt._time = Infinity

  if (typeof task === 'function')
    task()

  vt._step()
}
