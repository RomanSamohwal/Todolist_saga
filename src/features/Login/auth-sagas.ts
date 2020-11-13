import {call, put, takeEvery} from 'redux-saga/effects';
import {setAppStatusAC} from '../../app/app-reducer';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setIsLoggedInAC} from './auth-reducer';

export function* loginWorkerSaga(action: ReturnType<typeof login>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res = yield call(authAPI.login, action.data)
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(true))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield  handleServerAppError(res.data)
        }
    } catch (error) {
        yield handleServerNetworkError(error)
    }
}

export const login = (data: LoginParamsType) => ({type: 'login/LOGIN-IN', data})

export function* logoutWorkerSaga(action: ReturnType<typeof logout>) {
    yield put(setAppStatusAC('loading'))
    let res = yield call(authAPI.logout)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(false))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (error) {
        yield handleServerNetworkError(error)
    }
}

export const logout = () => ({type: 'login/LOGOUT'})

export function* loginWatcherSaga() {
    yield takeEvery('login/LOGIN-IN', loginWorkerSaga)
    yield takeEvery('login/LOGOUT', logoutWorkerSaga)
}
