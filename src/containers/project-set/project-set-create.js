/**
 * Created by zhaojp on 2016/10/24.
 */
import React,{ PropTypes } from 'react';
import { Transfer, Button, Form ,Modal, Input,Spin, notification} from 'antd';
import Box from '../../components/box';
import TransferFilter from '../../components/transfer-filter';
import fetchProjectMsg from './actions/fetch-project-msg-action';
import fetchProjectSetTree from  './actions/fetch-project_set_tree_action';
import {createProjectSet,updateProjectSet} from './actions/project-set-create-action'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class projectSetCreate extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys=[];
        this.projectSetInfo = this.props.selectedProjectSet;
    }

    componentWillMount(){
        const userId = this.props.logInfo.userId;
        this.props.fetchProjectMsg(userId);
    }
    componentDidMount() {
        if(this.props.location.state.editType != 'add'){
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
            this.props.form.setFieldsValue(this.projectSetInfo);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage,updateResult ,updateErr} = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback('创建');
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage,'创建');
        }
        if(this.props.updateResult != updateResult && updateResult){
            this.insertCallback('修改');
        }else if(this.props.updateErr != updateErr && updateErr){
            this.errCallback(errMessage,'修改');
        }

    }

    insertCallback(type){
        notification.success({
            message: type+'成功',
            description: type+'成功',
            duration: 2
        });
        this.props.fetchProjectSetTree(this.props.logInfo.userId);
        this.context.router.goBack();
    }

    errCallback(errMessage,type){
        notification.error({
            message: type+'失败',
            description: errMessage,
            duration: 2
        });
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
                    this.props.updateProjectSetAction(formData)
                }
            }
        })
    }

/*    checkGroupNameExit(rule, value, callback){
        const projectSetTree = this.props.projectSetTree;
        if (!value) {
            callback();
        } else {
            let isExit  = false;
            setTimeout(() => {
                for( let i=0; i<projectSetTree.length; i++){
                    if (value === projectSetTree[i].name) {
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
        const {getFieldProps} = this.props.form;
        const spinning = this.props.loading? true: false;
        const titleProps = getFieldProps('name', {
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
                <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                    <FormItem   {...formItemLayout} label="名称">
                        <Input {...titleProps} placeholder="请输入项目集合名称" />
                    </FormItem>

                    <FormItem  {...formItemLayout} label="描述">
                        <Input  type="textarea" rows="5"
                                {...getFieldProps('description',{rules: [ { required: true, message:'请输入项目集合描述' }]} )}
                                placeholder="请输入项目集合描述 " />
                    </FormItem>

                    <FormItem   {...formItemLayout} label="项目">
                            <Spin spinning={spinning}>
                                <TransferFilter dataSource = {this.props.projectInfo}
                                                {...getFieldProps('project_set')}
                                                onChange={this.handleChange.bind(this)}
                                                loadingProMsg={this.props.loadingProMsg }
                                                fetchProMsgErr ={this.props.fetchProMsgErr}
                                                targetKeys = {targetKeys}/>
                            </Spin>
                    </FormItem>

                    <FormItem wrapperCol={{span: 10, offset: 6}} style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit" loading={this.props.loading} disabled={this.props.disabled}>确定</Button>
                        <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </Box>
        );
    }
}

projectSetCreate.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        logInfo: state.login.profile,
        projectInfo: state.fetchProMsg.items,
        loadingProMsg: state.fetchProMsg.loading,
        fetchProMsgErr: state.fetchProMsg.errMessage,
        inserted: state.createProjectSet.items,
        errMessage: state.createProjectSet.errors,
        loading: state.createProjectSet.loading,
        projectSetTree: state.fetchProjectSetTree.projectSetTree,
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
        updateLoading: state.updateProjectSet.loading,
        updateResult: state.updateProjectSet.items,
        updateErr: state.updateProjectSet.errors,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectSetTree: bindActionCreators(fetchProjectSetTree, dispatch),
        fetchProjectMsg: bindActionCreators(fetchProjectMsg, dispatch),
        createProjectSet: bindActionCreators(createProjectSet, dispatch),
        updateProjectSetAction: bindActionCreators(updateProjectSet, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(projectSetCreate));
