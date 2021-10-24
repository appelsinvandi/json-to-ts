export function isParsableObject(obj: object): obj is object | any[] {
  return typeof obj === 'object' && obj !== null
}
