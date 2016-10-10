/**
 * Created by william.xu on 2016/9/4 10:19
 */
module.exports.menu = {
    success: true,
    errorCode: null,
    errorMsg: null,
    result: [{
        id: 1,
        name: 'dashboard',
        subMenu: [{
            id: 11,
            name: '首页',
            link: '/home.html'
        }]
    }, {
        id: 2,
        name: '用户管理',
        subMenu: [{
            id: 21,
            name: '用户管理',
            link: '/user.html'
        }]
        }, {
        id: 3,
        name: '项目管理',
        subMenu: [{
                id: 31,
                name: '项目管理',
                link: '/project-mgr.html'
            }]
        }, {
            id: 4,
            name: '里程碑',
            subMenu: [{
                id: 41,
                name: '里程碑',
                link: '/milestones.html'
            }]
        },
        {
        id: 5,
        name: '问题管理',
        subMenu: [{
            id: 51,
            name: '问题管理',
            link: '/issue.html'
        }]
    },
        {
            id: 7,
            name: '代码合并请求(MR)管理',
            subMenu: [{
                id: 71,
                name: '代码合并请求(MR)管理',
                link: '/mergeRequest.html'
            }]
        }]

};
