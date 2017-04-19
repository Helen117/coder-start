/**
 * Created by Administrator on 2017/4/17.
 */
import React,{ PropTypes } from 'react';
import { Button, Form ,Modal, Input,Spin, notification,message,Select} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addBacklogNode,getBacklogNode} from './actions/backlog-actions';
import fetchData from '../../utils/fetch';

const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class AddBacklogNode extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            milestone:null,
        }
        this.milestoneVisible=false;
    }

    componentDidMount() {

    }

    insertCallback(messageInfo){
        message.info(messageInfo,3);
    }

    componentWillReceiveProps(nextProps) {
        const {addResult,setVisible,logInfo} = this.props;
        if(nextProps.addResult && addResult && nextProps.addResult.result&&!nextProps.addResult.loading
            && nextProps.addResult.result !=addResult.result){
            this.insertCallback("添加节点成功！");
            this.props.getBacklogNode(this.props.setId,logInfo.userId);
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
        const {form,logInfo ,setId,node,setVisible} = this.props;
        var that =this;
        form.validateFields((errors) => {
            if (!!errors) {
                return;
            } else {
                const formData = form.getFieldsValue();
                formData.creater_id = logInfo.userId;
                formData.set_id = setId;
                formData.parent_id = node.id;
                if(node&&node.milestone_id){
                    formData.milestone_id = node.milestone_id;
                }
                console.log('formData:',formData);
                this.props.addBacklogNode(formData);

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
        if(node&&!node.milestone_id){
            this.milestoneVisible=true;
            fetchData('/taskboard/milestone', {set_id:this.props.setId}, null, (result)=> {
                this.setState({
                    milestone:result
                })
            });
        }else{
            this.milestoneVisible=false;
        }

    }

    render(){
        console.log('milestoneVisible:',this.milestoneVisible);
        const {getFieldDecorator} = this.props.form;

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

        var milestoneInfo = this.state.milestone?this.state.milestone.map(data => <Option key={data.id.substr(0,data.id.length-2)}>{data.name}</Option>):[];
        var milestoneForm = this.milestoneVisible?<FormItem {...formItemLayout} label="里程碑" >
            {getFieldDecorator('milestone_id')(
                <Select  showSearch
                         showArrow={false}
                         placeholder="请选择里程碑"
                         optionFilterProp="children"
                         notFoundContent="无法找到"
                         style={{ width: 300 }}
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
        addResult:state.backlogReducer.addBacklogNode
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addBacklogNode: bindActionCreators(addBacklogNode, dispatch),
        getBacklogNode: bindActionCreators(getBacklogNode, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(createForm()(AddBacklogNode));