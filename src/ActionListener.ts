import { Action } from 'redux'

const createId = () =>
    '_' +
    Math.random()
        .toString(36)
        .substr(2, 9)

export type Listener = (action: Action) => void

export const listeners: { [id: string]: Listener } = {}

export const addActionListener = (newListener: Listener) => {
    const listenerId = createId()
    listeners[listenerId] = newListener
    return () => delete listeners[listenerId]
}
