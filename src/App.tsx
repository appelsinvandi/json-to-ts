import React from 'react'

import styles from './App.module.scss'
import { InputPanel } from './components/InputPanel/InputPanel'
import { OptionsPanel } from './components/OptionsPanel/OptionsPanel'
import { OutputPanel } from './components/OutputPanel/OutputPanel'

export const App: React.VFC = () => {
  return (
    <div className={styles.root}>
      <OptionsPanel />
      <InputPanel />
      <OutputPanel />
    </div>
  )
}
