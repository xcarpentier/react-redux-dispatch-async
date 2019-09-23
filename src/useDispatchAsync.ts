import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { dispatchAsync } from './dispatchAsync'

export function useDispatchAsync(action?: Action) {
  const dispatch = useDispatch()
  if (action) {
    return () => dispatchAsync(dispatch, action)
  }
  return (action: Action) => dispatchAsync(dispatch, action)
}
