import { renderHook } from '@testing-library/react-hooks'
import * as React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { all, delay, put, takeEvery } from 'redux-saga/effects'
import { createDispatchAsyncMiddleware } from './DispatchAsyncMiddleware'
import { useDispatchAsync } from './useDispatchAsync'

const getUserRequest = (id: string) => ({
  type: 'GET_USER_REQUESTED',
  payload: id,
})

const getUserSuccess = ({ id, name }: { id: string; name: string }) => ({
  type: 'GET_USER_SUCCEEDED',
  payload: { id, name },
})

const loadUsersRequest = () => ({
  type: 'LOAD_USERS_REQUESTED',
  payload: undefined,
})

const loadUsersFailure = (error: Error) => ({
  type: 'LOAD_USERS_FAILED',
  payload: error,
})

const ReduxProvider = ({
  children,
  store,
}: {
  store: any
  children: React.ReactNode
}) => <Provider {...{ store }}>{children}</Provider>

const sagaMiddleware = createSagaMiddleware()
const loggerMiddleware = createLogger({
  level: {
    prevState: false,
    nextState: false,
  },
})
const dispatchAsyncMiddleware = createDispatchAsyncMiddleware()

const testStore = createStore(
  (state) => state,
  applyMiddleware(sagaMiddleware, loggerMiddleware, dispatchAsyncMiddleware),
)

sagaMiddleware.run(function*() {
  yield all([
    takeEvery('GET_USER_REQUESTED', function*({ payload: id }: any) {
      yield delay(1000)
      yield put(getUserSuccess({ id, name: 'Xavier' }))
    }),
    takeEvery('LOAD_USERS_REQUESTED', function*() {
      yield delay(1000)
      yield put(loadUsersFailure(new Error('load user failed')))
    }),
  ])
})

const wrapper = ({ children }: { children?: React.ReactNode }) => (
  <ReduxProvider {...{ store: testStore }}>{children}</ReduxProvider>
)

test('should return success status', async () => {
  const { result, wait } = renderHook(
    () => useDispatchAsync<{ id: string; name: string }>(getUserRequest, ['1']),
    { wrapper },
  )
  expect(result.current.status).toBe('loading')
  await wait(() => result.current.status !== 'loading')
  expect(result.current.status).toBe('success')
  expect(result.current.result).toEqual({ id: '1', name: 'Xavier' })
})

test('should return error status', async () => {
  const { result, wait } = renderHook(
    () => useDispatchAsync<{ id: string; name: string }>(loadUsersRequest),
    { wrapper },
  )
  expect(result.current.status).toBe('loading')
  await wait(() => result.current.status !== 'loading')
  expect(result.current.status).toBe('error')
  expect(result.current.error?.message).toBe('load user failed')
})
