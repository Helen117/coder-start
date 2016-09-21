import Api from './api';

const api = new Api({
    //baseURI: 'http://10.10.156.110:11000',
    baseURI: '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-access-token': window.localStorage.getItem('token')
    }
});

export default api;
