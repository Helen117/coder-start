/**
 * Created by zhaojp on 2016/10/24.
 */
import React,{ PropTypes } from 'react';
import { Transfer, Button, Form ,Modal, Input,Spin, notification,message} from 'antd';
import Box from '../../components/box';
import TransferFilter from '../../components/transfer-filter';
import {createProjectSet,updateProjectSet,fetchProjectSetTree,getSetProject} from './project-set-action'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class ProjectSetCreate extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys=[];
        this.projectSetInfo = this.props.selectedProjectSet;
    }

    componentWillMount(){
        const userId = this.props.logInfo.userId;
        this.props.getSetProjectAction(userId);
    }
    componentDidMount() {
        if(this.props.location.state.editType != 'add'){
            if(this.projectSetInfo){
                this.projectSetInfo.project_set = [];
                if(this.props.projectSetTree){
                    for(let i=0; i<this.props.projectSetTree.length; i++){
                        if(this.props.selectedProjectSet.id == this.props.projectSetTree[i].id){
                            this.projectSetInfo.description = this.props.projectSetTree[i].description;
                            for(let j=0;j<this.props.projectSetTree[i].children.length;j++){
                                this.projectSetInfo.project_set.push({id:this.props.projectSetTree[i].children[j].id,
                                    name:this.props.projectSetTree[i].children[j].name})
                            }
                        }

                    }
                }
            }
            this.props.form.setFieldsValue(this.projectSetInfo);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { createResult,updateResult } = nextProps;
        if (this.props.createResult != createResult && createResult){
            this.insertCallback('创建');
        }
        if(this.props.updateResult != updateResult && updateResult){
            this.insertCallback('修改');
        }

    }

    insertCallback(type){
        message.success(type+'成功');
        this.props.fetchProjectSetTree(this.props.logInfo.userId);
        this.context.router.goBack();
    }

    handleChange(targetKeys){
        this.targetKeys = targetKeys;
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
                formData.project_set = this.targetKeys;
                formData.owner_id = logInfo.userId;
                if(editType == 'add'){
                    this.props.createProjectSet(formData);
                }else{
                    formData.id = this.props.selectedProjectSet.selectedItemId;
                    this.props.updateProjectSetAction(formData)
                }
            }
        })
    }

/*    checkGroupNameExit(rule, value, callback){
        const ProjectSetTree = this.props.ProjectSetTree;
        if (!value) {
            callback();
        } else {
            let isExit  = false;
            setTimeout(() => {
                for( let i=0; i<ProjectSetTree.length; i++){
                    if (value === ProjectSetTree[i].name) {
                        isExit = true;
                        break;
                    }
                }
                if(isExit == true){
                    callback([new Error('该项目集合名称已被占用')]);
                }else {
                    callback();
                }
            }, 500);
        }
    }*/

    render(){
        const {editType} = this.props.location.state;
        const {getFieldDecorator} = this.props.form;
        const createLoading = this.props.createLoading? true: false;
        const updateLoading = this.props.updateLoading? true: false;
        const getProjectInfoLoading = this.props.getProjectInfoLoading? true: false;
        const titleProps = getFieldDecorator('name', {
            rules: [
                { required: true, message:'请输入项目集合名称' },
                { max: 30, message: '名称长度最大 30 个字符' },
               /* { validator: this.checkGroupNameExit.bind(this) },*/
            ],
        });
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const targetKeys = (editType=='update')?this.projectSetInfo?this.projectSetInfo.project_set:[]:[];
        return (
            <Box title={editType == 'add' ? '创建项目集合' : '修改项目集合'}>
                <Spin spinning={updateLoading} tip="正在保存数据" >
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                        <FormItem   {...formItemLayout} label="名称">
                            {titleProps(<Input  placeholder="请输入项目集合名称" />)}
                        </FormItem>

                        <FormItem  {...formItemLayout} label="描述">
                            {getFieldDecorator('description',{rules: [ { required: true, message:'请输入项目集合描述' }]} )
                            (<Input  type="textarea" rows="5" placeholder="请输入项目集合描述 " />)}
                        </FormItem>

                        <FormItem   {...formItemLayout} label="项目">
                                <Spin spinning={createLoading}>
                                    {getFieldDecorator('project_set')(<TransferFilter dataSource = {this.props.projectInfo}
                                                                                      onChange={this.handleChange.bind(this)}
                                                                                      loadingProMsg={getProjectInfoLoading}
                                                                                      fetchProMsgErr ={this.props.fetchProMsgErr}
                                                                                      targetKeys = {targetKeys}/>)}
                                </Spin>
                        </FormItem>
                        {editType == 'update' ?
                        <FormItem  {...formItemLayout} label="修改原因">
                            {getFieldDecorator('reason',{rules: [ { required: true, message:'请输入项目集合的修改原因' }]})
                            (<Input  type="textarea" rows="5" placeholder="请输入项目集合的修改原因 " />)}

                        </FormItem>:<div></div>}

                        <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                            <Button type="primary" htmlType="submit" loading={this.props.createLoading} disabled={this.props.disabled}>确定</Button>
                            <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </Box>
        );
    }
}

ProjectSetCreate.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        logInfo: state.login.profile,
        projectInfo: state.projectSet.projectInfo,
        getProjectInfoLoading: state.projectSet.getProjectInfoLoading,
        fetchProMsgErr: state.projectSet.errMessage,
        createResult: state.projectSet.createResult,
        createLoading: state.projectSet.createLoading,
        updateResult: state.projectSet.updateResult,
        updateLoading: state.projectSet.updateLoading,
        projectSetTree: state.projectSet.projectSetTree,
        selectedProjectSet: state.projectSet.selectedProjectSet,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        getSetProjectAction: bindActionCreators(getSetProject, dispatch),
        createProjectSet: bindActionCreators(createProjectSet, dispatch),
        updateProjectSetAction: bindActionCreators(updateProjectSet, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(ProjectSetCreate));
