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
                              |      +---------------+
                              +----->+ ACTION_FAILED +
                                     +---------------+
```

## Install

`yarn add react-redux-dispatch-async`

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
useDispatchAsync(action: Action): Promise<DispatchAsyncResult<any>>
```

## Return types

```ts
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

## Examples

### Configuration

```ts
import { createStore, applyMiddleware } from 'redux'
import { dispatchAsyncMiddleware } from 'redux-dispatch-async'
import reducers from 'reducers'

const store = createStore(
  reducers,
  applyMiddleware(
    dispatchAsyncMiddleware({
      request: 'REQUEST',
      success: 'SUCCESS',
      failure: 'FAILURE',
    }),
  ),
)
```

### Usage

```tsx
import React, { useEffect, useState } from 'react'
import { useDispatchAsync } from 'redux-dispatch-async'
import { useSelector, useDispatch } from 'react-redux'

export default function MyUserInterface() {
  const [loaded, setLoaded] = useState(false)

  const data = useSelector(state => state.data)
  const dispatchAsync = useDispatchAsync()
  const otherActionAsync = useDispatchAsync(otherAction())
  useEffect(() => {
    dispatchAsync(loadRequest())
      .then(() => otherActionAsync())
      .then(() => setLoaded(true))
  }, [])
  return loaded ? <AnotherComponent {...{ data }} /> : <AppLoader />
}
```
