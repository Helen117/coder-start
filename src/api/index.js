import Api from './api';

const api = new Api({
    ciBaseURI: 'http://10.10.152.144:13000/jenkins',
    //baseURI: '/gitlab',
    baseURI: 'http://10.10.152.144:11000/gitlab',
    //baseURI: 'http://10.10.156.3:11000/gitlab',

    headers: {
        //'Accept': 'application/json',
        'Accept': '*/*',
        //'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json; charset=utf-8'
        //'x-access-token': window.localStorage.getItem('token')
    }
});

export default api;