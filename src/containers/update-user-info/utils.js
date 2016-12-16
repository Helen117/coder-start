/**
 * Created by Administrator on 2016-12-02.
 */
export function findEmailByUserId(userId,allUser) {
    for(let i=0; i<allUser.length; i++){
        if(userId == allUser[i].id){
            let email = allUser[i].email;
            return email;
        }
    }
}