import React, { useCallback } from 'react'
import shallow from 'zustand/shallow'

import { useOptionsStore } from '../../stores/optionsStore'
import styles from './OptionsPanel.module.scss'

export type OptionsPanelProps = {}
export const OptionsPanel: React.VFC<OptionsPanelProps> = ({}) => {
  const optionsStore = useOptionsStore((s) => s, shallow)

  const handleChangeOption = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      optionsStore.setOptions({ [e.target.dataset.option as keyof typeof optionsStore]: e.target.value })
    },
    [optionsStore.setOptions]
  )

  return (
    <div className={styles.root}>
      <select
        data-option={((): keyof typeof optionsStore => 'preferredTypeForUndeterminable')()}
        value={optionsStore.preferredTypeForUndeterminable}
        onChange={handleChangeOption}
      >
        <option value="any">any</option>
        <option value="unknown">unknown</option>
      </select>
    </div>
  )
}
