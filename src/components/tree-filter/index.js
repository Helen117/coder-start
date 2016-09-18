/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/9/14
 */
import React, {PropTypes} from 'react';
import { Tree, Input } from 'antd';

const TreeNode = Tree.TreeNode;
const gData = [{
    title: '项目组1',
    key: 'group1',
    children: [{
        title: '项目11',
        key: 'project11'
    },{
        title: '项目12',
        key: 'project12'
    }]
},{
    title: '项目组2',
    key: 'group2',
    children: [{
        title: '项目21',
        key: 'project21'
    },{
        title: '项目22',
        key: 'project22'
    }]
},{
    title: '项目组3',
    key: 'group3',
    children: [{
        title: '项目31',
        key: 'project31'
    },{
        title: '项目32',
        key: 'project32'
    }]
}];
export default class TreeFilter extends React.Component {
    constructor(props){
        super(props);
    }

    render(){

        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.key}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.key} />;
        });

        return(
            <div style={{border: "1px solid #e5e5e5", padding:10}}>
                <Input placeholder="快速查询项目" />
                <Tree>
                    {loop(gData)}
                </Tree>
            </div>
        );
    }


}