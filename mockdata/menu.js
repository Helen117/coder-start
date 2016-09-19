/**
 * Created by william.xu on 2016/9/4 10:19
 */
module.exports.menu = [{
    id: 1,
    cname: 'dashboard',
    subMenu: [{
        id: 11,
        name: '首页',
        link: '/home'
    }]
}, {
    id: 2,
    cname: '用户管理',
    subMenu: [{
        id: 21,
        name: '用户管理',
        link: '/user'
    }, {
        id: 22,
        name: '测试',
        link: '/test'
    }]
}, {
    id: 3,
    cname: '项目管理',
    subMenu: [{
        id: 31,
        name: '项目管理',
        link: '/project-mgr'
    },{
        id: 32,
        name: '项目列表',
        link: '/project-list'
    },{
        id: 33,
        name: '项目明细',
        link: '/project-member'
    }]
}];

