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
            "iconUrl": null,
            "subMenu": []
        },
        {
            "id": 2,
            "parentId": 0,
            "cLevel": 1,
            "name": "代码管理",
            "link": "",
            "description": "",
            "iconUrl": null,
            "subMenu": [
                {
                    "id": 3,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "代码管理",
                    "link": "/project-mgr",
                    "description": "",
                    "iconUrl": null,
                    "subMenu": [
                        {
                            "id": 6,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "项目",
                            "link": "/project-mgr",
                            "description": "",
                            "iconUrl": null,
                            "subMenu": []
                        },
                        {
                            "id": 7,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "项目代码",
                            "link": "/project-mgr/code-file",
                            "description": "",
                            "iconUrl": null,
                            "subMenu": []
                        },
                        {
                            "id": 8,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "里程碑管理",
                            "link": "/project-mgr/milestones",
                            "description": "",
                            "iconUrl": null,
                            "subMenu": []
                        },
                        {
                            "id": 9,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "问题管理",
                            "link": "/project-mgr/issue",
                            "description": "",
                            "iconUrl": null,
                            "subMenu": []
                        },
                        {
                            "id": 10,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "我的问题",
                            "link": "/project-mgr/myIssue",
                            "description": "",
                            "iconUrl": null,
                            "subMenu": []
                        },
                        {
                            "id": 11,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "MR管理",
                            "link": "/project-mgr/mergeRequest",
                            "description": "",
                            "iconUrl": null,
                            "subMenu": []
                        },
                        {
                            "id": 12,
                            "parentId": 3,
                            "cLevel": 3,
                            "name": "分支管理",
                            "link": "/project-mgr/branches",
                            "description": "",
                            "iconUrl": null,
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
                    "iconUrl": null,
                    "subMenu": []
                },
                {
                    "id": 5,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "测试案例",
                    "link": "",
                    "description": "",
                    "iconUrl": null,
                    "subMenu": []
                },
                {
                    "id": 13,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "虚拟组管理",
                    "link": "/virtual-group-mr",
                    "description": "",
                    "iconUrl": null,
                    "subMenu": [
                        {
                            "id": 14,
                            "parentId": 13,
                            "cLevel": 3,
                            "name": "虚拟组",
                            "link": "/virtual-group-mr",
                            "description": "",
                            "iconUrl": null,
                            "subMenu": []
                        }
                    ]
                }
            ]
        }
    ]
};
