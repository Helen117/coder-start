/**
 * Created by helen on 2016/9/20.
 */
import React, {PropTypes,Component} from 'react';
import { Form, Input, Button, message} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './index.css';
import * as issue from './actions/issue-action';

 class IssueNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {'hasValue':false};
    }

     componentWillMount() {
         //console.log('record:',this.props.location.state.record);
         const {actions} = this.props;
         actions.issueNotes(this.props.location.state.record.project_id,this.props.location.state.record.id);

         if(this.props.location.state.record.state=='closed'){
             this.setState({'closeButtonStyle':{'display':'none'},'reopenButtonStyle':{'display':''}});
         }else{
             this.setState({'closeButtonStyle':{'display':''},'reopenButtonStyle':{'display':'none'}});
         }
     }

     componentWillReceiveProps(nextProps) {
         const result = nextProps.issue.comment;
         const issueState = nextProps.issue.updateIssue;
         if(result){
             document.getElementById("body").value="";
             this.setState({'hasValue':false});
             const {actions} = this.props;
             actions.issueNotes(this.props.location.state.record.project_id,this.props.location.state.record.id);
         }

         if(issueState){
             if(issueState.state=='closed'){
                 this.setState({'closeButtonStyle':{'display':'none'},'reopenButtonStyle':{'display':''}});
             }else{
                 this.setState({'closeButtonStyle':{'display':''},'reopenButtonStyle':{'display':'none'}});
             }
             const {actions} = this.props;
             actions.issueNotes(this.props.location.state.record.project_id,this.props.location.state.record.id);
         }
     }

    handleSubmit(e) {
        e.preventDefault();
        var body = document.getElementById("body").value;
        const {actions,loginInfo} = this.props;
        var notes = {
            projectId:this.props.location.state.record.project_id,
            issueId:this.props.location.state.record.id,
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
        //console.log('issue:',issue.issueNotes);
        const list =issue&&issue.issueNotes?issue.issueNotes.map(data => <li key={data.id}>
            <div className={styles.notes_ul} >
                <span>{data.author.name}@{data.author.username} {new Date(parseInt(data.created_at)).toLocaleString()}</span>
                <p>
                    {data.body}
                </p>
            </div>
        </li>):[];
        const hasBody=this.state.hasValue;
        return(
            <div>
                <ul>
                    <div className={styles.notes_head}>
                        <h2>
                            {this.props.location.state.record.title}
                        </h2>
                        <p>
                            {this.props.location.state.record.description}
                        </p>
                    </div>
                </ul>
                <ul  className={styles.notes_ul}>
                    {list}
                </ul>
                <br/>
                <ul>
                    <li>
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                                <Input type="textarea" placeholder="Write a comment"
                                       rows="10" id="body" onChange={this.change.bind(this)}/>
                            <br/>
                            <Button type='primary' htmlType='submit' disabled={!hasBody}>提交</Button>
                            <Button type="ghost" onClick={this.editIssue.bind(this,'close')} style={this.state.closeButtonStyle}>关闭问题</Button>
                            <Button type="ghost" onClick={this.editIssue.bind(this,'reopen')} style={this.state.reopenButtonStyle}>重开问题</Button>
                        </Form>
                    </li>
                </ul>

            </div>
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