/**
 * Created by william.xu on 2016/9/4 10:19
 */
module.exports.menu ={
    "success": true,
    "errorCode": null,
    "errorMsg": null,
    "result": [
        {
            "id": 1,
            "parentId": 0,
            "cLevel": 1,
            "name": "首页",
            "link": "/home",
            "description": "",
            "icon": null,
            "subMenu": []
        },
        {
            "id": 2,
            "parentId": 0,
            "cLevel": 1,
            "name": "代码管理",
            "link": "",
            "description": "",
            "icon": null,
            "subMenu": [
                {
                    "id": 3,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "代码管理",
                    "link": "/project-mgr",
                    "description": "",
                    "icon": null,
                    "subMenu": [
                        {
                            "id": 6,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "项目",
                            "link": "/project-mgr/project-mgr-sub",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        },
                        {
                            "id": 7,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "项目代码",
                            "link": "/project-mgr/reg-test",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        },
                        {
                            "id": 8,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "里程碑管理",
                            "link": "/project-mgr/milestones",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        },
                        {
                            "id": 9,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "问题管理",
                            "link": "/project-mgr/issue",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        },
                        {
                            "id": 10,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "我的问题",
                            "link": "/project-mgr/myIssue",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        },
                        {
                            "id": 11,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "代码合并",
                            "link": "/project-mgr/mergeRequest",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        },
                        {
                            "id": 12,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "分支管理",
                            "link": "/project-mgr/branches",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        }
                    ]
                },
                {
                    "id": 4,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "代码质量管理",
                    "link": "",
                    "description": "",
                    "icon": null,
                    "subMenu": []
                },
                {
                    "id": 5,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "测试案例",
                    "link": "",
                    "description": "",
                    "icon": null,
                    "subMenu": []
                },
                {
                    "id": 13,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "项目集合",
                    "link": "/ProjectSetTree",
                    "description": "",
                    "icon": null,
                    "subMenu": [
                        {
                            "id": 14,
                            "parentId": 13,
                            "cLevel": 3,
                            "name": "项目集合信息",
                            "link": "/ProjectSetTree",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        },
                        {
                            "id": 15,
                            "parentId": 13,
                            "cLevel": 3,
                            "name": "项目集合里程碑",
                            "link": "/ProjectSetTree/Milestones",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        }
                    ]
                },
                {
                    "id": 16,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "人员组织关系",
                    "link": "",
                    "description": "",
                    "icon": null,
                    "subMenu": [
                        {
                            "id": 17,
                            "parentId": 16,
                            "cLevel": 3,
                            "name": "查看人员组织关系",
                            "link": "/userRelation",
                            "description": "",
                            "icon": null,
                            "subMenu": []
                        }
                    ]
                }
            ]
        }
    ]
};
