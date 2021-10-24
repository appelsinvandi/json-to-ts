import create from 'zustand'
import { combine, persist } from 'zustand/middleware'

export const useInputStore = create(
  persist(
    combine(
      {
        input: '' as string,

        _hydrated: false,
      },
      (set) => ({
        setInput: (input: string) => set({ input }),

        _setHydrated: () => set({ _hydrated: true }),
      })
    ),
    {
      name: 'json_to_ts:inputStore',
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
