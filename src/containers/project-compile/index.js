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
import {Form, Input, Button, Alert} from 'antd';
import Box from '../../components/box';
import './index.less';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/groovy/groovy';

import {getJob, saveJob} from './action';

const FormItem = Form.Item;


var defaults = {
    code: 'var component = {\n\tname: "react-codemirror",\n\tauthor: "Jed Watson",\n\trepo: "https://github.com/JedWatson/react-codemirror"\n};'
};

class ProjectCompile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            a:1
        };
    }

    componentWillMount(){
        console.log('componentWillMount');
    }
    componentDidMount(){
        console.log('componentDidMount');
        const {selectNode, getJob} = this.props;
        if (selectNode && selectNode.isProject){
            getJob(selectNode.node.name + '(' + selectNode.node.id + ')');
        }
        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));
    }
    componentWillUnmount(){
        console.log('componentWillUnmount');
        PubSub.unsubscribe("onSelectProjectNode");
    }

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps', nextProps);
    }
    shouldComponentUpdate(nextProps, nextState){
        console.log('shouldComponentUpdate', nextProps, nextState);
        return true;
        // if (nextProps.projectInfo){
        //     return true;
        // }else{
        //     return false;
        // }
    }
    componentWillUpdate(nextProps, nextState){
        console.log('componentWillUpdate', nextProps, nextState);

    }
    componentDidUpdate(prevProps, prevState){
        console.info('componentDidUpdate', prevProps, prevState);
    }

    updateCode(newCode) {
        // this.setState({
        //     code: newCode
        // });
    }
    interact(cm) {
        // console.log('interact', cm.getValue());
    }

    handleSubmit(e) {
        e.preventDefault();
        const { actions, form, loginInfo, getGroupInfo } = this.props;
        const {editType} = this.props.state;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
            }
        })
    }


    selectProject(msg, data){
        if (data.isProject){
            this.props.getJob(data.node.name + '(' + data.node.id + ')');
        }
    }

    render(){
        const {selectNode, jobInfo} = this.props;
        console.log('render', this.props);
        const {editType} = this.state;
        var title = '编译发布配置';
        if (selectNode&&selectNode.isProject){
            if (jobInfo && jobInfo.jobName){
                title = '修改编译发布配置';
            }else{
                title = '新增编译发布配置';
            }
        }
        const {getFieldDecorator, getFieldError} = this.props.form;
        var options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'groovy'
        };
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16},
        };
        return (
            <Box title={title}>
                {(selectNode&&selectNode.isProject)?(
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="调度配置">
                            {getFieldDecorator('trigger',
                                {rules:[
                                    {required:true, message:'请输入调度配置！'}
                                ]})(<Input type="text" placeholder="请输入调度配置"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="编译发布脚本" extra="注：脚本中需要传递的projectId=123">
                            <CodeMirror ref="editor" value={defaults.code}
                                        onChange={this.updateCode.bind(this)}
                                        options={options}
                                        interact={this.interact} />
                        </FormItem>
                        <FormItem wrapperCol={{span: 16, offset: 4}} style={{marginTop: 0}}>
                            <Button type="primary" htmlType="submit"
                                    loading={editType == 'add'?this.props.loading:this.props.updateLoading}
                                    disabled={editType == 'add'?this.props.disabled:this.props.updateDisabled}>
                                保存</Button>
                        </FormItem>
                    </Form>
                ):(
                    <Alert
                        message="请选择一个具体的项目进行配置！"
                        description=""
                        type="warning"
                        showIcon
                    />
                )}
            </Box>
        );
    }
}

ProjectCompile.contextTypes = {
};

ProjectCompile = Form.create()(ProjectCompile);

function mapStateToProps(state) {
    return {
        //projectInfo:state.getProjectInfo.projectInfo,
        selectNode: state.getGroupTree.selectNode,
        jobInfo: state.projectCompile.jobInfo
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getJob: bindActionCreators(getJob, dispatch),
        saveJob: bindActionCreators(saveJob, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCompile);
//export default ProjectCompile;
