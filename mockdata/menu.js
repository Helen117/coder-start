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
        }, {
            id: 22,
            name: '测试',
            link: '/test'
        }]
    }, {
        id: 3,
        name: '项目管理',
        subMenu: [{
            id: 31,
            name: '项目管理',
            link: '/project-mgr.html'
        }]
    },{
    id: 6,
    cname: '问题管理',
    subMenu: [{
        id: 61,
        name: '问题管理',
        link: '/issue'
    }]
}]
};

