/**
 * Created by william.xu on 2016/9/4 10:19
 */
module.exports.menu = {
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
            "subMenu": []
        },
        {
            "id": 2,
            "parentId": 0,
            "cLevel": 1,
            "name": "代码管理",
            "link": "",
            "description": "",
            "subMenu": [
                {
                    "id": 6,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "代码管理",
                    "link": "/project-mgr",
                    "description": "",
                    "subMenu": [
                        {
                            "id": 7,
                            "parentId": 6,
                            "cLevel": 3,
                            "name": "项目代码",
                            "link": "/project-mgr",
                            "description": "",
                            "subMenu": []
                        },
                        {
                            "id": 13,
                            "parentId": 6,
                            "cLevel": 3,
                            "name": "里程碑管理",
                            "link": "/project-mgr/milestones",
                            "description": "",
                            "subMenu": []
                        },
                        {
                            "id": 14,
                            "parentId": 6,
                            "cLevel": 3,
                            "name": "问题管理",
                            "link": "/project-mgr/issue",
                            "description": "",
                            "subMenu": []
                        }
                    ]
                },
                {
                    "id": 11,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "测试案例",
                    "link": "/project-mgr/milestones",
                    "description": "",
                    "subMenu": []
                },
                {
                    "id": 12,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "代码质量管理",
                    "link": "/project-mgr/issue",
                    "description": "",
                    "subMenu": [{
                        "id": 15,
                        "parentId": 12,
                        "cLevel": 3,
                        "name": "项目代码",
                        "link": "/project-mgr",
                        "description": "",
                        "subMenu": []
                    },{
                        "id": 16,
                        "parentId": 12,
                        "cLevel": 3,
                        "name": "问题管理",
                        "link": "/project-mgr/issue",
                        "description": "",
                        "subMenu": []
                    }]
                }
            ]
        },{
            "id": 3,
            "parentId": 0,
            "cLevel": 1,
            "name": "代码管理-1",
            "link": "",
            "description": "",
            "subMenu": [
                {
                    "id": 4,
                    "parentId": 3,
                    "cLevel": 2,
                    "name": "代码管理-1",
                    "link": "/project-mgr",
                    "description": "",
                    "subMenu": [
                        {
                            "id": 20,
                            "parentId": 4,
                            "cLevel": 3,
                            "name": "项目代码-1",
                            "link": "/project-mgr",
                            "description": "",
                            "subMenu": []
                        },
                        {
                            "id": 21,
                            "parentId": 4,
                            "cLevel": 3,
                            "name": "里程碑管理-1",
                            "link": "/project-mgr/milestones",
                            "description": "",
                            "subMenu": []
                        },
                        {
                            "id": 22,
                            "parentId": 4,
                            "cLevel": 3,
                            "name": "问题管理-1",
                            "link": "/project-mgr/issue",
                            "description": "",
                            "subMenu": []
                        }
                    ]
                },
                {
                    "id": 11,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "测试案例",
                    "link": "/project-mgr/milestones",
                    "description": "",
                    "subMenu": []
                },
                {
                    "id": 12,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "代码质量管理",
                    "link": "/project-mgr/issue",
                    "description": "",
                    "subMenu": [{
                        "id": 15,
                        "parentId": 12,
                        "cLevel": 3,
                        "name": "项目代码",
                        "link": "/project-mgr",
                        "description": "",
                        "subMenu": []
                    },{
                        "id": 16,
                        "parentId": 12,
                        "cLevel": 3,
                        "name": "问题管理",
                        "link": "/project-mgr/issue",
                        "description": "",
                        "subMenu": []
                    }]
                }
            ]
        },
        {
            "id": 5,
            "parentId": 0,
            "cLevel": 1,
            "name": "代码合并请求(MR)管理",
            "link": "/mergeRequest",
            "description": "",
            "subMenu": [
                {
                    "id": 9,
                    "parentId": 5,
                    "cLevel": 2,
                    "name": "代码合并请求(MR)管理",
                    "link": "/mergeRequest",
                    "description": "",
                    "subMenu": []
                }
            ]
        }
    ]
};
