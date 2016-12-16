/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import {notification} from 'antd'
import IssuesList from '../../components/issues-list';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestonesIssues,getSetMilestonesIssues} from './milestones-action';

import './index.less';

class ProjectSetMilestonesDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {milestonesId,projectId,setId,state,due_end} = this.props.location.state;
        if (setId || projectId ){
            this.props.getMilestonesIssuesAction(milestonesId,setId,projectId,state,due_end);
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    render(){
        const milestoneDetail = this.props.milestoneDetail;
        const isLoading = this.props.loading;
        return(
            <Box title="问题列表信息" >
                <IssuesList loading = {isLoading} dataSource={milestoneDetail} loginInfo={this.props.loginInfo}>
                </IssuesList>
            </Box>
        )
    }
}


ProjectSetMilestonesDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        milestoneDetail: state.milestones.milestoneIssues,
        loading:state.milestones.acqIssuesLoading,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesIssuesAction: bindActionCreators(getMilestonesIssues, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetMilestonesDetail);