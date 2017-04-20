/**
 * Created by Administrator on 2017/4/17.
 */
import React,{ PropTypes } from 'react';
import { Button, Form ,Modal, Input,Spin, notification,message,Select} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addBacklogNode,getBacklogNode,modifyBacklogNode} from './actions/backlog-actions';
import fetchData from '../../utils/fetch';

const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class AddBacklogNode extends React.Component {
    constructor(props) {
        super(props);
        this.state={

        }
        this.milestoneVisible=false;
    }

    componentDidMount() {

    }

    insertCallback(messageInfo){
        message.info(messageInfo,3);
    }

    componentWillReceiveProps(nextProps) {
        const {addResult,setVisible,logInfo,form,modifyResult} = this.props;
        const {node} = nextProps;
        const set_id = this.props.setId?this.props.setId.id.substr(0,this.props.setId.id.length-2):"";
        //添加节点返回信息
        if(nextProps.addResult && addResult && nextProps.addResult.result&&!nextProps.addResult.loading
            && nextProps.addResult.result !=addResult.result){
            this.insertCallback("添加节点成功！");
            this.props.getBacklogNode(set_id,logInfo.userId);
            if(setVisible){
                setVisible(false);
            }
        }

        //修改节点填入表单值
        if(nextProps.editType=='modify' && this.props.visible != nextProps.visible){
            form.setFieldsValue(node);
            form.setFieldsValue({'title':node.name});
            if(node.type == 'sprint'){
                this.milestoneVisible = true;
                form.setFieldsValue({'milestone_id':node.milestone_id.toString()});
            }
        }

        if(nextProps.editType=='add' && this.props.visible != nextProps.visible){
            form.setFieldsValue({
                'title':"",
                'description':"",
                'type':"",
                'milestone_id':""
            });
            this.milestoneVisible = false;
        }
        //修改节点返回信息
        if(nextProps.modifyResult && modifyResult && nextProps.modifyResult.result&&!nextProps.modifyResult.loading
            && nextProps.modifyResult.result !=modifyResult.result){
            this.insertCallback("修改节点成功！");
            this.props.getBacklogNode(set_id,logInfo.userId);
            if(setVisible){
                setVisible(false);
            }
        }
    }

    handleCancel() {
        const {form,setVisible} = this.props;
        var that =this;
        confirm({
            title: '您是否确定要取消表单的编辑',
            content: '取消之后表单内未提交的修改将会被丢弃',
            onOk() {
                that.milestoneVisible=false;
                form.resetFields();
                if(setVisible){
                    setVisible(false);
                }

            },
            onCancel() {
                //do nothing
            }
        })
    }

    handleSubmit(e) {
        const {form,logInfo ,setId,node,setVisible,editType} = this.props;
        var that =this;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                if(editType == 'add'){
                    formData.creater_id = logInfo.userId;
                    formData.set_id = setId;
                    formData.parent_id = node.id;
                    if(node&&node.milestone_id){
                        formData.milestone_id = node.milestone_id;
                    }
                    this.props.addBacklogNode(formData);
                }else {
                    let modifyData = {
                        id:node.id,
                        title:formData.title,
                        description:formData.description
                    };
                    this.props.modifyBacklogNode(modifyData);
                }

                that.milestoneVisible=false;
                form.resetFields();
                if(setVisible){
                    setVisible(false);
                }

            }
        })
    }

    getMilestoneInfo(value){
        var node = this.props.node;
        if(node&&!node.milestone_id&&value&&value==='sprint'){
            this.milestoneVisible=true;
        }else{
            this.milestoneVisible=false;
        }

    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {projectsetMilestone} = this.props;

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        var backlogAble =false,storyAble=false;
        if(this.props.node&&this.props.node.type==='sprint'){
            backlogAble=true;
        }else{
            storyAble=true;
        }

        const milestone = projectsetMilestone?(projectsetMilestone.result?projectsetMilestone.result:null):null;
        var milestoneInfo = milestone?milestone.map(data => <Option key={data.id.substr(0,data.id.length-2)}>{data.name}</Option>):[];
        var milestoneForm = this.milestoneVisible?<FormItem {...formItemLayout} label="里程碑" >
            {getFieldDecorator('milestone_id')(
                <Select  showSearch
                         showArrow={false}
                         placeholder="请选择里程碑"
                         optionFilterProp="children"
                         notFoundContent="无法找到"
                         style={{ width: 300 }}
                         disabled={this.props.editType=='add'?false:true}
                >
                    {milestoneInfo}
                </Select>)}
        </FormItem>:'';

        return (
            <Modal title={this.props.editType=='add'?'添加子节点':'修改节点'} visible={this.props.visible}
                   onOk={this.handleSubmit.bind(this)}  onCancel={this.handleCancel.bind(this)}
            >
                <Form horizontal >
                    <FormItem {...formItemLayout}  label="名称" >
                        {getFieldDecorator('title',{rules:[{ required:true,message:'请填写节点名称'}]})(<Input placeholder="请输入名称" />)}
                    </FormItem>

                    <FormItem {...formItemLayout}  label="描述" >
                        {getFieldDecorator('description')(<Input type="textarea" rows={4} placeholder="请输入描述" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="类型" >
                        {getFieldDecorator('type',
                            {rules:[{required:true, message:'请选择节点类型'}]})(
                            <Select  showSearch
                                     showArrow={false}
                                     optionFilterProp="children"
                                     notFoundContent="无法找到"
                                     style={{ width: 300 }}
                                     onSelect={this.getMilestoneInfo.bind(this)}
                                     disabled={this.props.editType=='add'?false:true}
                                  >
                                <Option key='backlog' disabled={backlogAble}>backlog</Option>
                                <Option key='sprint'>sprint</Option>
                                <Option key='story' disabled={storyAble}>story</Option>
                            </Select>)}
                    </FormItem>
                    {milestoneForm}
                </Form>
            </Modal>
        );
    }
}

AddBacklogNode.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        logInfo: state.login.profile,
        addResult:state.backlogReducer.addBacklogNode,
        modifyResult:state.backlogReducer.modifyBacklogNode,
        projectsetMilestone:state.taskBoardReducer.projectSetMilestone
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addBacklogNode: bindActionCreators(addBacklogNode, dispatch),
        getBacklogNode: bindActionCreators(getBacklogNode, dispatch),
        modifyBacklogNode: bindActionCreators(modifyBacklogNode, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(AddBacklogNode));