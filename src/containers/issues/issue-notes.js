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
        this.state = {};
    }

     componentWillMount() {
         const {actions} = this.props;
         actions.issueNotes(1,2);
     }

    handleSubmit(e) {
        e.preventDefault();

    }

    render() {
        const { issue } = this.props;
        console.log('issue:',issue.issueNotes);
        const list =issue&&issue.issueNotes?issue.issueNotes.map(data => <li key={data.id}>{data.body}</li>):[];
        console.log(list);

        return(
            <div>
                <ul>
                    {list}
                </ul>
                <ul>
                    <li>
                        <form>
                                <textarea placeholder="Write a comment" rows="10" cols="50"/>
                            <br/>
                                <button type="submit" value="submit">提交</button>
                        </form>
                    </li>
                </ul>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        issue:state.issue
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(issue,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(IssueNotes);