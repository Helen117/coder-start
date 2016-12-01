/**
 * Created by helen on 2016/12/1.
 */

export default function label(state = {}, action = {}) {
    switch (action.type) {
        case 'EDIT_LABEL_PENDING':
            return Object.assign({}, {pending:true});
        case 'EDIT_LABEL_SUCCESS':
            return Object.assign({}, {editLabel: action.payload,errors: null});
        case 'EDIT_LABEL_ERROR':
            return Object.assign({},{editLabel:null,errors: action.payload.errorMsg});
        default:
            return state;
    }
}
