/**
 * Created by helen on 2016/9/20.
 */
import React, {PropTypes,Component} from 'react';
import { Form, Input, Button, message} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';

 class IssueNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {'hasValue':false};
    }

     componentWillMount() {
         const {actions} = this.props;
         actions.issueNotes(1,2);
     }

     componentWillReceiveProps(nextProps) {
         const result = nextProps.issue.comment;
         console.log('result:',result);
         if(result){
             document.getElementById("body").value="";
             const {actions} = this.props;
             actions.issueNotes(1,2);
         }
     }

    handleSubmit(e) {
        e.preventDefault();
        var body = document.getElementById("body").value;
        const {actions,loginInfo} = this.props;
        var notes = {
            projectId:17,
            issueId:2,
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
        const list =issue&&issue.issueNotes?issue.issueNotes.map(data => <li key={data.id}>{data.body}</li>):[];
        const hasBody=this.state.hasValue;
        return(
            <div>
                <ul>
                    {list}
                </ul>
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