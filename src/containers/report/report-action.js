/**
 * Created by helen on 2016/12/27.
 */
import api from '../../api';
export function fetchToDoList() {
    return {
        type: 'FETCH_TO_DO_LIST',
        payload: {
            promise: api.post('/project/fork-list')
        }
    }
}