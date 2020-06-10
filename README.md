<p>
  <a href="https://www.npmjs.com/package/react-redux-dispatch-async">
  <img alt="npm version" src="https://badge.fury.io/js/react-redux-dispatch-async.svg"/></a>
<p>

# react-redux-dispatch-async

A redux middleware to be able to wait async actions (ie. side effects) with fixed defined suffixes.

```
                                     +------------------+
                              +----->+ ACTION_SUCCEEDED +
                              |      +------------------+
      +------------------+    |
      + ACTION_REQUESTED +----+
      +------------------+    |
                              |      +------------------+
                              +----->+  ACTION_FAILED   +
                                     +------------------+
```

## Install

`yarn add react-redux-dispatch-async`

## Examples

### Configuration

```ts
import { createStore, applyMiddleware } from 'redux'
import { dispatchAsyncMiddleware } from 'react-redux-dispatch-async'
import reducers from 'reducers'

const store = createStore(
  reducers,
  applyMiddleware(
    dispatchAsyncMiddleware({
      request: 'REQUEST', // 👈 define or not your own async suffixes
      success: 'SUCCESS',
      failure: 'FAILURE',
    }),
  ),
)
```

### Usage

```tsx
import React from 'react'
import { useDispatchAsync } from 'react-redux-dispatch-async'

export default function MyUserInterface({ id }: { id: string }) {
  const { status, result } = useDispatchAsync(getUser, [id])

  switch (status) {
    case 'loading':
      return <AppLoader />
    case 'error':
      return <Text>Oops</Text>
    case 'success':
      return <User {...result} />
    default:
      return null
  }
}
```

## Default suffixes

- `[...]_REQUESTED`
- `[...]_SUCCEEDED`
- `[...]_FAILED`

## Two functions

### Configuration

```ts
dispatchAsyncMiddleware: (c?: {
  request: string
  success: string
  failure: string
}) => redux.Middleware
```

### Usage

```ts
// main hook
useDispatchAsync<T = any>(actionFunction?: (...args: any[]) => Action<T>, deps: any[] = []): UseDispatchAsyncUnion

/// types
interface UseDispatchAsyncStatusReturn {
  status: 'loading' | 'success' | 'error'
  result: any
}
type UseDispatchAsyncReturn = (
  action: Action,
) => ReturnType<typeof dispatchAsync>
type UseDispatchAsyncUnion =
  | UseDispatchAsyncReturn
  | UseDispatchAsyncStatusReturn
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
```
