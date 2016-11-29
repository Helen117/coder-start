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
import './index.less';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/groovy/groovy';

var defaults = {
    code: 'var component = {\n\tname: "react-codemirror",\n\tauthor: "Jed Watson",\n\trepo: "https://github.com/JedWatson/react-codemirror"\n};'
};

class ProjectCompile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextProps.projectInfo){
            return true;
        }else{
            return false;
        }
    }
    componentWillMount(){
    }
    componentDidMount(){
        const {projectInfo} = this.props;

        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));
    }
    componentWillUnmount(){
        PubSub.unsubscribe("onSelectProjectNode");
    }

    updateCode(newCode) {
        this.setState({
            code: newCode
        });
    }
    interact (cm) {
        console.log(cm.getValue());
    }


    selectProject(msg, data){
        console.log('data=', data);
        if (!data.isProject){
            console.info('请选择一个具体的项目');
        }
    }

    render(){
        console.info('render');
        const {projectInfo} = this.props;
        const projectId = projectInfo? projectInfo.id+'_p':'';
        console.log('projectid', projectInfo);
        var options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'groovy'
        };
        return (
            <div style={{'padding-left':'10px', 'width':'600px', 'height':'300px'}}>
                <CodeMirror ref="editor" value={defaults.code} onChange={this.updateCode.bind(this)} options={options} interact={this.interact} />
            </div>);
    }
}

ProjectCompile.contextTypes = {
};

ProjectCompile = Form.create()(ProjectCompile);

function mapStateToProps(state) {
    return {
        projectInfo:state.getProjectInfo.projectInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCompile);
