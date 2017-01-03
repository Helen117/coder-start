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
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/shell/shell';

import {getJob, saveJob, buildJob} from './action';

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
        this.props.form.setFieldsValue({
            deployConfigs: [1],
        });
    }
    componentDidMount(){
        console.log(this);
        const cm = this.refs.buildStageEditor.getCodeMirror();
        cm.setSize(null, 100);

        const cm2 = this.refs.packageStageEditor.getCodeMirror();
        cm2.setSize(null, 100);

    }
    componentWillUnmount(){
    }

    componentWillReceiveProps(nextProps){
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
        form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                const buildStageEditor = this.refs.buildStageEditor.getCodeMirror();
                const buildScript = buildStageEditor.getValue().trim();
                if (buildScript == ''){
                    notification.warn({
                        message: '警告',
                        description: "编译脚本不能为空",
                        duration: 5
                    });
                    buildStageEditor.focus();
                    return;
                }
                const packageStageEditor = this.refs.packageStageEditor.getCodeMirror();
                const packageScript = packageStageEditor.getValue().trim();
                if (packageScript == ''){
                    notification.warn({
                        message: '警告',
                        description: "打包脚本不能为空",
                        duration: 5
                    });
                    packageStageEditor.focus();
                    return;
                }

                const deployConfigs = form.getFieldValue('deployConfigs');
                let allValid = true;
                let deployConfigDetails = [];
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

    changeBranch(e){
        console.log(e.target.value);
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
            readOnly: false
        };
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 20},
        };

        const deployConfigs = getFieldValue('deployConfigs');
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
        const action = <PipelineScriptEditor script={script} projectName={projectName}/>;

        return (
            <Box title={title} action={action}>
                <Spin spinning={saveLoading} tip="正在保存编译发布配置...">
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="选择项目分支">
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
                                            {required:false, message:'请设置调度'}
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
                                            {required:false, message:'请设置调度'}
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
                                        <CodeMirror ref="buildStageEditor"
                                                    onChange={this.updateCode.bind(this)}
                                                    options={{...options, mode: 'shell'}}
                                                    interact={this.interact} />
                                    </FormItem>
                                } />
                                <Step title="生成单元测试案例" description="" />
                                <Step title="代码质量扫描" description="" />
                                <Step title="单元测试" description="" />
                                <Step title="打包" description={
                                    <FormItem {...formItemLayout} label="打包脚本">
                                        <CodeMirror ref="packageStageEditor"
                                                    onChange={this.updateCode.bind(this)}
                                                    options={{...options, mode:'shell'}}
                                                    interact={this.interact} />
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
                </Spin>
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
        jobInfo: state.projectCompile.jobInfo,
        saveJobResult: state.projectCompile.saveJobResult,
        saveLoading: state.projectCompile.saveLoading,
        buildLoading: state.projectCompile.buildLoading,
        buildJobResult: state.projectCompile.buildJobResult
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCompile2);
//export default ProjectCompile;