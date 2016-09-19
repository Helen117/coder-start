//import superagent from 'superagent';
//import 'whatwg-fetch';
import fetch from 'isomorphic-fetch';//考虑使用fetch

const methods = [
    'get',
    'head',
    'post',
    'put',
    'del',
    'options',
    'patch'
];

class _Api {
    constructor(opts) {
        this.opts = opts || {};

        if (!this.opts.baseURI)
            throw new Error('baseURI option is required');

        methods.forEach(method =>
            this[method] = (path, {params, data, callback} = {}) => new Promise((resolve, reject) => {
                let url = this.opts.baseURI + path;
                if (path.indexOf('http://') == 0){
                    url = path;
                }


                const opts = {
                    method: method,
                    mode: 'cors', // same-origin|no-cors（默认）|cors(允许不同域的请求，但要求有正确的CORs应答头信息，比如Access-Control-Allow-Origin)
                    credentials: 'include'//omit（默认，不带cookie）|same-origin(同源带cookie)|include(总是带cookie)
                };
                if (this.opts.headers) {
                    opts.headers = this.opts.headers;
                }
                if (data){
                    opts.body = JSON.stringify(data);
                }
                if (params) {
                    opts.body = params;
                }
                fetch(url, opts).then(function (res) {
                    if(res.ok){
                        return res.json().then(function(json) {
                            if (json.success == undefined){
                                return resolve(json);
                            }else{
                                if (json.success){
                                    return resolve(json.result);
                                }else{
                                    return reject({
                                        errorCode: json.errorCode,
                                        errorMsg: json.errorMsg
                                    });
                                }
                            }
                        });
                    } else {
                        return reject({
                            errorCode: res.status,
                            errorMsg: res.statusText
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });




                // const request = superagent[method](url);
                // if (params) {
                //     request.query(params);
                // }
                // if (this.opts.headers) {
                //     request.set(this.opts.headers);
                // }
                // if (data) {
                //     request.send(data);
                // }
                // if (callback) {
                //     request.end(function (err, res) {
                //         if (res.ok){
                //             callback();
                //         }
                //     })
                // } else {
                //     //request.end((err, {body} = {}) => err ? reject(body || err) : resolve(body));
                //     request.end(
                //         (err, {body} = {}) => {
                //             if (err){
                //                 return reject(body || err);
                //             }else{
                //                 if (body.success == undefined){
                //                     return resolve(body);
                //                 }else{
                //                     if (body.success){
                //                         return resolve(body.result);
                //                     }else{
                //                         return reject({
                //                             errorCode: body.errorCode,
                //                             errorMsg: body.errorMsg
                //                         })
                //                     }
                //                 }
                //             }
                //         }
                //     );
                // }


            })
        )
    }

}

const Api = _Api;

export default Api
