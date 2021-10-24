import React, { useCallback } from 'react'

import { useInputStore } from '../../stores/inputStore'
import styles from './InputPanel.module.scss'

type InputPanelProps = {}
export const InputPanel: React.VFC<InputPanelProps> = () => {
  const [input, setInput] = useInputStore((s) => [s.input, s.setInput])

  const handleInputChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    (e) => {
      setInput(e.target.value)
    },
    [setInput]
  )

  return (
    <div className={styles.root}>
      <textarea className={styles.input} value={input} onChange={handleInputChange} />
    </div>
  )
}
