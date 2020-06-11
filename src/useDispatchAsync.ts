import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { dispatchAsync } from './dispatchAsync'

export interface UseDispatchAsync<R = any> {
  status: 'loading' | 'success' | 'error'
  result?: R
  error?: Error
}

// the hook
export function useDispatchAsync<R = any>(
  actionFunction: (...args: any[]) => Action & { payload: any },
  deps: any[] = [],
): UseDispatchAsync<R> {
  const dispatch = useDispatch()

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

  const status = useMemo(
    () => (!result && !error ? 'loading' : result ? 'success' : 'error'),
    [result, error],
  )
  return { status, result, error }
}
