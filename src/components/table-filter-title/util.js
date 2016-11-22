/**
 * Created by Administrator on 2016-11-22.
 */
export function findFilterIndex(array,data) {
    for(let i=0; i<array.length; i++){
        if(array[i].filterKey == data){
            return i;
        }
    }
}