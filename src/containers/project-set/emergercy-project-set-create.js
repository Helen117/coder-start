/**
 * Created by zhaojp on 2017/1/12.
 */
import React,{ PropTypes } from 'react';
import { DatePicker, Button, Form ,Modal, Input,Spin,Select, message} from 'antd';
import Box from '../../components/box';
import moment from 'moment';
import {createEmergencyProjectSet,fetchProjectSetTree} from './project-set-action'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
class EmergencyProjectSetEdit extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys=[];
        this.editProject = false;
        this.projectSetInfo = this.props.selectedProjectSet;
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        const { createEmergencyResult,updateResult } = nextProps;
        if (this.props.createEmergencyResult != createEmergencyResult && createEmergencyResult){
            this.insertCallback('创建');
        }
        if(this.props.updateResult != updateResult && updateResult){
            this.insertCallback('修改');
            const formData = this.props.form.getFieldsValue();
            this.projectSetInfo.name = formData.name;
            this.projectSetInfo.description = formData.description;
            this.props.putSelectedTreeItemToStateAction(this.projectSetInfo);
        }

    }

    insertCallback(type){
        message.success(type+'成功');
        this.props.fetchProjectSetTree(this.props.logInfo.userId);
        this.context.router.goBack();
    }

    handleCancel() {
        const {form} = this.props;
        const {router} = this.context;

        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                router.goBack();
                form.resetFields();
            },
            onCancel() {
                //do nothing
            }
        })
    }

    handleSubmit(e) {
        const {editType} = this.props.location.state;
        e.preventDefault();
        const {form,logInfo } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                formData.owner_id = logInfo.userId;
                if(editType == 'add'){
                    this.props.createEmergencyProjectSetAction(formData);
                }else{
                    /*formData.id = this.props.selectedProjectSet.selectedItemId;
                    this.props.updateProjectSetAction(formData)*/
                }
            }
        })
    }

    disabledDate(current) {
        return current && current.startOf('day') < moment().startOf('day')
    }

    mapParentOption(projectSetTree){
        const projectSetOption = []
        for(let i=0; i< projectSetTree.length; i++){
            if(projectSetTree[i].id.indexOf('_g') >= 0){
                projectSetOption.push(
                    <Option key={projectSetTree[i].id.substring(0,projectSetTree[i].id.length-2)}>{projectSetTree[i].name}</Option>
                )
            }
        }
        return projectSetOption;
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {editType} = this.props.location.state;
        const {updateEmergencyLoading,projectSetTree, selectedItemInfo} = this.props;
        const updateLoading = updateEmergencyLoading? true: false;
        /*const dueDateProps = getFieldDecorator('due_date', {
            rules: [
                { required: true, type: 'object', message: '请选择计划完成时间' },
                //{ validator: this.checkDuedate.bind(this) }
            ],
        });*/
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        let projectSetOption = [],initParent='';
        if(selectedItemInfo && selectedItemInfo.id.indexOf('_g')>= 0){
            initParent = this.props.selectedItemInfo.selectedItemId;
        }
        if(projectSetTree){
            projectSetOption = this.mapParentOption(projectSetTree);
        }


        return (
            <Box title={editType == 'add' ? '创建紧急上线项目集合' : '修改紧急上线项目集合'}>
                <Spin spinning={updateLoading} tip="正在保存数据,请稍候..." >
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)} >

                        <FormItem {...formItemLayout}  label="紧急项目集合名称" >
                            {getFieldDecorator('name',{rules:[{ required:true,message:'请填写紧急项目集合名称'}]})
                            (<Input placeholder="请填写紧急项目集合名称"/>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="父项目集">
                            {getFieldDecorator('parent_id',
                                {rules:[{required:true, message:'请选择父项目集'},
                                    //{ validator: this.checkDevelop.bind(this)}
                                ],initialValue:initParent})(
                                <Select  showSearch
                                         showArrow={false}
                                         placeholder="请选择父项目集"
                                         optionFilterProp="children"
                                         notFoundContent="无法找到"
                                        // style={{ width: 300 }}
                                         //disabled={disabledEditDeveloper}
                                         //onChange={this.changeDeveloper.bind(this)}
                                >
                                    {projectSetOption}
                                </Select>)}
                        </FormItem>

                        <FormItem  {...formItemLayout} label="描述">
                            {getFieldDecorator('description',{rules: [ { required: true, message:'请输入紧急上线项目集合描述' }]} )
                            (<Input  type="textarea" rows="5" placeholder="请输入紧急上线项目集合描述 " />)}
                        </FormItem>

                        {/*<FormItem  {...formItemLayout} label="计划完成时间">
                            {dueDateProps(<DatePicker size='large'
                                                      disabledDate={this.disabledDate.bind(this)}
                                                      placeholder="计划完成时间"
                                                      style={{ width: 300 }}/>)}
                        </FormItem>*/}

                        <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.createEmergencyLoading}>确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>

                    </Form>
                </Spin>
            </Box>
        )
    }
}

EmergencyProjectSetEdit.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        selectedItemInfo: state.projectSet.selectedProjectSet,
        projectSetTree: state.projectSet.projectSetTree,
        logInfo: state.login.profile,
        createEmergencyLoading: state.projectSet.createEmergencyLoading,
        createEmergencyResult: state.projectSet.createEmergencyResult,
        updateEmergencyLoading: state.projectSet.updateEmergencyLoading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createEmergencyProjectSetAction: bindActionCreators(createEmergencyProjectSet, dispatch),
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(EmergencyProjectSetEdit));