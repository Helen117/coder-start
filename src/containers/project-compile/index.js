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
import {Form, Input, Button, Alert, notification, Row, Col} from 'antd';
import Box from '../../components/box';
import './index.less';
import CronExpression from '../../components/cron-expression';

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
    }
    componentDidMount(){
        const {selectNode, getJob} = this.props;
        if (selectNode && selectNode.isProject){
            getJob(selectNode.node.name + '(' + selectNode.node.id.substr(0,selectNode.node.id.length-2) + ')');
        }
        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));
    }
    componentWillUnmount(){
        PubSub.unsubscribe("onSelectProjectNode");
    }

    componentWillReceiveProps(nextProps){
        const {setFieldsValue} = this.props.form;
        const {jobInfo, saveJobResult} = nextProps;
        if (jobInfo && jobInfo != this.props.jobInfo){
            setFieldsValue({trigger:jobInfo.trigger});
            if (jobInfo.pipelineScript){
                this.refs.editor.getCodeMirror().setValue(jobInfo.pipelineScript);
            }else{
                this.refs.editor.getCodeMirror().setValue('');
            }
        }
        if (saveJobResult && saveJobResult != this.props.saveJobResult){
            notification.success({
                message: '操作成功',
                description: "成功保存编译发布脚本！",
                duration: 5
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
        // if (nextProps.projectInfo){
        //     return true;
        // }else{
        //     return false;
        // }
    }
    componentWillUpdate(nextProps, nextState){

    }
    componentDidUpdate(prevProps, prevState){
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
        const {form, saveJob, selectNode} = this.props;

        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const pipelineScript = this.refs.editor.getCodeMirror().getValue().trim();
                if (pipelineScript == ''){
                    notification.warn({
                        message: '警告',
                        description: "编译发布脚本不能为空",
                        duration: 5
                    });
                    return;
                }
                saveJob({
                    jobName:selectNode.node.name + '_' + selectNode.node.id.substr(0,selectNode.node.id.length-2),
                    trigger:form.getFieldValue('trigger'),
                    pipelineScript: pipelineScript
                });
            }
        })
    }


    selectProject(msg, data){
        if (data.isProject){
            this.props.getJob(data.node.name + '_' + data.node.id.substr(0,data.node.id.length-2));
        }
    }

    setCron(cron){
        const {setFieldsValue} = this.props.form;
        setFieldsValue({trigger:cron});
    }

    render(){
        const {selectNode, jobInfo, getLoading, saveLoading} = this.props;
        var title = '正在加载编译发布配置...';
        if (saveLoading){
            title = '正在保存编译发布配置...';
        }else{
            if (!getLoading){
                if (selectNode&&selectNode.isProject){
                    if (jobInfo && jobInfo.jobName){
                        title = '修改编译发布配置';
                    }else{
                        title = '新增编译发布配置';
                    }
                }else{
                    title = '编译发布配置';
                }
            }
        }
        const {getFieldDecorator, getFieldError, getFieldValue} = this.props.form;
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
                {(selectNode && selectNode.isProject)?(
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="配置调度表达式">
                            <Row gutter={0}>
                                <Col span={21}>
                                    {getFieldDecorator('trigger',
                                        {rules:[
                                            {required:true, message:'请输入调度配置！'}
                                        ]})(<Input type="text" placeholder="请输入调度配置"/>)}
                                </Col>
                                <Col span={3}>
                                    <CronExpression expression={getFieldValue('trigger')} setCron={this.setCron.bind(this)}/>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...formItemLayout} label="编译发布脚本" extra={"注：脚本中需要传递的projectId="+selectNode.node.id.substr(0,selectNode.node.id.length-2)}>
                            <CodeMirror ref="editor"
                                        onChange={this.updateCode.bind(this)}
                                        options={options}
                                        interact={this.interact} />
                        </FormItem>
                        <FormItem wrapperCol={{span: 16, offset: 4}} style={{marginTop: 0}}>
                            <Button type="primary" htmlType="submit"
                                    loading={saveLoading}>
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
        jobInfo: state.projectCompile.jobInfo,
        saveJobResult: state.projectCompile.saveJobResult,
        getLoading: state.projectCompile.getLoading,
        saveLoading: state.projectCompile.saveLoading
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