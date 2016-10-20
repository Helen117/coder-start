/**
 * Created by helen on 2016/10/19.
 */
import React, {PropTypes,Component} from 'react';
import { Table ,Button,Input,notification } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as issue from './actions/issue-action';
import IssueList from '../../components/issues-list';

class MyIssueList extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const {actions,projectInfo,loginInfo} = this.props;
        if(projectInfo){
            actions.getIssueList(projectInfo.gitlabProject.id,loginInfo.username);
        }else{
            actions.getIssueList(null,loginInfo.username);
        }
    }


    componentWillReceiveProps(nextProps) {
        const {actions,projectInfo,loginInfo} = this.props;

        if(projectInfo && projectInfo.gitlabProject.id != nextProps.projectInfo.gitlabProject.id) {
            actions.getIssueList(nextProps.projectInfo.gitlabProject.id,loginInfo.username);
        }
    }


    render() {
        return (
            <IssueList  dataSource={this.props.issueList}
                        loading={this.props.loading}
            >
            </IssueList>
        )

    }

}

MyIssueList.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        issueList: state.issue.issueList,
        loading:state.issue.loading,
        projectInfo:state.getProjectInfo.projectInfo,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(issue, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyIssueList);