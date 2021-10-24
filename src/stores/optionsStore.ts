import create from 'zustand'
import { combine, persist } from 'zustand/middleware'

export const useOptionsStore = create(
  persist(
    combine(
      {
        typeOrInterface: 'type' as 'type' | 'interface',
        splitOrCombined: 'combined' as 'split' | 'combined',
        sortProperties: 'alphanum' as 'alphanum' | 'none',
        preferredTypeForUndeterminable: 'unknown' as 'unknown' | 'any',
        defaultArrayType: 'array' as 'array' | 'tuple',

        _hydrated: false,
      },
      (set) => ({
        setOptions: (options: Omit<Parameters<typeof set>[0], '_hydrated'>) => set(options),

        _setHydrated: () => set({ _hydrated: true }),
      })
    ),
    {
      name: 'json_to_ts:optionsStore',
      version: 1,
      getStorage: () => localStorage,
      partialize: (s) => Object.fromEntries(Object.entries(s).filter(([k]) => !k.startsWith('_'))),
      onRehydrateStorage: (stateBeforeHydration) => {
        return (stateAfterHydration, hydrationError) => {
          stateAfterHydration?._setHydrated()
        }
      },
    }
  )
)
