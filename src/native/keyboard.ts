import { useEffect, useState } from 'react'
import { Keyboard, Platform } from 'react-native'

/** Whether the keyboard is on the screen (#935): iOS tells before it moves, Android after. */
export function useKeyboardShown(): boolean {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const ios = Platform.OS === 'ios'
    const subs = [
      Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () => setShown(true)),
      Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setShown(false)),
    ]
    return () => {
      for (const s of subs) s?.remove?.()
    }
  }, [])
  return shown
}
