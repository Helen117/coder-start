/**
 * Created by zhaojp on 2016/9/18.
 */
import React, {PropTypes} from 'react';
import {notification} from 'antd'
import IssuesList from '../../components/issues-list';
import Box from '../../components/box';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMilestonesIssues,getSetMilestonesIssues} from './actions/milestones-action';

import './index.less';

class ProjectSetMilestonesDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {milestonesId,projectId,id} = this.props.location.state;
        if (milestonesId && projectId && id){
            if(id.indexOf('_g')>0){
                this.props.getSetMilestonesIssues(milestonesId,projectId);
            }else{
                this.props.getMilestonesDetail(milestonesId,projectId);
            }
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
        milestoneDetail: state.getMilestonesIssues.milestoneIssues,
        loading:state.getMilestonesIssues.loading,
        loginInfo:state.login.profile,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMilestonesDetail: bindActionCreators(getMilestonesIssues, dispatch),
        getSetMilestonesIssues: bindActionCreators(getSetMilestonesIssues, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetMilestonesDetail);