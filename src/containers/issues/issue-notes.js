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
         console.log('record:',this.props.location.state);
         const {actions} = this.props;
         actions.issueNotes(this.props.location.state.record.project_id,this.props.location.state.record.id);
     }

     componentWillReceiveProps(nextProps) {
         const result = nextProps.issue.comment;
         console.log('result:',result);
         if(result){
             document.getElementById("body").value="";
             this.setState({'hasValue':false});
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
        console.log('issue:',issue.issueNotes);
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
                    <div className={styles.notes_ul}>
                        <h2>
                            {this.props.location.state.record.title}
                        </h2>
                        <p>
                            {this.props.location.state.record.description}
                        </p>
                    </div>
                </ul>
                <br/>
                <ul>
                    {list}
                </ul>
                <br/>
                <ul>
                    <li>
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                                <Input type="textarea" placeholder="Write a comment"
                                       rows="10" id="body" onChange={this.change.bind(this)}/>
                            <br/>
                            <Button type='primary' htmlType='submit' disabled={!hasBody}>确定</Button>
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