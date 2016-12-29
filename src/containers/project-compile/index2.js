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
import {Form, Input, Button, Alert, notification, Row, Col, Spin, Radio, Steps} from 'antd';
import Box from '../../components/box';
import './index.less';
import CronExpression from '../../components/cron-expression';
import PipelineScriptEditor from './pipeline-script-editor';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/shell/shell';

import {getJob, saveJob, buildJob} from './action';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Step = Steps.Step;

class ProjectCompile2 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isProject: true
        };
    }

    componentWillMount(){
    }
    componentDidMount(){
        const cm = this.refs.buildStageEditor.getCodeMirror();
        cm.setSize(300, 100);
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
    }

    setCron(cron, cronDesc){
        const {setFieldsValue} = this.props.form;
        setFieldsValue({trigger:cron, triggerDesc:cronDesc});
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
        const selectBranchAction =
            <div>
                <label>选择项目分支：</label>
                <RadioGroup style={{paddingRight:10}}>
                    <RadioButton value="a">dev</RadioButton>
                    <RadioButton value="b">release</RadioButton>
                    <RadioButton value="c">master</RadioButton>
                </RadioGroup>
                <PipelineScriptEditor />
            </div>

        return (
            <Box title={title} action={selectBranchAction}>
                    <Spin spinning={saveLoading} tip="正在保存编译发布配置...">
                        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
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
                                        <div>
                                            <FormItem {...formItemLayout} label="ssh server配置,包括主机ip，用户名、密码">
                                            </FormItem>
                                            <FormItem {...formItemLayout} label="scp操作：指定源文件，目标目录">
                                            </FormItem>
                                            <FormItem {...formItemLayout} label="ssh操作：目标脚本">
                                            </FormItem>
                                        </div>

                                    } />
                                    <Step title="执行自动化测试" description="" />
                                </Steps>
                            </Box>
                            <FormItem wrapperCol={{span: 16, offset: 3}} style={{marginTop: 0}}>
                                <Button type="primary" htmlType="submit">保存</Button>
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