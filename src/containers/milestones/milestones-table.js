/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import IssuesList from '../../components/issues-list';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestonesDetail} from './actions/milestones-action';

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
                <IssuesList loading = {isLoading} dataSource={milestoneDetail}>
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
        milestoneDetail: state.milestonesDetail.milestoneDetail,
        loading:state.milestonesDetail.loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesDetail: bindActionCreators(getMilestonesDetail, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneDetail);