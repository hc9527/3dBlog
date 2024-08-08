import { onBeforeUnmount } from 'vue'

export function useWindowListener(event_name: string, callback: (e: any) => void, options?: any) {
  const listener = (ev: Event) => {
    callback(ev)
  }
  window.addEventListener(event_name, listener, options)
  onBeforeUnmount(() => {
    window.removeEventListener(event_name, listener)
  })
}