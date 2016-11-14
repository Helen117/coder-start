/**
 * Created by Administrator on 2016-11-09.
 */
export function findUserGroupById(userGroupId,userTreeData) {
    let selectedUserGroup;
    let selectedGroup = userTreeData.map((item) => {
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