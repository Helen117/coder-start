/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import IssuesTable from '../../components/issues-table';
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
        const isLoading = this.props.loading
        return(
            <Box title="里程碑详细信息">
                <IssuesTable loading = {isLoading} dataSource={milestoneDetail}>
                </IssuesTable>
            </Box>
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
        loading:state.getMilestonesIssues.loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesDetail: bindActionCreators(getMilestonesIssues, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneDetail);