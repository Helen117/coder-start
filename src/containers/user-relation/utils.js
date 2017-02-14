/**
 * Created by Administrator on 2016-11-09.
 */
export function findUserGroupById(userGroupId,userTreeData) {
    let selectedUserGroup;
    const selectedGroup = userTreeData.map((item) => {
        if(item.id == userGroupId){
            return item;
        }else{
            return findUserGroupById(userGroupId,item.children);
        }
    });
    for(let i=0; i<selectedGroup.length; i++){
        if(selectedGroup[i]){
            selectedUserGroup = selectedGroup[i];
        }
    }
    return selectedUserGroup;
}

export function findUserIdByEmail(email,userInfoData) {
    for(let i=0; i<userInfoData.length; i++){
        if(email == userInfoData[i].email){
            return userInfoData[i].id
        }
    }
}

export function isAdmin(rolelist) {//查看登录人员的角色是否为管理员
    let is_admin = false;
    for(let i=0; i<rolelist.length; i++){
        if(rolelist[i] == 'admin'){
            is_admin = true;
        }
    }
    return is_admin;
}