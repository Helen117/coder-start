/**
 * Created by zhaojp on 2016/10/24.
 */
import React,{ PropTypes } from 'react';
import { Transfer, Button, Form ,Modal, Input,Spin, notification} from 'antd';
import Box from '../../components/box';
import TransferFilter from '../../components/transfer-filter';
import fetchProjectMsg from './actions/fetch-project-msg-action';
import fetchVirtualGroupTree from  './actions/fetch-virtual_group_tree_action';
import createVirtualGroup from './actions/virtual-group-create-action'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class virtualGroupCreate extends React.Component {
    constructor(props) {
        super(props);
        this.targetKeys=[];
    }

    componentDidMount() {
        const userId = this.props.logInfo.userId;
        this.props.fetchProjectMsg(userId);
    }

    componentWillReceiveProps(nextProps) {
        const { inserted, errMessage } = nextProps;
        if (this.props.inserted != inserted && inserted){
            this.insertCallback();
        }else if(this.props.errMessage != errMessage && errMessage){
            this.errCallback(errMessage);
        }

    }

    insertCallback(){
        notification.success({
            message: '创建成功',
            description: '创建成功',
            duration: 2
        });
        this.props.fetchVirtualGroupTree(this.props.logInfo.userId);
        this.context.router.goBack();
    }

    errCallback(errMessage){
        notification.error({
            message: '创建失败',
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
        e.preventDefault();
        const {form,logInfo } = this.props;
        form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                formData.project_set = this.targetKeys;
                formData.owner_id = logInfo.userId;
                this.props.createVirtualGroup(formData);
            }
        })
    }

    checkGroupNameExit(rule, value, callback){
        const virtualGroupTree = this.props.virtualGroupTree;
        if (!value) {
            callback();
        } else {
            let isExit  = false;
            setTimeout(() => {
                for( let i=0; i<virtualGroupTree.length; i++){
                    if (value === virtualGroupTree[i].name) {
                        isExit = true;
                        break;
                    }
                }
                if(isExit == true){
                    callback([new Error('该虚拟组名称已被占用')]);
                }else {
                    callback();
                }
            }, 500);
        }
    }
    render(){
        const {getFieldProps} = this.props.form;
        const spinning = this.props.loading? true: false;
        const titleProps = getFieldProps('name', {
            rules: [
                { required: true, message:'请输入虚拟组名称' },
                { max: 30, message: '名称长度最大 30 个字符' },
                { validator: this.checkGroupNameExit.bind(this) },
            ],
        });
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        return (
            <Box title="创建虚拟组">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)} >
                    <FormItem   {...formItemLayout} label="名称">
                        <Input {...titleProps} placeholder="请输入虚拟组名称" />
                    </FormItem>

                    <FormItem  {...formItemLayout} label="描述">
                        <Input  type="textarea" rows="5"
                                {...getFieldProps('description',{rules: [ { required: true, message:'请输入虚拟组描述' }]} )}
                                placeholder="请输入虚拟组描述 " />
                    </FormItem>

                    <FormItem   {...formItemLayout} label="项目">
                            <Spin spinning={spinning}>
                                <TransferFilter dataSource = {this.props.projectInfo}
                                                {...getFieldProps('project_set')}
                                                onChange={this.handleChange.bind(this)}
                                                loadingProMsg={this.props.loadingProMsg}
                                                fetchProMsgErr ={this.props.fetchProMsgErr}/>
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

virtualGroupCreate.contextTypes = {
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
        inserted: state.createVirtualGroup.items,
        errMessage: state.createVirtualGroup.errors,
        loading: state.createVirtualGroup.loading,
        virtualGroupTree: state.fetchVirtualGroupTree.virtualGroupTree,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchVirtualGroupTree: bindActionCreators(fetchVirtualGroupTree, dispatch),
        fetchProjectMsg: bindActionCreators(fetchProjectMsg, dispatch),
        createVirtualGroup: bindActionCreators(createVirtualGroup, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(virtualGroupCreate));
