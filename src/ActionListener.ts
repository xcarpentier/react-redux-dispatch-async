import { Action } from 'redux'

const createId = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9)

export type Listener<T = any> = (action: Action & { payload: T }) => void

export const listeners: { [id: string]: Listener } = {}

export const addActionListener = <T>(newListener: Listener<T>) => {
  const listenerId = createId()
  listeners[listenerId] = newListener
  return () => delete listeners[listenerId]
}
