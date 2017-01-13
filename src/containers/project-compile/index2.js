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

import {getPipelineJob, savePipelineJob, buildJob, getStageList} from './action';
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
        const {selectNode, form, getStageList, fetchBranchesData} = this.props;
        form.setFieldsValue({
            deployConfigs: [1],
        });
        getStageList();
        if (selectNode && selectNode.isProject){
            fetchBranchesData(this.getProjectId(selectNode));
            this.getJobInfo(selectNode, 'dev');
        }
        PubSub.subscribe("onSelectProjectNode", this.selectProject.bind(this));

    }
    componentWillUnmount(){
        PubSub.unsubscribe("onSelectProjectNode");
    }

    componentWillReceiveProps(nextProps){
        const {setFieldsValue} = this.props.form;
        const {pipelineJobInfo, selectNode, savePipelineJobResult,buildJobResult} = nextProps;
        if (selectNode && selectNode.isProject == false){
            if (pipelineJobInfo){
                pipelineJobInfo.jobName = null;
            }
        }
        if (pipelineJobInfo && pipelineJobInfo != this.props.pipelineJobInfo){
            const deployConfigs = pipelineJobInfo.deployConfigs;
            //const triggerDesc = this.refs.cron.formatCronexpression(jobInfo.trigger);
            const triggerDesc = this.refs.cron.refs.wrappedComponent.refs.formWrappedComponent.formatCronexpression(pipelineJobInfo.trigger);
            let deployConfigsArray = [];
            if (deployConfigs && deployConfigs.length){
                for (let i=1; i <= deployConfigs.length; i++){
                    deployConfigsArray.push(i);
                }
            }else{
                deployConfigsArray.push(1);
            }
            setFieldsValue({
                trigger:pipelineJobInfo.trigger,
                triggerDesc: triggerDesc,
                branchName: pipelineJobInfo.branchName?pipelineJobInfo.branchName:this.props.form.getFieldValue('branchName'),
                gitUrl: pipelineJobInfo.gitUrl,
                buildScript: pipelineJobInfo.buildScript,
                packageScript: pipelineJobInfo.packageScript,
                deployConfigs: deployConfigsArray,
                deployConfigShouldRender: pipelineJobInfo.jobName?true:false
            });
            // for (let i = 0; i < deployConfigsArray.length; i++){
            //     const form = this.refs['deployConfig'+deployConfigsArray[i]].refs.wrappedComponent.props.form;
            //     console.log(form);
            // }
            if (this.refs['deployConfig1']){
                const form = this.refs['deployConfig1'].refs.wrappedComponent.props.form;
                form.setFieldsValue({server:null, sourcePath:null, targetPath:null, execCommand:null});
            }

            //不能再这里设置deployConfig表单信息，因为ref尚未初始化
            //所以通过deployConfigShouldRender变量在componentDidUpdate中更新
            // for (let i = 0; i < deployConfigsArray.length; i++){
            //     const deployConfigRef = this.refs['deployConfig'+deployConfigsArray[i]];
            //     if (deployConfigRef){
            //         const form = deployConfigRef.refs.wrappedComponent.props.form;
            //         form.setFieldsValue(pipelineJobInfo.deployConfigs[i]);
            //     }
            // }


        }
        if (savePipelineJobResult && savePipelineJobResult != this.props.savePipelineJobResult){
            notification.success({
                message: '操作成功',
                description: "成功保存编译发布配置脚本！",
                duration: 5
            });
        }
        if (buildJobResult && buildJobResult != this.props.buildJobResult){
            notification.success({
                message: '操作成功',
                description: "成功发起执行任务，请稍等几秒查看执行状态！",
                duration: 5
            });
        }

    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    componentWillUpdate(nextProps, nextState){
    }
    componentDidUpdate(prevProps, prevState){
        const {getFieldValue, setFieldsValue} = this.props.form;
        if (getFieldValue('deployConfigShouldRender')){
            const deployConfigs = getFieldValue('deployConfigs');
            for (let i = 0; i < deployConfigs.length; i++){
                const deployConfigRef = this.refs['deployConfig'+deployConfigs[i]];
                if (deployConfigRef){
                    const form = deployConfigRef.refs.wrappedComponent.props.form;
                    form.setFieldsValue(this.props.pipelineJobInfo.deployConfigs[i]);
                }
            }
            setFieldsValue({deployConfigShouldRender:false});
        }
    }

    selectProject(msg, data){
        if (data.isProject){
            const {form,fetchBranchesData} = this.props;
            this.getJobInfo(data, form.getFieldValue('branchName'));
            fetchBranchesData(this.getProjectId(data));
        }
    }
    changeBranch(e){
        const {selectNode} = this.props;
        this.getJobInfo(selectNode, e.target.value);
    }

    getJobInfo(selectNode, branchName){
        const {form, getPipelineJob} = this.props;
        getPipelineJob(this.getJobName(selectNode), branchName);
    }

    getJobName(selectNode){
        let jobName = selectNode.node.name.substr(selectNode.node.name.lastIndexOf('/')+1);
        jobName = jobName + '-' + selectNode.node.id.substr(0,selectNode.node.id.length-2);
        return jobName;
    }

    getProjectId(selectNode){
        return selectNode.node.id.substr(0,selectNode.node.id.length-2);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form, savePipelineJob, selectNode} = this.props;
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
                    savePipelineJob({
                        jobName:this.getJobName(selectNode),
                        ...form.getFieldsValue(),
                        deployConfigs: deployConfigDetails
                    });
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

    execBuild(){
        const {buildJob, selectNode, form} = this.props;
        buildJob(this.getJobName(selectNode) + '_' + form.getFieldValue('branchName'));
    }

    viewBuildHis(){
        this.context.router.push({
            pathname: '/project-mgr/project-build-history',
            state: {}
        });
    }

    render(){
        const {selectNode, pipelineJobInfo, getPipelineJobLoading, savePipelineJobLoading, branches, stageList, stageLoading, buildLoading} = this.props;
        const {getFieldDecorator, getFieldError, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 20},
        };

        var title = '编译发布配置';
        var stepsTitle = '具体配置步骤';
        let action = '';
        let deployConfigItems = [];
        let branchList = [];
        if (selectNode && selectNode.isProject){
            if (savePipelineJobLoading){
                title = '正在保存编译发布配置...';
            }else{
                if (getPipelineJobLoading){
                    title = '正在加载编译发布配置...';
                }
            }
            if (stageLoading){
                stepsTitle = '正在加载配置步骤...'
            }

            action = <PipelineScriptEditor projectName={this.getJobName(selectNode)}/>;
            let deployConfigs = getFieldValue('deployConfigs');
            if (!deployConfigs){
                deployConfigs = [1];
            }
            deployConfigItems = deployConfigs.map((value, index) => {
                return (
                    <Box key={value} title={`发布配置${value}`} classType="bg" action={value==1?(''):(<Button type="dashed" icon="minus" onClick={()=>this.removeDeployConfig(value)}>删除该配置</Button>)}>
                        <DeployConfig ref={"deployConfig"+value}/>
                    </Box>
                );
            });
            if (branches){
                branchList = branches.branch.map((value, index) => {
                    return <Radio key={value} value={value}>{value}</Radio>
                });
            }
        }

        return (
            <Box title={title} action={action}>
                {(selectNode && selectNode.isProject && pipelineJobInfo && pipelineJobInfo.jobName)?(
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
                    <Spin spinning={savePipelineJobLoading} tip="正在保存编译发布配置...">
                        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="项目代码分支">
                            {getFieldDecorator('branchName',
                                {rules:[{required:true, message:'请选择项目代码分支'}],initialValue: 'dev'})(
                                <RadioGroup style={{paddingRight:10}} onChange={this.changeBranch.bind(this)}>
                                    {branchList}
                                </RadioGroup>
                            )}
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

                        <Box title={stepsTitle}>
                            <Steps direction="vertical" size='small' current={-1}>
                                {stageList?stageList.map((value, index) => {
                                        switch (value.id){
                                            case 1:
                                                return <Step key={value.id} title={value.name} description={
                                                    <FormItem {...formItemLayout} label="Git仓库URL:">
                                                        {getFieldDecorator('gitUrl',
                                                            {rules:[
                                                                {required:true, message:'请输入Git仓库URL'}
                                                            ]})(<Input type="text" placeholder="请输入Git仓库URL"/>)}
                                                    </FormItem>
                                                } />
                                            case 100:
                                                return <Step key={value.id} title={value.name} description={
                                                    <FormItem {...formItemLayout} label="编译脚本">
                                                        {getFieldDecorator('buildScript',
                                                            {rules:[
                                                                {required:true, message:'请输入编译脚本'}
                                                            ]})(<Input type="textarea" rows={3} placeholder="请输入编译脚本"/>)}
                                                    </FormItem>
                                                } />
                                            case 140:
                                                return <Step key={value.id} title={value.name} description={
                                                    <FormItem {...formItemLayout} label="打包脚本">
                                                        {getFieldDecorator('packageScript',
                                                            {rules:[
                                                                {required:true, message:'请输入打包脚本'}
                                                            ]})(<Input type="textarea" rows={3} placeholder="请输入打包脚本"/>)}
                                                    </FormItem>
                                                } />
                                            case 200:
                                                return <Step key={value.id} title={value.name} description={
                                                    <Box title="填写发布配置信息" action={<Button type="dashed" icon="plus" onClick={()=>this.addDeployConfig()}>添加发布配置</Button>}>
                                                        {deployConfigItems}
                                                    </Box>

                                                } />
                                            default:
                                                return <Step key={value.id} title={value.name} description="" />
                                        }
                                    }):[]}
                            </Steps>
                        </Box>
                        <FormItem wrapperCol={{span: 24}} style={{marginTop: 0}}>
                            <Affix offsetBottom={0}>
                                <Button type="primary" icon="save" htmlType="submit" style={{float:'right'}}>保存配置</Button>
                            </Affix>
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

ProjectCompile2.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

ProjectCompile2 = Form.create({
    // onFieldsChange(props, changedFields) {
    //     console.log('onFieldsChange', props, changedFields);
    // },
    // mapPropsToFields(props) {
    //     const {selectNode, pipelineJobInfo} = props;
    //     console.log('mapPropsToFields=', props, this);
    //     if (selectNode && selectNode.isProject){
    //         if (!pipelineJobInfo){
    //             return {deployConfigs:{value:[1]}};
    //         }else{
    //             const deployConfigs = pipelineJobInfo.deployConfigs;
    //             //const triggerDesc = this.refs.cron.formatCronexpression(jobInfo.trigger);
    //             //这里不能获取this.refs
    //             const triggerDesc = this.refs.cron.refs.wrappedComponent.refs.formWrappedComponent.formatCronexpression(pipelineJobInfo.trigger);
    //             let deployConfigsArray = [];
    //             if (deployConfigs && deployConfigs.length){
    //                 for (let i=1; i <= deployConfigs.length; i++){
    //                     deployConfigsArray.push(i);
    //                 }
    //             }else{
    //                 deployConfigsArray.push(1);
    //             }
    //             return {
    //                 trigger:pipelineJobInfo.trigger,
    //                 triggerDesc: triggerDesc,
    //                 branchName: pipelineJobInfo.branchName?pipelineJobInfo.branchName:'dev',
    //                 gitUrl: pipelineJobInfo.gitUrl,
    //                 buildScript: pipelineJobInfo.buildScript,
    //                 packageScript: pipelineJobInfo.packageScript,
    //                 deployConfigs: deployConfigsArray
    //             }
    //         }
    //     }
    //}
})(ProjectCompile2);

function mapStateToProps(state) {
    return {
        selectNode: state.getGroupTree.selectNode,
        branches:state.branch.branchesData,
        stageList: state.projectCompile.stageList,
        stageLoading: state.projectCompile.stageLoading,
        getPipelineJobLoading: state.projectCompile.getPipelineJobLoading,
        pipelineJobInfo: state.projectCompile.pipelineJobInfo,
        savePipelineJobLoading: state.projectCompile.savePipelineJobLoading,
        savePipelineJobResult: state.projectCompile.savePipelineJobResult,
        buildLoading: state.projectCompile.buildLoading,
        buildJobResult: state.projectCompile.buildJobResult
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBranchesData:bindActionCreators(fetchBranchesData, dispatch),
        getStageList:bindActionCreators(getStageList, dispatch),
        getPipelineJob: bindActionCreators(getPipelineJob, dispatch),
        savePipelineJob: bindActionCreators(savePipelineJob, dispatch),
        buildJob: bindActionCreators(buildJob, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCompile2);
//export default ProjectCompile2;