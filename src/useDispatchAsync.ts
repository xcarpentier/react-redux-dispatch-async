import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { dispatchAsync } from './dispatchAsync'

interface ResultLoading {
  status: 'loading'
}

interface ResultSuccess<R = unknown> {
  status: 'success'
  result: R
}

interface ResultError {
  status: 'error'
  error: Error
}

interface ResultTimeout {
  status: 'timeout'
}

interface ResultUnknown {
  status: 'unknown'
}

export type UseDispatchAsync<R = unknown> =
  | ResultLoading
  | ResultSuccess<R>
  | ResultError
  | ResultTimeout
  | ResultUnknown

export type Status = Pick<UseDispatchAsync, 'status'>['status']

export interface Options {
  timeoutInMilliseconds?: number
}

// the hook
export function useDispatchAsync<R = any>(
  actionFunction: (...args: any[]) => Action & { payload: any },
  deps: any[] = [],
  options: Options = { timeoutInMilliseconds: 15000 }, // wait 15s
): UseDispatchAsync<R> {
  const dispatch = useDispatch()

  // 👉 Better flow with informative & useful return
  const [result, setResult] = useState<R | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [isTimeout, setIsTimeout] = useState<boolean>(false)

  useEffect(() => {
    const actionPromise = dispatchAsync<R>(dispatch, actionFunction(...deps))

    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), options?.timeoutInMilliseconds),
    )

    Promise.race([actionPromise, timeoutPromise])
      .then((res) => {
        if (typeof res !== 'boolean') {
          res.success ? setResult(res.result) : setError(res.error)
        } else {
          setIsTimeout(true)
        }
      })
      .catch((e) => {
        console.error('useDispatchAsync: Unexpected error', e)
        setError(e)
      })
  }, deps)

  const status: Status = useMemo(() => {
    if (!result && !error && !isTimeout) {
      return 'loading'
    }
    if (result) {
      return 'success'
    }

    if (error) {
      return 'error'
    }

    if (isTimeout) {
      return 'timeout'
    }

    return 'unknown'
  }, [result, error, isTimeout])

  switch (status) {
    case 'loading':
    case 'timeout':
      return { status }
    case 'success':
      return { result: result!, status }
    case 'error':
      return { error: error!, status }

    default:
      return { status: 'unknown' }
  }
}
