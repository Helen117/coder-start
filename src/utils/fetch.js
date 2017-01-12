

export default function fetchData(url, params,callback,handleResult) {
    const baseURI = 'http://10.10.147.190:11000/gitlab';
    //const baseURI = 'http://10.10.156.23:11000/gitlab'


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

     fetch(url, opts).then ( function (res) {
        if(res.ok){
            return res.json().then(function(json) {
                if (json.success) {
                    handleResult(json.result,callback)
                }else{
                    return json.errorMsg
                    //callback('调用结果失败：'+json.errorMsg);
                }
            })

        }
    }).catch(function (error) {});
}