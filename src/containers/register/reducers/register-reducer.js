/**
 * Created by helen on 2016/9/18.
 */
const initialState = {
};

export  function register(state = initialState, action = {}) {
    switch (action.type) {
        case 'REGISTER_PENDING':
            return Object.assign({}, initialState, {registering: true});
        case 'REGISTER_SUCCESS':
            return Object.assign({}, initialState, {registerResult: action.payload, registering: false, errors: null});
        case 'REGISTER_ERROR':
            return Object.assign({}, initialState, {registerResult: action.payload, registering: false, errors: action.payload.errorMsg});

        case 'GET_ALL_USER_SUCCESS':
            return Object.assign({}, initialState, {users: action.payload});
        default:
            return state;
    }
}

export  function getLeaderInfo(state = initialState, action = {}) {

    switch (action.type) {

        case 'GET_LEADER_SUCCESS':
            return Object.assign({}, initialState, {leader: action.payload});

        default:
            return state;
    }
}