/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/18
 */

module.exports.groupTree = {
    success: true,
    errorCode: null,
    errorMsg: null,
    result: [{
        id: 'group1',
        name: '项目组1',
        children: [{
            id: 'project11',
            name: '项目11'
        },{
            id: 'project12',
            name: '项目12'
        }]
    },{
        id: 'group2',
        name: '项目组2',
        children: [{
            id: 'project21',
            name: '项目21'
        },{
            id: 'project22',
            name: '项目22'
        }]
    },{
        id: 'group3',
        name: '项目组3',
        children: [{
            id: 'project31',
            name: '项目31'
        },{
            id: 'project32',
            name: '项目32'
        },{
            id: 'project33',
            name: '项目33'
        },{
            id: 'project34',
            name: '项目34'
        },{
            id: 'project35',
            name: '项目35'
        }]
    },{
        id: '9',
        name: 'devops',
        children: [{
            id: '58',
            name: 'devops-scm'
        },{
            id: '57',
            name: 'devops-web'
        }]
    }]
};