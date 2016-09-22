/**
 * Created by helen on 2016/9/18.
 */
const initialState = {
    userExists:null,
    registering: false,
    registerResult: null,
    errors: null
};

export default function register(state = initialState, action = {}) {
    switch (action.type) {
        case 'REGISTER_PENDING':
            return Object.assign({}, initialState, {registering: true});
        case 'REGISTER_SUCCESS':
            return Object.assign({}, initialState, {registerResult: action.payload, registering: false, errors: null});
        case 'REGISTER_ERROR':
            return Object.assign({}, initialState, {registerResult: action.payload, registering: false, errors: action.payload.errorMsg});
        case 'USEREXISTS_SUCCESS':
            return Object.assign({}, initialState, {userExists: action.payload});
        default:
            return state;
    }
}