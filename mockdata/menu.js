/**
 * Created by william.xu on 2016/9/4 10:19
 */
 add
 add
 add
 add
 add
 add
module.exports.menu ={
    "success":true,
    "errorCode":null,
    "errorMsg":null,
    "result":
        [
            {"id":1,"parentId":0,"cLevel":1,"name":"首页","link":"/home","description":"","icon":null,"subMenu":[]},
            {"id":2,"parentId":0,"cLevel":1,"name":"代码管理","link":"","description":"","icon":null,
                "subMenu":[{"id":3,"parentId":2,"cLevel":2,"name":"代码管理","link":"/project-mgr","description":"","icon":null,
                    "subMenu":[{"id":6,"parentId":3,"cLevel":3,"name":"项目","link":"/project-mgr/project-mgr-sub","description":"","icon":null,"subMenu":[]},
                        {"id":7,"parentId":3,"cLevel":3,"name":"项目代码","link":"/project-mgr/code-file","description":"","icon":null,"subMenu":[]},
                        {"id":8,"parentId":3,"cLevel":3,"name":"里程碑管理","link":"/project-mgr/milestones","description":"","icon":null,"subMenu":[]},
                        {"id":9,"parentId":3,"cLevel":3,"name":"问题管理","link":"/project-mgr/issue","description":"","icon":null,"subMenu":[]},
                        {"id":11,"parentId":3,"cLevel":3,"name":"代码合并","link":"/project-mgr/mergeRequest","description":"","icon":null,"subMenu":[]},
                        {"id":12,"parentId":3,"cLevel":3,"name":"分支管理","link":"/project-mgr/branches","description":"","icon":null,"subMenu":[]}
                        ]},
                    {"id":13,"parentId":2,"cLevel":2,"name":"项目集合","link":"/projectSetTree","description":"","icon":null,
                        "subMenu":[{"id":14,"parentId":13,"cLevel":3,"name":"项目集合信息","link":"/projectSetTree/projectSetInfo","description":"","icon":null,"subMenu":[]},
                            {"id":15,"parentId":13,"cLevel":3,"name":"项目集合里程碑","link":"/projectSetTree/projectSetMilestones","description":"","icon":null,"subMenu":[]},
                            {"id":20,"parentId":13,"cLevel":3,"name":"需求管理","link":"/projectSetTree/request","description":"","icon":null,"subMenu":[]},
                            {"id":23,"parentId":13,"cLevel":3,"name":"标签管理","link":"/label","description":"","icon":null,"subMenu":[]}
                            ]},
                    {"id":18,"parentId":2,"cLevel":2,"name":"项目编译","link":"","description":"","icon":null,
                        "subMenu":[{"id":19,"parentId":18,"cLevel":3,"name":"编译发布","link":"/project-mgr/project-compile","description":"","icon":null,"subMenu":[]},
                            {"id":22,"parentId":18,"cLevel":3,"name":"查看编译历史","link":"/project-mgr/project-build-history","description":"","icon":null,"subMenu":[]}
                            ]}
                    ]},
            {"id":10,"parentId":0,"cLevel":1,"name":"我的问题","link":"/myIssue","description":"","icon":null,"subMenu":[]},
            {"id":16,"parentId":0,"cLevel":1,"name":"人员组织关系","link":"/userRelation","description":"","icon":null,"subMenu":[]},
            {"id":25,"parentId":0,"cLevel":1,"name":"我的待确认事项","link":"/approveList","description":"","icon":null,"subMenu":[]},
            {"id":26,"parentId":0,"cLevel":1,"name":"个人信息","link":"/updateUserInfo","description":"","icon":null,"subMenu":[]}
        ]
};


