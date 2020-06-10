import { Action } from 'redux'
import { addActionListener } from './ActionListener'
import { ConfigMiddleware } from './DispatchAsyncMiddleware'

interface DispatchAsyncResultSuccess<T = any> {
  success: true
  result: T
}

interface DispatchAsyncResultError {
  success: false
  error: Error
}

export type DispatchAsyncResult<T = any> =
  | DispatchAsyncResultSuccess<T>
  | DispatchAsyncResultError

export function dispatchAsync<T = any>(
  dispatch: (a: Action) => void,
  action: Action,
): Promise<DispatchAsyncResult<T>> {
  return new Promise((resolve) => {
    const actionNameBase = action.type.replace(
      `_${ConfigMiddleware.suffixes.request}`,
      '',
    )
    const unsubscribe = addActionListener((resultAction: Action) => {
      if (
        resultAction.type ===
        `${actionNameBase}_${ConfigMiddleware.suffixes.success}`
      ) {
        resolve({
          success: true,
          result: (resultAction as any).payload,
        })
        unsubscribe()
      } else if (
        resultAction.type ===
        `${actionNameBase}_${ConfigMiddleware.suffixes.failure}`
      ) {
        const error =
          (resultAction as any).payload instanceof Error
            ? (resultAction as any)
            : new Error(`Action failure: ${actionNameBase}`)
        resolve({ success: false, error })
        unsubscribe()
      }
    })
    dispatch(action)
  })
}
