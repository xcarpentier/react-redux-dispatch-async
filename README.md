# redux-dispatch-async

A redux middleware to be able to wait async actions with fixed defined suffixes

## Default suffixes

- `[...]_REQUESTED`
- `[...]_SUCCEEDED`
- `[...]_FAILED`

## Configuration

```ts
import { createStore, applyMiddleware } from 'redux'
import { DispatchAsyncMiddleware } from 'redux-dispatch-async'
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

## Usage

```tsx
import React, { useEffect, useState } from 'react'
import { dispatchAsync } from 'redux-dispatch-async'
import { useSelector, useDispatch } from 'react-redux'

export default function MyUserInterface() {
  const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()
  const data = useSelector(state => state.data)
  useEffect(() => {
    dispatchAsync(dispatch, loadRequest()).then(() => setLoaded(true))
  }, [])
  return loaded ? <AnotherComponent {...{ data }} /> : <AppLoader />
}
```
