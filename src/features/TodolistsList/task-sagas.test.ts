import {fetchTasksWorkerSaga} from './tasks-sagas';
import {call, put} from 'redux-saga/effects';
import {setAppStatusAC} from '../../app/app-reducer';
import {GetTasksResponse, MeResponseType, TaskPriorities, TaskStatuses, todolistsAPI} from '../../api/todolists-api';
import {setTasksAC} from './tasks-reducer';


let meResponse: MeResponseType;

beforeEach(() => {
    meResponse = {
        resultCode: 0,
        data: {
            email: '',
            login: '',

            id: 1
        },
        messages: []
    }

})

test('fetchTasksWorkerSaga success flow', () => {
    let todolistId = 'todolistId';
    const gen = fetchTasksWorkerSaga({type: '', todolistId: todolistId})
    let result = gen.next()
    expect(result.value).toEqual(put(setAppStatusAC('loading')))

    result = gen.next()
    expect(result.value).toEqual(call(todolistsAPI.getTasks, todolistId))

    const fakeApiResponse: GetTasksResponse = {
        error: '',
        items: [  { id: "1", title: "CSS",
            status: TaskStatuses.New,
            todoListId: "todolistId1",
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low }],
        totalCount: 1
    }
    result = gen.next(fakeApiResponse)
    expect(result.value).toEqual(put(setTasksAC(fakeApiResponse.items, todolistId)))
    result = gen.next()
    expect(result.value).toEqual( put(setAppStatusAC('succeeded')))
})


