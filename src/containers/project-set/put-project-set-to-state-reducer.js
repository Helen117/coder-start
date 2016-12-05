/**
 * Created by zhaojp on 2016/10/25.
 */
/**
 * Created by Administrator on 2016-09-29.
 */
import {
    PUT_PROJECT_SET_TO_STATE
} from './constants/project-set-action-types';

const initialState = {
};

export default function projectSetToState(state = initialState, action = {}) {

    switch (action.type) {
        case PUT_PROJECT_SET_TO_STATE:
            return Object.assign({}, initialState, {selectedProjectSet: action.payload.data});
        default:
            return state;
    }
}
