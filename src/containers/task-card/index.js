/**
 * Created by helen on 2017/3/29.
 */
import React, {PropTypes,Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Tag, Card, Row, Col, Icon,Modal,Select,Upload,DatePicker} from 'antd';
import Box from '../../components/box';
import * as actions from './action';

const FormItem = Form.Item;
const Option = Select.Option;

class TaskCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    componentWillMount() {
        this.props.actions.getTaskInfo(26);
    }

    addTask(){
        this.setState({
            modalVisible: true
        });
    }

    modifyTaskDeveloper(){

    }

    deleteTask(){
        console.log("delete");
    }

    handleSubmit(e) {
        e.preventDefault();
        const {form, loginInfo} = this.props;
        form.validateFields((errors) => {
                if (!!errors) {
                    return;
                } else {

                }
            }
        )
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        });
        this.props.form.resetFields();

    }

    beforeUpload(file){
        var len = file.name.length;
        // if (!(file.name.substr(len-4,4).toLowerCase() == '.doc')) {
        //     message.error('上传的需求文档限制为word2003版本的文件(IIMP暂时不支持word2007版本的文件)！',5);
        //     return false;
        // }
        if(file.size/ 1024 / 1024 >10){
            message.error('文件大小不能超过10M',3);
            return false;
        }

        if(file.size==0){
            message.error('不能上传空文件',3);
            return false;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            this.setState({
                fileList:[{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: reader.result
                }]
            });
        }.bind(this);
        reader.readAsDataURL(file);
        return false;
    }

    render(){
        console.log('taskInfo:',this.props.taskInfo);

        const {taskInfo,developerInfo} = this.props;

        const todoTask = taskInfo&&taskInfo.todo_cards&&taskInfo.todo_cards.length?(
            taskInfo.todo_cards.map(
                data =><Card style={{marginBottom:"5px"}}>
                        <Row>
                            <Col span={22}>{data.developer?<Tag>{data.developer.name}</Tag>:<Button type="primary" size="default" onClick={this.modifyTaskDeveloper.bind(this)}>领取</Button>}
                               {data.title}
                            </Col>
                            <Col span={2}>
                                <Icon type="delete"  onClick={this.deleteTask.bind(this)}/>
                            </Col>
                        </Row>
                </Card> )):"";

        const doingTask = taskInfo&&taskInfo.doing_cards&&taskInfo.doing_cards.length?(
            taskInfo.doing_cards.map(
                data =><Card style={{marginBottom:"5px"}}><Tag>{data.developer}</Tag> {data.title}
                </Card>)):"";

        const doneTask = taskInfo&&taskInfo.done_cards&&taskInfo.done_cards.length?(
            taskInfo.done_cards.map(
                data =><Card style={{marginBottom:"5px"}}>
                    <Tag>{data.developer}</Tag> {data.title}
                    </Card> )):"";

        const action = (<Button type="primary" size="default" onClick={this.addTask.bind(this)}>新建Task</Button>);

        const {getFieldDecorator, getFieldError} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 12},
        };

        // const developer = developerInfo?developerInfo.map(data => <Option key={data.id}>{data.name}</Option>):[];

        return (
            <div>
                <Row>
                    <Col span="8">
                        <Box title="todo" action={action}>
                            {todoTask}
                        </Box>
                    </Col>
                    <Col span="8">
                        <Box title="doing">
                            {doingTask}
                        </Box>
                    </Col>
                    <Col span="8">
                        <Box title="done">
                            {doneTask}
                        </Box>
                    </Col>
                </Row>

                <Modal title="新增"
                       visible={this.state.modalVisible}
                       onOk={this.handleSubmit.bind(this)}
                       //confirmLoading={this.props.deleteLoading}
                       onCancel={this.handleCancel.bind(this)}
                >
                    <Form horizontal >
                        <FormItem {...formItemLayout} label="任务名称">
                            {getFieldDecorator('title',{rules:[{required:true,message:'不能为空'}]})(<Input placeholder=""  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="任务描述">
                            {getFieldDecorator('description')(<Input type="textarea" placeholder="" rows="5" />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="开发人员">
                            {getFieldDecorator('assignee_develop_id')(
                                <Select showSearch
                                        showArrow={false}
                                        placeholder="请选择开发人员"
                                        optionFilterProp="children"
                                        notFoundContent="无法找到"
                                        style={{width: 300}}
                                >
                                    {/*{developer}*/}
                                </Select>)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="检查项">
                            {getFieldDecorator('checkRule')(<Input type="textarea" placeholder="输入检查项" rows="5" />)}
                        </FormItem>

                        <FormItem {...formItemLayout} label="计划完成时间">
                            {getFieldDecorator('expect_due_date')(
                                <DatePicker style={{width: 300}}/>)
                            }
                        </FormItem>

                        <FormItem {...formItemLayout}  label="文档上传" >
                            {getFieldDecorator('files')(
                                <Upload beforeUpload={this.beforeUpload.bind(this)} fileList={this.state.fileList}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>)}
                        </FormItem>
                        </Form>
                </Modal>

            </div>
        )
    }
}

TaskCard.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

TaskCard = Form.create()(TaskCard);

function mapStateToProps(state) {
    return {
        loginInfo: state.login.profile,
        taskInfo: state.taskCard.taskInfo,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions:bindActionCreators(actions,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TaskCard);