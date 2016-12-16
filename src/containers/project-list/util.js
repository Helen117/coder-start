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

export function searchUserGroupByProjectId(projectId,treeData) {
    let groupInfo;
    for(var i=0;i<treeData.length;i++){
        for(var j=0;j<treeData[i].children.length;j++){
            var project_cat = treeData[i].children[j];
            for(var k=0; k<project_cat.children.length; k++){
                let _projectId = project_cat.children[k].id;
                if(projectId == _projectId.substr(0,_projectId.length-2)){
                    if((project_cat.id>0)||(project_cat.id.indexOf("_g")>0)){
                        groupInfo = project_cat;
                        return groupInfo;
                    }else{
                        continue;
                    }
                }
            }
        }
    }
}

export function searchNormalGroupByProjectId(projectId,treeData){
    var projectInfo='',groupInfo='';
    for(var i=0;i<treeData.length;i++){
        for(var j=0;j<treeData[i].children.length;j++){
            var project_cat = treeData[i].children[j];
            for(var k=0; k<project_cat.children.length; k++){
                if(projectId == project_cat.children[k].id){
                    projectInfo = project_cat.children[k];
                    if((project_cat.id>0)||(project_cat.id.indexOf("_g")>0)){
                        groupInfo = project_cat;
                        return {projectInfo,groupInfo}
                    }else{
                        groupInfo = searchUserGroupByProjectId(projectId.substr(0,projectId.length-2),treeData);
                        return {projectInfo,groupInfo}
                    }
                }
            }
        }
    }
    return {projectInfo,groupInfo}
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

export function findProjectIdByTreedata(projectName,treeData) {
    var projectId;
    for(var i=0;i<treeData.length;i++){
        for(var j=0;j<treeData[i].children.length;j++){
            var project_cat = treeData[i].children[j];
            for(var k=0; k<project_cat.children.length; k++){
                if(projectName == project_cat.children[k].name){
                    projectId = project_cat.children[k].id;
                }
            }
        }
    }
    return projectId;
}

export function findMyConsernProject(treeData){
    let starList;
    for(let i=0; i<treeData[0].children.length; i++){
        if(treeData[0].children[i].name == "我关注的"){
            starList = treeData[0].children[i].children;
            return starList;
        }
    }
}

export function isConserned(loginInfo,projectMembers,starList,projectInfo) {
    var count=0, count2=0;
    for(var i=0; i<projectMembers.projectMembers.length; i++){
        if(loginInfo.username == projectMembers.projectMembers[i].username){
            count2++;//当前用户是此项目下成员
        }
    }
    for(var j=0;j<starList.length;j++){
        var project_id = projectInfo.id;
        if(project_id.substr(0,project_id.length-2) == starList[j].id.substr(0,starList[j].id.length-2)){
            count++;
        }
    }
    if(count == 0 && count2 == 0){//未关注
        var consern_desc = "关注";
    }else if(count != 0 && count2 == 0){//已关注
        var consern_desc = "取消关注";
    }else{//项目成员
        var consern_desc = "项目成员禁止取关";
    }
    return consern_desc;
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
        if(user_id == projectMembers[i].id){
            if(projectMembers[i].role == 40 || projectMembers[i].role == 50){
                return true;
            }
        }
    }
    return false;
}
