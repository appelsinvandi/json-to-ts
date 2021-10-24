export function compareStringsAlphanum(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base', usage: 'sort', numeric: true })
}
