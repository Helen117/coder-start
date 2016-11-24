/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

/**
 * Created by william.xu on 2016/11/24
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import 'pubsub-js';
import { Form } from 'antd';


class ProjectCompile extends React.Component{
    constructor(props){
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
        // if (nextProps.projectInfo){
        //     return true;
        // }else{
        //     return false;
        // }
    }
    componentWillMount(){
    }
    componentDidMount(){
        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));
    }
    componentWillUnmount(){
        PubSub.unsubscribe("onSelectProjectNode");
    }

    selectProject(msg, data){
        console.log('data=', data);
        if (!data.isProject){
            console.info('请选择一个具体的项目');
        }
    }

    render(){
        const {projectInfo} = this.props;
        const projectId = projectInfo? projectInfo.id+'_p':'';
        console.log('projectid', projectInfo);
        return (<div>项目编译({projectId})</div>);
    }
}

ProjectCompile.contextTypes = {
};

ProjectCompile = Form.create()(ProjectCompile);

function mapStateToProps(state) {
    return {
//        projectInfo:state.getProjectInfo.projectInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCompile);
