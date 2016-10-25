/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import IssuesList from '../../components/issues-list';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestonesIssues} from './actions/milestones-action';

import './index.less';

class MilestoneDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const {milestonesId} = this.props.location.state;
        const {projectId} = this.props.location.state;
        if (milestonesId && projectId){
            this.props.getMilestonesDetail(milestonesId,projectId);
        }
    }

    render(){
        const milestoneDetail = this.props.milestoneDetail;
        const isLoading = this.props.loading;
        return(
                <IssuesList loading = {isLoading} dataSource={milestoneDetail} loginInfo={this.props.loginInfo}>
                </IssuesList>
        )
    }
}


MilestoneDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        milestoneDetail: state.getMilestonesIssues.milestoneIssues,
        loading:state.getMilestonesIssues.loading,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesDetail: bindActionCreators(getMilestonesIssues, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneDetail);