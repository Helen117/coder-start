/**
 * Created by william.xu on 2016/9/4 10:19
 */
module.exports.menu ={
    "success":true,"errorCode":null,"errorMsg":null,
    "result":[{"id":1,"parentId":0,"cLevel":1,"name":"首页","link":"/home","description":"","icon":"home","subMenu":[]},
        {"id":2,"parentId":0,"cLevel":1,"name":"代码管理","link":"","description":"","icon":"code-o",
            "subMenu":[{"id":3,"parentId":2,"cLevel":2,"name":"项目","link":"","description":"","icon":null,
                "subMenu":[{"id":30,"parentId":3,"cLevel":3,"name":"项目信息","link":"/project-mgr/project-mgr-sub","description":"","icon":null,"subMenu":[]},
                    {"id":31,"parentId":3,"cLevel":3,"name":"里程碑管理","link":"/project-mgr/milestones","description":"","icon":null,"subMenu":[]},
                    {"id":32,"parentId":3,"cLevel":3,"name":"问题管理","link":"/project-mgr/issue","description":"","icon":null,"subMenu":[]}
                    ]},
                {"id":13,"parentId":2,"cLevel":2,"name":"项目集合","link":"/projectSetTree","description":"","icon":null,
                    "subMenu":[{"id":14,"parentId":13,"cLevel":3,"name":"项目集合信息","link":"/projectSetTree/projectSetInfo","description":"","icon":null,"subMenu":[]},
                        {"id":15,"parentId":13,"cLevel":3,"name":"项目集合里程碑","link":"/projectSetTree/projectSetMilestones","description":"","icon":null,"subMenu":[]},
                        {"id":20,"parentId":13,"cLevel":3,"name":"需求管理","link":"/projectSetTree/request","description":"","icon":null,"subMenu":[]},
                        {"id":23,"parentId":13,"cLevel":3,"name":"标签管理","link":"/label","description":"","icon":null,"subMenu":[]}
                        ]},
                {"id":29,"parentId":2,"cLevel":2,"name":"代码管理","link":"/project-mgr","description":"","icon":null,
                    "subMenu":[{"id":7,"parentId":29,"cLevel":3,"name":"项目代码","link":"/project-mgr/code-file","description":"","icon":null,"subMenu":[]},
                        {"id":11,"parentId":29,"cLevel":3,"name":"代码合并","link":"/project-mgr/mergeRequest","description":"","icon":null,"subMenu":[]},
                        {"id":12,"parentId":29,"cLevel":3,"name":"分支管理","link":"/project-mgr/branches","description":"","icon":null,"subMenu":[]}
                        ]}
                ]},
        {"id":10,"parentId":0,"cLevel":1,"name":"我的问题","link":"/myIssue","description":"","icon":"question-circle-o","subMenu":[]},
        {"id":25,"parentId":0,"cLevel":1,"name":"我的待确认事项","link":"/approveList","description":"","icon":"message","subMenu":[]},
        {"id":27,"parentId":0,"cLevel":1,"name":"系统管理","link":"","description":"","icon":"windows-o",
            "subMenu":[{"id":16,"parentId":27,"cLevel":2,"name":"人员组织关系","link":"/userRelation","description":"","icon":"","subMenu":[]},
                {"id":26,"parentId":27,"cLevel":2,"name":"个人信息","link":"/updateUserInfo","description":"","icon":"","subMenu":[]}
                ]},
        {"id":28,"parentId":0,"cLevel":1,"name":"项目编译","link":"","description":"","icon":"line-chart",
            "subMenu":[{"id":19,"parentId":28,"cLevel":3,"name":"编译发布","link":"/project-mgr/project-compile","description":"","icon":null,"subMenu":[]},
                {"id":22,"parentId":28,"cLevel":3,"name":"查看编译历史","link":"/project-mgr/project-build-history","description":"","icon":null,"subMenu":[]},
                {"id":34,"parentId":28,"cLevel":3,"name":"编译发布2","link":"/project-mgr/project-compile2","description":"","icon":null,"subMenu":[]}
                ]},
        {"id":33,"parentId":0,"cLevel":1,"name":"报表","link":"","description":"","icon":"bar-chart",
            "subMenu":[{"id":35,"parentId":33,"cLevel":2,"name":"业务范畴视角查看报表","link":"/projectSetTree/businessDemandReport","description":"","icon":null,"subMenu":[]},
                {"id":36,"parentId":33,"cLevel":2,"name":"团队视角查看报表","link":"/projectSetTree/teamMemberDemandProportion","description":"","icon":null,"subMenu":[]},
                {"id":37,"parentId":33,"cLevel":2,"name":"管理统计视角查看报表","link":"/projectSetTree/manageViewDemandRank","description":"","icon":null,"subMenu":[]}
                ]}
        ]};


