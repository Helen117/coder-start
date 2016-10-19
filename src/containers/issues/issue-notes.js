/**
 * Created by helen on 2016/9/20.
 */
import React, {PropTypes,Component} from 'react';
import { Form, Input, Button, message} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './index.css';
import Box from '../../components/box';
import * as issue from './actions/issue-action';

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
     }

     componentWillReceiveProps(nextProps) {
         const result = nextProps.issue.comment;
         const issueState = nextProps.issue.updateIssue;
         const record = this.props.location.state.record;
         if(result){
             document.getElementById("body").value="";
             this.setState({'hasValue':false});
             const {actions} = this.props;
             actions.issueNotes(record.project_id,record.id);
         }

         if(issueState){
             if(issueState.state=='closed'){
                 this.setState({'closeButtonStyle':{'display':'none'},'reopenButtonStyle':{'display':''},color:{'color':'red'}});
             }else{
                 this.setState({'closeButtonStyle':{'display':''},'reopenButtonStyle':{'display':'none'},color:{'color':'green'}});
             }
             const {actions} = this.props;
             actions.issueNotes(record.project_id,record.id);
         }
     }

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

    editIssue(type){
        const {actions,loginInfo} = this.props;
        var issue_data = this.props.location.state.record;
        if(type=='close'){
            issue_data.state='close';
        }else{
            issue_data.state='reopen';
        }
        var data = {
            state:issue_data.state,
            project_id : issue_data.project_id,
            id : issue_data.id,
            updated_at : Date.now(),
            username : loginInfo.username
        };
        actions.updateIssue(data);
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
        const { issue } = this.props;
        const record = this.props.location.state.record;
        //console.log('issue:',issue.issueNotes);
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
                        <span style={this.state.color}>{record.state}</span>
                        <strong> Issue #{record.id}</strong>
                        <span> opened {record.created_at} by </span>
                        <strong>{record.author_name}</strong>
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
                                    <Button type='primary' htmlType='submit' disabled={!hasBody}>提交</Button>
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

function mapStateToProps(state) {
    return {
        issue:state.issue,
        loginInfo:state.login.profile
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(IssueNotes);