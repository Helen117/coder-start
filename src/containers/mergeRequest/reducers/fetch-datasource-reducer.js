/**
 * Created by zhaojp on 2016/10/8.
 */
import _ from 'lodash';
import {
    FETCH_NAMESPACE_PENDING,
    FETCH_NAMESPACE_SUCCESS,
    FETCH_NAMESPACE_ERROR,

    FETCH_DATA_PENDING,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_ERROR
} from '../constants/action-types';


const initialState = {
    items: [],
};

export default function fetchMergeData(state = initialState, action = {}) {
    //console.log('action.type:',action.type);
    switch (action.type) {
        case FETCH_DATA_PENDING:
            return Object.assign({}, initialState, {loading: true});
        //获取里程碑
        case FETCH_DATA_SUCCESS:
            return Object.assign({}, initialState, {milestones: action.payload.milestones,members:action.payload.members,labels:action.payload.labels,fetchErrors: null});

        //console.log('action.payload',action.payload);

        case FETCH_DATA_ERROR:
            //console.log("acquire milestones error!");
            return Object.assign({}, initialState, {milestones:null,members:null,labels:null, fetchErrors: action.payload.errorMsg});

        default:
            return state;
    }
}