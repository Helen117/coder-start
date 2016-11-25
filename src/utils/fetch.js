

export default function fetchData(url,params,callback,errStr) {
   const baseURI = 'http://10.10.152.144:11000/gitlab';
    //const baseURI = 'http://10.10.156.181:11000/gitlab'
    url = baseURI+url;
    const opts = {
        method: 'post',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        mode: 'cors', // same-origin|no-cors（默认）|cors(允许不同域的请求，但要求有正确的CORs应答头信息，比如Access-Control-Allow-Origin)
        credentials: 'omit'//omit（默认，不带cookie）|same-origin(同源带cookie)|include(总是带cookie)
    };

    if (params) {
        let queryString = '';
        for (let param in params){
            queryString += (param+'='+params[param]+'&');
        }
        opts.body = queryString;
    }

     return fetch(url, opts).then ( function (res) {
        if(res.ok){
            return res.json().then(function(json) {
                if (json.success) {
                    if(json.result){
                        callback();
                    }else{
                        callback(errStr);
                    }

                }else{
                    callback(json.errorMsg);
                }
            })

        }
    }).catch(function (error) {});
}