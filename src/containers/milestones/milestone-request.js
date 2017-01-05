/**
 * Created by zhaojp on 2017/1/4.
 */

import React, {PropTypes} from 'react';
import RequestList from '../../components/request-list';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestonesRequest} from './milestones-action';

import './index.less';

class MilestoneRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
    }

    componentDidMount() {
        const queryCondition = this.props.location.state;
        if (queryCondition && queryCondition.setId){
            this.props.getMilestonesRequestAction(this.state.page,queryCondition);
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    changePage(pagination, filters, sorter) {
        const queryCondition = this.props.location.state;
        const {getMilestonesRequestAction} = this.props;
        this.setState({
            page: pagination.current
        })
        getMilestonesRequestAction(pagination.current, queryCondition);
    }

    render(){
        const milestoneRequirement = this.props.milestoneRequirement;
        const milestoneRequirementLoading = this.props.milestoneRequirementLoading;
        return(
            <Box title="需求列表信息" >
                <RequestList
                    requirementListData={milestoneRequirement}
                    onChange={this.changePage.bind(this)}
                    loading={milestoneRequirementLoading}
                    page={this.state.page}
                    editable={false}/>
            </Box>
        )
    }
}


MilestoneRequest.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        milestoneRequirement: state.milestones.milestoneRequirement,
        milestoneRequirementLoading:state.milestones.milestoneRequirementLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesRequestAction: bindActionCreators(getMilestonesRequest, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneRequest);