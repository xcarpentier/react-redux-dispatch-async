import { Action, Middleware } from 'redux'
import { listeners } from './ActionListener'

export interface NormalSuffix {
  request: string
  success: string
  failure: string
}

export interface CancelableSuffix {
  request: string
  success: string
  failure: string
  cancel: string
}

export type ActionSuffix = NormalSuffix | CancelableSuffix

export const ConfigMiddleware: {
  suffixes: ActionSuffix
  initialized: boolean
} = {
  initialized: false,
  suffixes: {
    request: 'REQUESTED',
    success: 'SUCCEEDED',
    failure: 'FAILED',
    cancel: 'CANCELED',
  },
}

const isAsyncAction = (config: ActionSuffix, action: Action) =>
  action.type.endsWith(config.request) ||
  action.type.endsWith(config.success) ||
  action.type.endsWith(config.failure) ||
  action.type.endsWith((config as CancelableSuffix).cancel)

export const createDispatchAsyncMiddleware: (
  config?: ActionSuffix,
) => Middleware = (config?: ActionSuffix) => () => (next) => (action) => {
  try {
    if (config && !ConfigMiddleware.initialized) {
      ConfigMiddleware.suffixes = config
      ConfigMiddleware.initialized = true
    }

    if (
      isAsyncAction(ConfigMiddleware.suffixes, action) &&
      Object.keys(listeners).length > 0
    ) {
      for (const listener of Object.values(listeners)) {
        listener(action)
      }
    }
  } catch (error) {
    console.error(error)
  }
  return next(action)
}
