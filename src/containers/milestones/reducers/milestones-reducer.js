/**
 * Created by zhaojp on 2016/9/14.
 */
import _ from 'lodash';
import {
    ACQUIRE_MILESTONES_SUCCESS,
    ACQUIRE_MILESTONES_PENDING,
    ACQUIRE_MILESTONES_ERROR,
} from '../constants/milestones-action-types';

const initialState = {
    items: [],
    loading:false,
    loadErrors:null,
    acquireData:false
};

export default function milestones(state = initialState, action = {}) {
    //console.log('action.type:',action.type);
    switch (action.type) {
        case ACQUIRE_MILESTONES_PENDING:
            return Object.assign({}, initialState, {loading: true});
        //获取里程碑
        case ACQUIRE_MILESTONES_SUCCESS:
            return Object.assign({}, initialState, {items: action.payload, loading: false,acquireData:true});

        case ACQUIRE_MILESTONES_ERROR:
            //console.log("acquire milestones error!");
            return {state, loadErrors: action.payload.errorMsg};

        default:
            return state;
    }
}
