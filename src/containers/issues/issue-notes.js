/**
 * Created by helen on 2016/9/20.
 */
import React, {PropTypes,Component} from 'react';
import { Form, Input, Button, message,Modal,notification} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './index.css';
import Box from '../../components/box';
import * as issue from './actions/issue-action';
import * as home from '../home/actions/home-action';

const FormItem = Form.Item;
 class IssueNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {'hasValue':false};
    }

     componentWillMount() {
         //console.log('record:',this.props.location.state.record);
         const {actions} = this.props;
         const record = this.props.location.state.record;
         actions.issueNotes(record.project_id,record.id);

         if(record.state=='closed'){
             this.setState({'closeButtonStyle':{'display':'none'},'reopenButtonStyle':{'display':''},color:{'color':'red'}});
         }else{
             this.setState({'closeButtonStyle':{'display':''},'reopenButtonStyle':{'display':'none'},color:{'color':'green'}});
         }

         this.setState({issueStatus: record.state});
     }

     componentWillReceiveProps(nextProps) {
         const result = nextProps.issue.comment;
         const commentError = nextProps.issue.commentError;

         const issueNotesError = nextProps.issue.issueNotesError;

         const issueState = nextProps.issue.updateIssue;
         const updateIssueError = nextProps.issue.updateIssueError;

         const record = this.props.location.state.record;

         // if(issueNotesError && issueNotesError!= this.props.issue.issueNotesError){
         //     // message.error('获取问题讨论失败!'+issueNotesError,3);
         //     this.errorMessage('获取问题讨论失败!',issueNotesError);
         // }
         //
         // if(commentError && commentError!= this.props.issue.commentError){
         //     // message.error('提交失败!'+commentError,3);
         //     this.errorMessage('提交失败!',commentError);
         // }
         //
         // if(updateIssueError && updateIssueError!= this.props.issue.updateIssueError){
         //     // message.error('操作失败!'+updateIssueError,3);
         //     this.errorMessage('操作失败!',updateIssueError);
         // }

         if(result){
             document.getElementById("body").value="";
             this.setState({'hasValue':false});
             message.success('提交成功',2);
             const {actions} = this.props;
             actions.issueNotes(record.project_id,record.id);
         }

         if(issueState){
             if(issueState.state=='closed'){
                 this.setState({'closeButtonStyle':{'display':'none'},'reopenButtonStyle':{'display':''},color:{'color':'red'}});
                 message.success('问题关闭成功',2);
                 this.props.home.getNotifyItems(this.props.loginInfo.userId);
             }else{
                 this.setState({'closeButtonStyle':{'display':''},'reopenButtonStyle':{'display':'none'},color:{'color':'green'}});
                 message.success('重开问题成功',2);
                 this.props.home.getNotifyItems(this.props.loginInfo.userId);
             }

             this.setState({issueStatus: issueState.state});

             const {actions} = this.props;
             actions.issueNotes(record.project_id,record.id);
         }
     }

     // errorMessage(info,error){
     //     notification.error({
     //         message: info,
     //         description:error,
     //         duration:null,
     //     });
     // }

    handleSubmit(e) {
        e.preventDefault();
        var body = document.getElementById("body").value;
        const {actions,loginInfo} = this.props;
        const record = this.props.location.state.record;
        var notes = {
            projectId:record.project_id,
            issueId:record.id,
            body:body,
            username:loginInfo.username,
            create_at:Date.now()
        };
        if(notes){
            actions.comment(notes);
        }
    }

    // editIssue(type){
    //     const {actions,loginInfo} = this.props;
    //     var issue_data = this.props.location.state.record;
    //     if(type=='close'){
    //         issue_data.state_event='close';
    //     }else{
    //         issue_data.state_event='reopen';
    //     }
    //     var data = {
    //         state_event:issue_data.state_event,
    //         project_id : issue_data.project_id,
    //         id : issue_data.id,
    //         updated_at : Date.now(),
    //         username : loginInfo.username
    //     };
    //     actions.updateIssue(data);
    // }

     handleOk() {
         const {actions,loginInfo,form} = this.props;
         var issue_data = this.props.location.state.record;

         form.validateFields(['reason'],(errors, values) => {
             if (!!errors) {
                 return;
             } else {
                 if(this.state.type=='close'){
                     issue_data.state_event='close';
                     issue_data.state = 'reopened';
                 }else{
                     issue_data.state_event='reopen';
                     issue_data.state = 'closed';
                 }
                 var data = {
                     state_event:issue_data.state_event,
                     project_id : issue_data.project_id,
                     id : issue_data.id,
                     // updated_at : Date.now(),
                     username : loginInfo.username,
                     state:issue_data.state,
                 };
                 actions.updateIssue(data);

                 this.setState({
                     visible: false,
                 });

                 form.resetFields(['reason']);
             }
         })
     }

     cancel(e) {
         this.setState({
             visible: false,
         });
     }


     editIssue(type){
         this.setState({
             visible: true,
             type:type,
         });
     }

    change(){
        var body = document.getElementById("body").value;
        if(body.length>0){
            this.setState({'hasValue':true});
        }else{
            this.setState({'hasValue':false});
        }

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { issue } = this.props;
        const record = this.props.location.state.record;

        const modalTitle = this.state.type && this.state.type=='close'?'您是否确定要关闭此问题?':'您是否确定要重开此问题?';
        //console.log('issue:',issue.issueNotes);
        const assign =record.assignee_name?record.assignee_name:'XXX';

        const list =issue&&issue.issueNotes?issue.issueNotes.map(data => <li key={data.id}>
            <div className={styles.notes_list} >
                <span>{data.author.name}@{data.author.username} {new Date(parseInt(data.created_at)).toLocaleString()}</span>
                <p>
                    {data.body}
                </p>
            </div>
        </li>):[];
        const hasBody=this.state.hasValue;
        return(
            <Box title="问题讨论">
                <div>
                    <div className={styles.notes_header}>
                        <span style={this.state.color}>{this.state.issueStatus}</span>
                        <strong> {record.author_name}</strong>
                        <span>在{record.created_at}创建了问题</span>
                        <strong> #{record.id}</strong>
                        <br/>
                        <strong style={{marginLeft:56}}>{assign}</strong>
                        <span>目前负责此问题</span>
                    </div>

                    <div className={styles.notes_body}>
                        <h2>
                            {record.title}
                        </h2>
                        <p>
                            {record.description}
                        </p>
                    </div>

                    <div>
                        <ul>
                            {list}
                        </ul>
                        <br/>
                        <ul>
                            <li>
                                <Form onSubmit={this.handleSubmit.bind(this)}>
                                        <Input type="textarea" placeholder="Write a comment"
                                               rows="10" id="body" onChange={this.change.bind(this)}/>
                                    <br/><br/>

                                    <Modal title={modalTitle} visible={this.state.visible}
                                           onOk={this.handleOk.bind(this)} onCancel={this.cancel.bind(this)}
                                    >
                                        <p>如确定，请输入原因：</p>
                                        <FormItem>
                                            {getFieldDecorator('reason',{rules:[{required:true,message:'不能为空'}]})(<Input type="textarea" placeholder="reason" rows="5"  />)}
                                        </FormItem>
                                    </Modal>

                                    <Button type='primary' htmlType='submit' disabled={!hasBody} loading ={this.props.issue.commentLoading}>提交</Button>
                                    <Button type="ghost" onClick={this.editIssue.bind(this,'close')} style={this.state.closeButtonStyle}>关闭问题</Button>
                                    <Button type="ghost" onClick={this.editIssue.bind(this,'reopen')} style={this.state.reopenButtonStyle}>重开问题</Button>
                                </Form>
                            </li>
                        </ul>
                    </div>
                </div>
            </Box>
        )
    }
}

IssueNotes = Form.create()(IssueNotes);

function mapStateToProps(state) {
    return {
        issue:state.issue,
        loginInfo:state.login.profile
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch),
        home:bindActionCreators(home, dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(IssueNotes);