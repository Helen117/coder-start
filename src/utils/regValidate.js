/**
 * Created by helen on 2016/9/20.
 */
export function checkName(rule, value, callback){
    var reg = new RegExp('/^[\u4e00-\u9fa5]$/');
    if(!reg.test(value)){
        callback('请正确填写姓名！姓名为两到四个汉字');
    }else{
        callback();
    }
}