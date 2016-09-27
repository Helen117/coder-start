/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import IssuesTable from '../../components/issues-table';
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
        if(milestoneDetail != null){
        return(
            <Box title="里程碑详细信息">
                <IssuesTable dataSource={milestoneDetail}>
                </IssuesTable>
            </Box>
        )}
        else{
            return null;
        }
    }
}


MilestoneDetail.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    //console.log('获取到的里程碑详细数据：',state.milestones.milestoneDetail);
    return {
        milestoneDetail: state.milestones.milestoneDetail,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesDetail: bindActionCreators(getMilestonesDetail, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneDetail);