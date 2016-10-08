/**
 * Created by zhaojp on 2016/10/8.
 */
import {MORE_MILESTONES_SUCCESS,
    MORE_MILESTONES_PENDING,
    MORE_MILESTONES_ERROR
} from '../constants/more-milestones-action-type';

const initialState = {
};

export default function moreMilestonesData(state = initialState, action = {}) {
    switch (action.type) {
        case MORE_MILESTONES_PENDING:
            return Object.assign({}, initialState, {actionType:action.type});

        case MORE_MILESTONES_SUCCESS:
            return Object.assign({}, initialState, {moreData: action.data,actionType:action.type});

        case MORE_MILESTONES_ERROR:
            return {
                ...state,
                errors: action.errMessage
            };
        default:
            return state;
    }
}