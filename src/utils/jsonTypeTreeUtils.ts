import { JsonSimpleTypes, JsonTypeDefinition } from '../type/JsonTypeDefTypes'
import { isParsableObject } from './jsonTypeGuards'

export function generateTypeTreeFromObject(obj: object | any[]): JsonTypeDefinition {
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return {
        type: 'array',
      }
    }
    return {
      type: 'array',
      children: obj.map((e) => {
        if (isParsableObject(e)) {
          return generateTypeTreeFromObject(e)
        } else if (e === null) {
          return { type: 'null' }
        } else {
          return {
            type: typeof e as JsonSimpleTypes,
            value: e,
          }
        }
      }),
    }
  }

  const entries = Object.entries(obj)
  if (entries.length === 0) {
    return {
      type: 'object',
    }
  } else {
    return {
      type: 'object',
      children: entries.map<{ key: string; type: JsonTypeDefinition; optional: boolean }>(([key, value]) => {
        if (isParsableObject(value)) {
          return {
            key,
            type: generateTypeTreeFromObject(value),
            optional: false,
          }
        } else if (value === null) {
          return {
            key,
            type: { type: 'null' },
            optional: false,
          }
        } else {
          return {
            key,
            type: {
              type: typeof value as JsonSimpleTypes,
              value,
            },
            optional: false,
          }
        }
      }),
    }
  }
}

export function combineTypeTrees(a: JsonTypeDefinition, b: JsonTypeDefinition): JsonTypeDefinition {
  if (a.type === 'object') {
    if (b.type === 'object') {
      if ((a.children == null || a.children.length === 0) && (b.children == null || b.children.length === 0)) {
        return { type: 'object' }
      }

      if (a.children == null || a.children.length === 0) {
        return { type: 'object', children: b.children!.map((e) => ({ ...e, optional: true })) }
      }
      if (b.children == null || b.children.length === 0) {
        return { type: 'object', children: a.children!.map((e) => ({ ...e, optional: true })) }
      }

      return {
        type: 'object',
        children: Array.from(new Set([...a.children.map(({ key }) => key), ...b.children.map(({ key }) => key)])).map<
          typeof a.children[number]
        >((key) => {
          const aValue = a.children!.find(({ key: key2 }) => key2 === key)
          const bValue = b.children!.find(({ key: key2 }) => key2 === key)

          if (aValue == null) return { ...bValue!, optional: true }
          if (bValue == null) return { ...aValue!, optional: true }

          return {
            key,
            type: combineTypeTrees(aValue.type, bValue.type),
            optional: false,
          }
        }),
      }
    } else {
      return {
        type: 'combination',
        children: [a, b],
      }
    }
  } else if (a.type === 'array') {
    if (b.type === 'array') {
      if ((a.children == null || a.children.length === 0) && (b.children == null || b.children.length === 0)) {
        return { type: 'array' }
      }

      if (a.children == null || a.children.length === 0) {
        return { type: 'array', children: b.children! }
      }
      if (b.children == null || b.children.length === 0) {
        return { type: 'array', children: a.children! }
      }

      return {
        type: 'array',
        children: a.children.concat(b.children),
      }
    } else {
      return {
        type: 'combination',
        children: [a, b],
      }
    }
  } else if (a.type !== b.type) {
    return {
      type: 'combination',
      children: [a, b],
    }
  } else {
    return a
  }
}

export function combineManyTypeTrees(trees: JsonTypeDefinition[]): JsonTypeDefinition {
  if (trees.length === 1) return trees[0]

  return trees.slice(1).reduce((acc, curr) => combineTypeTrees(acc, curr), trees[0])
}
