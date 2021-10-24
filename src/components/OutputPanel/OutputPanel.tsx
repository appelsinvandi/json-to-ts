import json5 from 'json5'
import React from 'react'
import shallow from 'zustand/shallow'

import { useInputStore } from '../../stores/inputStore'
import { useOptionsStore } from '../../stores/optionsStore'
import { isParsableObject } from '../../utils/jsonTypeGuards'
import { combineManyTypeTrees, generateTypeTreeFromObject } from '../../utils/jsonTypeTreeUtils'
import { generateTypesFromTree } from '../../utils/typeTextUtils'
import styles from './OutputPanel.module.scss'

type OutputPanelProps = {}
export const OutputPanel: React.VFC<OutputPanelProps> = () => {
  const input = useInputStore((s) => s.input)
  const options = useOptionsStore((s) => s, shallow)

  const types = generateTypes(input, options)

  return <div className={styles.root}>{types}</div>
}

function generateTypes(input: string, options: ReturnType<typeof useOptionsStore['getState']>): string {
  try {
    const splitInputs = input.split('\n-----\n')
    const parsedInputs = splitInputs.map((e) => json5.parse(e)).filter(isParsableObject)
    if (parsedInputs.length === 0) return ''

    const typeTree = combineManyTypeTrees(parsedInputs.map((e) => generateTypeTreeFromObject(e)))
    console.log(typeTree)
    const types = generateTypesFromTree(typeTree, options)
    console.log(types)
    const formattedTypes = 'type Root = ' + types

    return formattedTypes
  } catch (e) {
    console.log(e)
    return ''
  }
}
