import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { dispatchAsync } from './dispatchAsync'

export function useDispatchAsync(action: Action) {
  const dispatch = useDispatch()
  return dispatchAsync(dispatch, action)
}
