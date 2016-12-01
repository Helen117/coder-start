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
import {Form, Input, Button, Alert, notification, Row, Col, Spin} from 'antd';
import Box from '../../components/box';
import './index.less';
import CronExpression from '../../components/cron-expression';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/groovy/groovy';

import {getJob, saveJob, buildJob} from './action';

const FormItem = Form.Item;


class ProjectCompile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isProject: true
        };
    }

    componentWillMount(){
    }
    componentDidMount(){
        const {selectNode, getJob} = this.props;
        if (selectNode && selectNode.isProject){
            getJob(selectNode.node.name + '_' + selectNode.node.id.substr(0,selectNode.node.id.length-2));
        }
        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));
    }
    componentWillUnmount(){
        PubSub.unsubscribe("onSelectProjectNode");
    }

    componentWillReceiveProps(nextProps){
        const {setFieldsValue} = this.props.form;
        const {jobInfo, saveJobResult, buildJobResult, selectNode} = nextProps;
        if (selectNode && selectNode.isProject == false){
            if (this.props.jobInfo){
                this.props.jobInfo.jobName = null;
                this.props.jobInfo.getLoading = true;
            }
        }
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
        if (buildJobResult && buildJobResult != this.props.buildJobResult){
            notification.success({
                message: '操作成功',
                description: "成功发起执行任务！",
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
            //this.setState({isProject: true});
            this.props.getJob(data.node.name + '_' + data.node.id.substr(0,data.node.id.length-2));
        }else{
            //this.setState({isProject: false});
        }
    }

    execBuild(){
        const {buildJob, selectNode} = this.props;
        buildJob(selectNode.node.name + '_' + selectNode.node.id.substr(0,selectNode.node.id.length-2));
    }

    viewBuildHis(){
        this.context.router.push({
            pathname: '/project-mgr/project-build-history',
            state: {}
        });
    }

    setCron(cron){
        const {setFieldsValue} = this.props.form;
        setFieldsValue({trigger:cron});
    }

    render(){
        const {selectNode, jobInfo, saveLoading, buildLoading} = this.props;
        //console.log('jobinfo=', jobInfo);
        var title = '编译发布配置';
        if (selectNode&&selectNode.isProject){
            if (saveLoading){
                title = '正在保存编译发布配置...';
            }else{
                if (jobInfo && jobInfo.getLoading){
                    title = '正在加载编译发布配置...';
                }else{
                    if (jobInfo && jobInfo.jobName){
                        title = '修改编译发布配置';
                    }else{
                        title = '新增编译发布配置';
                    }
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
                {(selectNode && selectNode.isProject && jobInfo && jobInfo.jobName)?(
                    <Alert
                        message={
                            <Row>
                                <span>该项目已经配置了编译发布脚本，您可以</span>
                                <Button type="primary" size="small" style={{marginLeft:5}} onClick={this.execBuild.bind(this)} loading={buildLoading}>发起执行任务</Button>或者
                                <Button type="primary" size="small" style={{marginLeft:5}} onClick={this.viewBuildHis.bind(this)}>查看执行状态和历史</Button>
                            </Row>}
                        description=""
                        type="info"
                        showIcon
                    />
                ):(
                    <div></div>
                )}
                {(selectNode && selectNode.isProject)?(
                    <Spin spinning={saveLoading} tip="正在保存编译发布配置...">
                        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                            <FormItem {...formItemLayout} label="配置调度表达式">
                                <Row gutter={0}>
                                    <Col span={21}>
                                        {getFieldDecorator('triggerDesc',
                                            {rules:[
                                                {required:true, message:'请设置调度'}
                                            ]})(<Input disabled type="text" placeholder="请设置调度"/>)}
                                    </Col>
                                    <Col span={3}>
                                        <CronExpression expression={getFieldValue('trigger')} setCron={this.setCron.bind(this)}/>
                                    </Col>
                                </Row>
                                <Row style={{display:'none'}}>
                                    <Col span={21}>
                                        {getFieldDecorator('trigger',
                                            {rules:[
                                                {required:true, message:'请设置调度'}
                                            ]})(<Input type="text" placeholder="请设置调度"/>)}
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
                                <Button type="primary" htmlType="submit">保存</Button>
                            </FormItem>
                        </Form>
                    </Spin>
                ):(
                    <Alert
                        message="请从左边的项目树中选择一个具体的项目进行配置！"
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
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectCompile = Form.create()(ProjectCompile);

function mapStateToProps(state) {
    return {
        //projectInfo:state.getProjectInfo.projectInfo,
        selectNode: state.getGroupTree.selectNode,
        jobInfo: state.projectCompile.jobInfo,
        saveJobResult: state.projectCompile.saveJobResult,
        saveLoading: state.projectCompile.saveLoading,
        buildLoading: state.projectCompile.buildLoading,
        buildJobResult: state.projectCompile.buildJobResult
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getJob: bindActionCreators(getJob, dispatch),
        saveJob: bindActionCreators(saveJob, dispatch),
        buildJob: bindActionCreators(buildJob, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCompile);
//export default ProjectCompile;