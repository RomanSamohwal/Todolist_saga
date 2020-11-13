import {call, put, takeEvery} from 'redux-saga/effects';
import {GetTasksResponse, todolistsAPI} from '../../api/todolists-api';
import {setAppStatusAC} from '../../app/app-reducer';
import {addTaskAC, removeTaskAC, setTasksAC} from './tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';


export function* addTaskWorkerSaga(action: ReturnType<typeof addTask>) {
    put(setAppStatusAC('loading'))
    try {
        const res = yield call( todolistsAPI.createTask,action.todolistId, action.title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            const action = addTaskAC(task)
            yield put(action)
            yield put(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data);
        }
    } catch (error) {
        handleServerNetworkError(error)
    }
}

export const addTask = (title: string, todolistId: string) => ({type: 'TASK/ADD-TASK', title,todolistId })

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const data: GetTasksResponse = yield call(todolistsAPI.getTasks, action.todolistId)
    const tasks = data.items
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
    yield takeEvery('TASK/ADD-TASK', addTaskWorkerSaga)
}