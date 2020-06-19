<p>
  <a href="https://www.npmjs.com/package/react-redux-dispatch-async">
  <img alt="npm version" src="https://badge.fury.io/js/react-redux-dispatch-async.svg"/></a>
  <a href="#hire-an-expert">
      <img src="https://img.shields.io/badge/%F0%9F%92%AA-hire%20an%20expert-brightgreen"/>
    </a>
<p>

# react-redux-dispatch-async

👉 Redux middleware to wait async actions with **fixed defined suffixes**.

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

### Usage

```tsx
import React from 'react'
import { useDispatchAsync } from 'react-redux-dispatch-async'

export default function MyUserInterface({ id }: { id: string }) {
  // 👉 pass action and arguments into the array
  const { status, result, error } = useDispatchAsync(getUserActionRequest, [id])

  switch (status) {
    case 'loading':
      return <AppLoader />
    case 'error':
      return <Text>{error.message}</Text>
    case 'success':
      return <User {...result} />
    case 'timeout':
      return <Text>{'timeout ¯\\_(ツ)_//¯'}</Text>
    default:
      return null
  }
}
```
If you need more examples you can go to [github](https://github.com/xcarpentier/react-redux-dispatch-async-example) or to [codesandbox](https://codesandbox.io/s/react-redux-dispatch-async-rij31?file=/src/UserContainer.tsx).

### Configuration

```ts
import { createStore, applyMiddleware } from 'redux'
import { createDispatchAsyncMiddleware } from 'react-redux-dispatch-async'
import reducers from 'reducers'

const store = createStore(
  reducers,
  applyMiddleware(
    createDispatchAsyncMiddleware({
      request: 'REQUEST', // 👈 define your own async suffixes
      success: 'SUCCESS',
      failure: 'FAILURE',
    }),
  ),
)
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

### Type

```ts
// main hook
type useDispatchAsync = <R = any>(
  actionFunction?: (...args: any[]) => Action<T>,
  deps: any[] = [],
) => UseDispatchAsync<R>

/// return type
export interface UseDispatchAsync<R = any> {
  status: 'loading' | 'success' | 'error'
  result?: R
  error?: Error
}

// other types for oldest usage
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

## Hire an expert!

Looking for a ReactNative freelance expert with more than 14 years experience? Contact me from my [website](https://xaviercarpentier.com)!
