/**
 * Created by zhaojp on 2016/9/21.
 */
import _ from 'lodash';
import {
    CREATE_MILESTONES_SUCCESS,
    CREATE_MILESTONES_ERROR,
} from '../constants/create-milestones-action-types';

const initialState = {
    items: [],
};

export default function createMilestones(state = initialState, action = {}) {
    //console.log('action.type:',action.type);
    switch (action.type) {
        //获取里程碑
        case CREATE_MILESTONES_SUCCESS:
            console.log('action.payload',action.payload);
            return Object.assign({}, initialState, {items: action.payload});

        case CREATE_MILESTONES_ERROR:
            //console.log("CREATE milestones error!");
            return {
                ...state,
                errors: action.payload.message
            };
        
        default:
            return state;
    }
}
