import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Action } from 'redux'
import { dispatchAsync, DispatchAsyncResult } from './dispatchAsync'

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

interface ResultCancel {
  status: 'canceled'
}

interface ResultTimeout {
  status: 'timeout'
}

interface ResultUnknown {
  status: 'unknown'
}

type CompatActionResult<R> = (action: Action) => Promise<DispatchAsyncResult<R>>

export type UseDispatchAsync<R = unknown> =
  | ResultLoading
  | ResultSuccess<R>
  | ResultError
  | ResultTimeout
  | ResultCancel
  | ResultUnknown

export type Status = Pick<UseDispatchAsync, 'status'>['status']

export interface Options {
  timeoutInMilliseconds?: number
}

type InnerPromiseType = Promise<boolean | DispatchAsyncResult>

// the hook
export function useDispatchAsync<R = any>(
  actionFunction?: (...args: any[]) => Action & { payload: any },
  deps: any[] = [],
  options: Options = { timeoutInMilliseconds: 15000 }, // wait 15s
): UseDispatchAsync<R> | CompatActionResult<R> {
  const dispatch = useDispatch()

  // 👉 backward compatibility
  if (!actionFunction) {
    return (action: Action) => dispatchAsync<R>(dispatch, action)
  }

  // 👉 Better flow with informative & useful return
  const [result, setResult] = useState<R | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [isTimeout, setIsTimeout] = useState<boolean>(false)
  const [isCancel, setIsCancel] = useState<boolean>(false)

  // 👉 race condition to get last update
  // https://sebastienlorber.com/handling-api-request-race-conditions-in-react
  // A ref to store the last issued pending request
  const lastPromise = useRef<InnerPromiseType>()

  useEffect(() => {
    const actionPromise = dispatchAsync<R>(dispatch, actionFunction(...deps))

    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), options?.timeoutInMilliseconds),
    )

    const currentPromise = Promise.race([actionPromise, timeoutPromise])

    lastPromise.current = currentPromise

    currentPromise
      .then((res) => {
        // filtering last update promise
        if (currentPromise === lastPromise.current) {
          // filtering timeout
          if (typeof res !== 'boolean') {
            // filtering success
            if (res.success) {
              setResult(res.result)
            } else {
              if (!res.canceled) {
                setError(res.error)
              } else {
                setIsCancel(true)
              }
            }
          } else {
            setIsTimeout(true)
          }
        }
      })
      .catch((e) => {
        if (currentPromise === lastPromise.current) {
          console.error('useDispatchAsync: Unexpected error', e)
          setError(e)
        }
      })
  }, deps)

  const status: Status = useMemo(() => {
    if (!result && !error && !isTimeout && !isCancel) {
      return 'loading'
    }

    if (result) {
      return 'success'
    }

    if (isCancel) {
      return 'canceled'
    }

    if (error) {
      return 'error'
    }

    if (isTimeout) {
      return 'timeout'
    }

    return 'unknown'
  }, [result, error, isTimeout, isCancel])

  switch (status) {
    case 'loading':
    case 'timeout':
    case 'canceled':
      return { status }
    case 'success':
      return { result: result!, status }
    case 'error':
      return { error: error!, status }

    default:
      return { status: 'unknown' }
  }
}
