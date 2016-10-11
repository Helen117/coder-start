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
            "link": "/home.html",
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
                    "link": "/project-mgr.html",
                    "description": "",
                    "subMenu": [
                        {
                            "id": 7,
                            "parentId": 6,
                            "cLevel": 3,
                            "name": "项目代码",
                            "link": "",
                            "description": "",
                            "subMenu": null
                        },
                        {
                            "id": 13,
                            "parentId": 6,
                            "cLevel": 3,
                            "name": "里程碑管理",
                            "link": "/milestones.html",
                            "description": "",
                            "subMenu": null
                        },
                        {
                            "id": 14,
                            "parentId": 6,
                            "cLevel": 3,
                            "name": "问题管理",
                            "link": "/issue.html",
                            "description": "",
                            "subMenu": null
                        }
                    ]
                },
                {
                    "id": 11,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "测试案例",
                    "link": "",
                    "description": "",
                    "subMenu": []
                },
                {
                    "id": 12,
                    "parentId": 2,
                    "cLevel": 2,
                    "name": "代码质量管理",
                    "link": "",
                    "description": "",
                    "subMenu": []
                }
            ]
        },
        {
            "id": 3,
            "parentId": 0,
            "cLevel": 1,
            "name": "里程碑",
            "link": "/milestones.html",
            "description": "",
            "subMenu": [
                {
                    "id": 8,
                    "parentId": 3,
                    "cLevel": 2,
                    "name": "里程碑管理",
                    "link": "/milestones.html",
                    "description": "",
                    "subMenu": null
                }
            ]
        },
        {
            "id": 4,
            "parentId": 0,
            "cLevel": 1,
            "name": "问题管理",
            "link": "/issue.html",
            "description": "",
            "subMenu": [
                {
                    "id": 10,
                    "parentId": 4,
                    "cLevel": 2,
                    "name": "问题查看",
                    "link": "/issue.html",
                    "description": "",
                    "subMenu": null
                }
            ]
        },
        {
            "id": 5,
            "parentId": 0,
            "cLevel": 1,
            "name": "代码合并请求(MR)管理",
            "link": "/mergeRequest.html",
            "description": "",
            "subMenu": [
                {
                    "id": 9,
                    "parentId": 5,
                    "cLevel": 2,
                    "name": "代码合并请求(MR)管理",
                    "link": "/mergeRequest.html",
                    "description": "",
                    "subMenu": null
                }
            ]
        }
    ]
};
