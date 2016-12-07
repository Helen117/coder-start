/**
 * Created by Administrator on 2016-12-02.
 */
export function findEmailByUserId(userId,allUser) {
    for(let i=0; i<allUser.length; i++){
        if(userId == allUser[i].id){
            /*let index = allUser[i].email.indexOf('@');
            let email = allUser[i].email.substr(0,index);
            return email;*/
            return allUser[i].email;
        }
    }
}