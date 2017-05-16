export function time(amount: number): string {
  let n = ''

  for (let i = 0; i < amount; ++i)
    n += '-'

  return n
}
