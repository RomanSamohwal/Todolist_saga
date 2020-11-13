import {call, put, takeEvery} from 'redux-saga/effects';
import {GetTasksResponse, todolistsAPI} from '../../api/todolists-api';
import {setAppStatusAC} from '../../app/app-reducer';
import {AxiosResponse} from 'axios';
import {removeTaskAC, setTasksAC} from './tasks-reducer';

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<GetTasksResponse> = yield call(todolistsAPI.getTasks, action.todolistId)
    const tasks = res.data.items
    yield put(setTasksAC(tasks, action.todolistId))
    yield put(setAppStatusAC('succeeded'))

}

export const fetchTasks = (todolistId: string) => ({type: 'TASKS/FETCH-TASKS', todolistId})

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTasks>) {
    yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
    yield put(removeTaskAC(action.taskId, action.todolistId))
}

export const removeTasks = (todolistId: string, taskId: string) => ({type: 'TASK/REMOVE-TASK', todolistId, taskId})

export function* tasksWatcherSaga() {
    yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga)
    yield takeEvery('TASK/REMOVE-TASK', removeTaskWorkerSaga)
}