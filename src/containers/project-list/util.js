/**
 * Created by Administrator on 2016-11-03.
 */
export function searchGroupByGroupId(groupId,treeData){
    var groupInfo={};
    for(var i=0;i<treeData.length;i++){
        for(var j=0;j<treeData[i].children.length;j++){
            if(groupId == treeData[i].children[j].id){
                groupInfo = treeData[i].children[j];
                return groupInfo;
            }
        }
    }
    return groupInfo;
}

export function findProjectIdByProjectName(projectName,groupInfo) {
    var projectId;
    for(var i=0;i<groupInfo.children.length;i++){
        if(projectName == groupInfo.children[i].name){
            projectId = groupInfo.children[i].id;
            return projectId;
        }
    }
}

export function resetGroupInfoState(groupInfo,resetData) {//修改项目后，更新项目组state
    for(let i=0; i<groupInfo.children.length; i++){
        if(resetData.id == groupInfo.children[i].id.substr(0,groupInfo.children[i].id.length-2)){
            groupInfo.children[i].name = resetData.name;
            groupInfo.children[i].description = resetData.description;
            groupInfo.children[i].visibility_level = resetData.visibility_level;
            return groupInfo;
        }
    }
}

export function comfirmRoleId(user_id,projectMembers) {
    if(projectMembers.length == 0){
        return false;
    }
    for(let i=0; i<projectMembers.length; i++){
        if(projectMembers[i].id && user_id == projectMembers[i].id){
            if(projectMembers[i].role == 40 || projectMembers[i].role == 50){
                return true;
            }
        }
    }
    return false;
}
