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
import {Form, Input, Button, Select, Alert, notification, Row, Col, Spin, Radio, Steps, Icon, Timeline, Affix} from 'antd';
import Box from '../../components/box';
import './index.less';
import CronExpression from '../../components/cron-expression';
import PipelineScriptEditor from './pipeline-script-editor';
import DeployConfig from './deploy-config';
//import CodeMirror from 'react-codemirror';
//import 'codemirror/mode/shell/shell';

import {getJob, saveJob, buildJob, getStageList} from './action';
import {fetchBranchesData} from '../branches/branches-action';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Step = Steps.Step;

let uuid = 1;

class ProjectCompile2 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentWillMount(){
    }
    componentDidMount(){
        this.props.form.setFieldsValue({
            deployConfigs: [1],
        });
        this.props.getStageList();

        const {selectNode, getJob} = this.props;
        if (selectNode && selectNode.isProject){
            let jobName = selectNode.node.name.substr(selectNode.node.name.lastIndexOf('/')+1);
            //------getJob(jobName + '_' + selectNode.node.id.substr(0,selectNode.node.id.length-2));
        }
        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));

    }
    componentWillUnmount(){
        PubSub.unsubscribe("onSelectProjectNode");
    }

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps', nextProps);
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

    selectProject(msg, data){
        if (data.isProject){
            //this.setState({isProject: true});
            let jobName = data.node.name.substr(data.node.name.lastIndexOf('/')+1);
            //-------this.props.getJob(jobName + '_' + data.node.id.substr(0,data.node.id.length-2));
        }else{
            //this.setState({isProject: false});
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form, saveJob, selectNode} = this.props;
        form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                const deployConfigs = form.getFieldValue('deployConfigs');
                let allValid = true;
                let deployConfigDetails = [];
                if (deployConfigs){
                    deployConfigs.map((value, index) => {
                        const form = this.refs['deployConfig'+value].refs.wrappedComponent.props.form;
                        form.validateFieldsAndScroll((errors, values) => {
                            if (!errors) {
                                deployConfigDetails.push(form.getFieldsValue());
                            }else{
                                allValid =false;
                            }
                        });
                    });
                }

                if (allValid){
                    console.log(form.getFieldsValue());
                    console.log('buildScript=',buildScript);
                    console.log('packageScript=',packageScript);
                    console.log('deployConfigs=', form.getFieldValue("deployConfigs"));
                    console.log('deployConfigDetails=', deployConfigDetails);

                }

            }
        });
    }

    setCron(cron, cronDesc){
        const {setFieldsValue} = this.props.form;
        setFieldsValue({trigger:cron, triggerDesc:cronDesc});
    }

    addDeployConfig(){
        uuid++;
        const { form } = this.props;
        const deployConfigs = form.getFieldValue('deployConfigs');
        form.setFieldsValue({
            deployConfigs: deployConfigs.concat(uuid),
        });
    }

    removeDeployConfig(v){
        //uuid--;
        const { form } = this.props;
        const deployConfigs = form.getFieldValue('deployConfigs');
        if (deployConfigs.length === 1) {
            return;
        }
        form.setFieldsValue({
            deployConfigs: deployConfigs.filter(value => value !== v),
        });
    }

    changeBranch(e){
        console.log(e.target.value);
    }
    execBuild(){
        // const {buildJob, selectNode} = this.props;
        // let jobName = selectNode.node.name;
        // if (jobName){
        //     jobName = jobName.substr(jobName.lastIndexOf("/") + 1);
        // }
        // buildJob(jobName + '_' + selectNode.node.id.substr(0,selectNode.node.id.length-2));
    }

    viewBuildHis(){
        // this.context.router.push({
        //     pathname: '/project-mgr/project-build-history',
        //     state: {}
        // });
    }

    render(){
        const {selectNode, jobInfo, saveLoading, buildLoading} = this.props;
        var title = '编译发布配置';
        const {getFieldDecorator, getFieldError, getFieldValue} = this.props.form;
        var options = {
            lineNumbers: true,
            readOnly: false
        };
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 20},
        };

        let deployConfigs = getFieldValue('deployConfigs');
        if (!deployConfigs){
            deployConfigs = [];
        }
        const deployConfigItems = deployConfigs.map((value, index) => {
            return (
                <Box key={value} title={`发布配置${value}`} classType="bg" action={value==1?(<div></div>):(<Button type="dashed" icon="minus" onClick={()=>this.removeDeployConfig(value)}>删除该配置</Button>)}>
                    <DeployConfig ref={"deployConfig"+value}/>
                </Box>
            );
        });
        const script = "mvn package";
        const projectName = 'devops-web-1';
        const branchName = 'dev';
        const action = (selectNode && selectNode.isProject)?(<PipelineScriptEditor script={script} projectName={projectName}/>):(<div/>);

        return (
            <Box title={title} action={action}>
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
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="项目代码分支">
                            <RadioGroup style={{paddingRight:10}} onChange={this.changeBranch.bind(this)} defaultValue={branchName}>
                                <Radio value="dev">dev</Radio>
                                <Radio value="release">release</Radio>
                                <Radio value="master">master</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem {...formItemLayout} label="配置执行调度">
                            <Row gutter={10}>
                                <Col span={21}>
                                    {getFieldDecorator('triggerDesc',
                                        {rules:[
                                            {required:true, message:'请设置调度'}
                                        ]})(<Input disabled type="text" placeholder="请设置调度"/>)}
                                </Col>
                                <Col span={3}>
                                    <CronExpression ref="cron" expression={getFieldValue('trigger')} setCron={this.setCron.bind(this)}/>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem style={{display:'none'}}>
                            <Row >
                                <Col span={21}>
                                    {getFieldDecorator('trigger',
                                        {rules:[
                                            {required:true, message:'请设置调度'}
                                        ]})(<Input type="text" placeholder="请设置调度"/>)}
                                </Col>
                            </Row>
                        </FormItem>
                        <Box title="具体配置步骤">
                            <Steps direction="vertical" size='small' current={-1}>
                                <Step title="更新代码" description={
                                    <FormItem {...formItemLayout} label="Git仓库URL:">
                                        {getFieldDecorator('gitUrl',
                                            {rules:[
                                                {required:true, message:'请输入Git仓库URL'}
                                            ]})(<Input type="text" placeholder="请输入Git仓库URL"/>)}
                                    </FormItem>
                                } />
                                <Step title="编译" description={
                                    <FormItem {...formItemLayout} label="编译脚本">
                                        {getFieldDecorator('buildScript',
                                            {rules:[
                                                {required:true, message:'请输入编译脚本'}
                                            ]})(<Input type="textarea" rows={3} placeholder="请输入编译脚本"/>)}
                                    </FormItem>
                                } />
                                <Step title="生成单元测试案例" description="" />
                                <Step title="代码质量扫描" description="" />
                                <Step title="单元测试" description="" />
                                <Step title="打包" description={
                                    <FormItem {...formItemLayout} label="打包脚本">
                                        {getFieldDecorator('packageScript',
                                            {rules:[
                                                {required:true, message:'请输入打包脚本'}
                                            ]})(<Input type="textarea" rows={3} placeholder="请输入打包脚本"/>)}
                                    </FormItem>
                                } />
                                <Step title="生成镜像" description="" />
                                <Step title="发布" description={
                                    <Box title="填写发布配置信息" action={<Button type="dashed" icon="plus" onClick={()=>this.addDeployConfig()}>添加发布配置</Button>}>
                                        {deployConfigItems}
                                    </Box>

                                } />
                                <Step title="执行自动化测试" description="" />
                            </Steps>
                        </Box>
                        <FormItem wrapperCol={{span: 24, offset: 21}} style={{marginTop: 0}}>
                            <Affix offsetBottom={0}>
                                <Button type="primary" icon="save" htmlType="submit">保存配置</Button>
                            </Affix>
                        </FormItem>
                    </Form>
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

ProjectCompile2.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectCompile2 = Form.create()(ProjectCompile2);

function mapStateToProps(state) {
    return {
        selectNode: state.getGroupTree.selectNode,
        branches:state.branch.branchesData,
        stageList: state.projectCompile.stageList

        // jobInfo: state.projectCompile.jobInfo,
        // saveJobResult: state.projectCompile.saveJobResult,
        // saveLoading: state.projectCompile.saveLoading,
        // buildLoading: state.projectCompile.buildLoading,
        // buildJobResult: state.projectCompile.buildJobResult
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBranchesData:bindActionCreators(fetchBranchesData, dispatch),
        getStageList:bindActionCreators(getStageList, dispatch),
        getJob: bindActionCreators(getJob, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCompile2);
//export default ProjectCompile2;