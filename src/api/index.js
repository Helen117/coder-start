import Api from './api';

const api = new Api({
    baseURI: 'http://10.10.152.144:11000/gitlab',
//    ciBaseURI: 'http://10.10.152.144:13000/jenkins',
    ciBaseURI: 'http://localhost:13000',
    //baseURI: '/gitlab',
    //baseURI: 'http://10.10.156.3:11000/gitlab',
//    ciBaseURI: 'http://10.10.152.144:13000',
    //ciBaseURI: 'http://localhost:13000',

    headers: {
        //'Accept': 'application/json',
        'Accept': '*/*',
        //'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json; charset=utf-8'
        //'x-access-token': window.localStorage.getItem('token')
    }
});

export default api;