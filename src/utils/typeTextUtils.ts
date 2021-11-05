import { useOptionsStore } from '../stores/optionsStore'
import { JsonTypeDefinition } from '../type/JsonTypeDefTypes'
import { compareStringsAlphanum } from './compareUtils'

export function generateTypesFromTree(
  tree: JsonTypeDefinition,
  options: Pick<ReturnType<typeof useOptionsStore['getState']>, 'preferredTypeForUndeterminable'>
): string {
  if (tree.type === 'object') {
    if (tree.children == null || tree.children.length === 0) {
      return '{}'
    } else {
      return (
        '{' +
        tree.children
          .sort(({ key: a }, { key: b }) => compareStringsAlphanum(a, b))
          .map(({ key, type, optional }) => ["'" + key + "'", generateTypesFromTree(type, options)].join(optional ? '?: ' : ': '))
          .join('; ') +
        '}'
      )
    }
  } else if (tree.type === 'array') {
    const processedChildren =
      tree.children != null ? dedup(tree.children.map((e) => generateTypesFromTree(e, options))) : null
    if (processedChildren == null || processedChildren.length === 0) {
      return `${options.preferredTypeForUndeterminable}[]`
    } else {
      if (processedChildren.length === 1) {
        return `${processedChildren[0]}[]`
      } else {
        return '(' + processedChildren.join(' | ') + ')[]'
      }
    }
  } else if (tree.type === 'combination') {
    return dedup(tree.children.map((e) => generateTypesFromTree(e, options))).join(' | ')
  } else {
    return tree.type
  }
}

function dedup(arr: string[]) {
  return Array.from(new Set(arr))
}
