import { ref } from 'vue'

// global state, created in module scope
const globalState = ref({})

export function useStore() {
  // local state, created per-component
  const localState= ref({})

  function setGlobalState(newobj) {
    globalState.value = newobj    
  }

  function addGlobalState(newobj) {
    globalState.value = {...globalState.value, newobj }    
  }

  function setLocalState(newobj) {
    localState.value = newobj    
  }

  function addLocalState(newobj) {
    localState.value = {...localState.value, newobj }    
  }

  return {
    setGlobalState,
    setLocalState,
    addGlobalState,
    addLocalState,
    globalState,
    localState
  }
}