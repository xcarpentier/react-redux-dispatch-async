<p>
  <a href="https://www.npmjs.com/package/react-redux-dispatch-async">
  <img alt="npm version" src="https://badge.fury.io/js/react-redux-dispatch-async.svg"/></a>
    <a href="https://www.npmjs.com/package/react-redux-dispatch-async"><img alt="npm downloads" src="https://img.shields.io/npm/dm/react-redux-dispatch-async.svg"/></a>
  <a href="#hire-an-expert">
      <img src="https://img.shields.io/badge/%F0%9F%92%AA-hire%20an%20expert-brightgreen"/>
    </a>
<p>

# react-redux-dispatch-async

👉 REDUX _middleware_ & **HOOK** 🎉 waiting async _actions_ with **SUFFIXES** 👈

```tsx
import React from 'react'
import { useDispatchAsync } from 'react-redux-dispatch-async'

export default function MyUserInterface({ id }: { id: string }) {
  // 👉 pass action and arguments into the array
  const response = useDispatchAsync(getUserActionRequest, [id])

  switch (response.status) {
    case 'loading':
      return <AppLoader />
    case 'error':
      return <Text>{response.error.message}</Text>
    case 'success':
      return <User {...response.result} />
    case 'timeout':
      return <Text>{'timeout ¯\\_(ツ)_//¯'}</Text>
    case 'canceled':
      return <Text>{'canceled ¯\\_(ツ)_//¯'}</Text>
    default:
      return null
  }
}
```

If you need more examples you can go to [github](https://github.com/xcarpentier/react-redux-dispatch-async-example) or to [codesandbox](https://codesandbox.io/s/react-redux-dispatch-async-rij31?file=/src/UserContainer.tsx).

## Install

`yarn add react-redux-dispatch-async`

## Features
```

      +------------------+
      | ACTION_REQUESTED |----+
      +------------------+    |      +------------------+
                              +----->| ACTION_SUCCEEDED |
                              |      +------------------+
                              |
                              |      +--------------------+
                              +----->|   ACTION_FAILED    |
                              |      +--------------------+
                              |
                              |      +--------------------+
                              +----->|  ACTION_CANCELED  |
                                     +--------------------+
```

### Race condition to execute only the promise if multiple update occur in nearly same time

[> Dig into it](https://github.com/xcarpentier/react-redux-dispatch-async/blob/master/src/useDispatchAsync.ts#L65)

### Hook give you helpful STATUS you can deal with into your own component

- ⏳ **`loading`**: action start but not yet completed
- 👏 **`success`**: action completed, you can get the result
- 😱 **`error`**: action failed and you can get the error
- 👎 **`timeout`**: action not completed for too long (ie. options?.timeoutInMilliseconds)
- 👋 **`canceled`**: action canceled
- 😮 **`unknown`**: should never happen

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
      cancel: 'CANCEL', // optional
    }),
  ),
)
```

## Default suffixes

- `[...]_REQUESTED`
- `[...]_SUCCEEDED`
- `[...]_FAILED`
- `[...]_CANCELED`

## Two functions

### Configuration

```ts
dispatchAsyncMiddleware: (c?: {
  request: string
  success: string
  failure: string
  cancel?: string
}) => redux.Middleware
```

### Type

```ts
// main hook
interface Options {
  timeoutInMilliseconds?: number
}
type useDispatchAsync = <R = any>(
  actionFunction?: (...args: any[]) => Action<T>,
  deps: any[] = [],
  options: Options = { timeoutInMilliseconds: 15000 }, // wait 15s
) => UseDispatchAsync<R>

/// return type
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

export type UseDispatchAsync<R = unknown> =
  | ResultLoading
  | ResultSuccess<R>
  | ResultError
  | ResultTimeout
  | ResultCancel
  | ResultUnknown

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
