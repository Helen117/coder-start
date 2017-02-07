/**
 * Created by helen on 2016/9/20.
 */
export function checkName(rule, value, callback){
    var reg = /^[\u4e00-\u9fa5]{2,4}$/;
    if(!reg.test(value)){
        callback('中文名为两到四个汉字');
    }else{
        callback();
    }
}

export function checkNameSpace(rule, value, callback){//校验字符串不以空格开头和结尾
    const reg_name = /(^\s)|(\s$)/;
    if(value && reg_name.test(value)){
        callback('不能以空格开头和结尾!');
    }else{
        callback();
    }
}