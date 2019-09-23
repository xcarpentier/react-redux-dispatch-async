import { Middleware, Action } from 'redux'
import { listeners } from './ActionListener'

export interface ActionSuffix {
    request: string
    success: string
    failure: string
}

export const ConfigMiddleware: {
    suffixes: ActionSuffix
    initialized: boolean
} = {
    initialized: false,
    suffixes: {
        request: 'REQUESTED',
        success: 'SUCCEEDED',
        failure: 'FAILED',
    },
}

const isAsyncAction = (config: ActionSuffix, action: Action) =>
    action.type.endsWith(config.request) ||
    action.type.endsWith(config.success) ||
    action.type.endsWith(config.failure)

export const dispatchAsyncMiddleware: (c?: ActionSuffix) => Middleware = (
    config?: ActionSuffix,
) => () => next => action => {
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
