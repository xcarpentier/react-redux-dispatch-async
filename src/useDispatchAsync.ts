import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { dispatchAsync } from './dispatchAsync'

export interface Status {
  status: 'loading' | 'success' | 'error'
}
export interface UseDispatchAsyncStatusReturnLoading extends Status {}
export interface UseDispatchAsyncStatusReturnSuccess<R = any> extends Status {
  result: R
}
export interface UseDispatchAsyncStatusReturnError extends Status {
  error: Error
}
export type UseDispatchAsyncStatusReturn<R = any> =
  | UseDispatchAsyncStatusReturnLoading
  | UseDispatchAsyncStatusReturnSuccess<R>
  | UseDispatchAsyncStatusReturnError
export type UseDispatchAsyncReturn = (
  action: Action,
) => ReturnType<typeof dispatchAsync>
export type UseDispatchAsyncUnion =
  | UseDispatchAsyncReturn
  | UseDispatchAsyncStatusReturn

// the hook
export function useDispatchAsync<R = any>(
  actionFunction?: (...args: any[]) => Action,
  deps: any[] = [],
): UseDispatchAsyncUnion {
  const dispatch = useDispatch()

  if (!actionFunction) {
    // ♻️ Return the `dispatchAsync` function to keep older package API & prevent breaking changes
    return (action: Action) => dispatchAsync<R>(dispatch, action)
  }

  // 👉 Better flow with informative & useful return
  const [result, setResult] = useState<R | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    dispatchAsync<R>(dispatch, actionFunction(...deps))
      .then((res) =>
        res.success ? setResult(res.result) : setError(res.error),
      )
      .catch((e) => {
        console.error('useDispatchAsync: Unexpected error', e)
        setError(e)
      })
  }, deps)

  return {
    status: !!(result || error) ? 'loading' : result ? 'success' : 'error',
    result,
    error,
  }
}
