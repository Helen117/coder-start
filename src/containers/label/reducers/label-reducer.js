/**
 * Created by helen on 2016/12/1.
 */

export default function label(state = {}, action = {}) {
    switch (action.type) {
        case 'EDIT_LABEL_PENDING':
            return {...state,pending:true};
        case 'EDIT_LABEL_SUCCESS':
            return {...state,editLabel: action.payload,editError: null,pending:false};
        case 'EDIT_LABEL_ERROR':
            return {...state,editLabel:null,editError: action.payload.errorMsg,pending:false};

        case 'FETCH_LABEL_PENDING':
            return {...state,fetchLabelPending:true};
        case 'FETCH_LABEL_SUCCESS':
            return {...state,labelInfo: action.payload,errors: null,fetchLabelPending:false};
        case 'FETCH_LABEL_ERROR':
            return {...state,labelInfo:null,errors: action.payload.errorMsg,fetchLabelPending:false};

        default:
            return state;
    }
}
