/**
 * Created by zhaojp on 2016/11/9.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Alert} from 'antd';
import {Milestones} from '../milestones'
import moment from 'moment';
import './index.less';

class ProjectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const defaultDate = this.props.location.state?this.props.location.state.date:moment();
        const selectedProjectSet = this.props.selectedProjectSet;
        const projectId = selectedProjectSet? selectedProjectSet.id:'';
        const projectName = selectedProjectSet? selectedProjectSet.name:'';
        let milestoneDetailPath = '';
        if(projectId.indexOf('_p')>= 0){
            milestoneDetailPath = "/projectSetMilestonesDetail";
        }else{
            milestoneDetailPath = "/projectSetMilestonesRequest";
        }

        if(projectId) {
            return (
                <Milestones projectId={projectId}
                            projectName={projectName}
                            defaultDate={defaultDate}
                            milestoneDetailPath={milestoneDetailPath}/>
            )
        }else{
            return (
                <Alert style={{margin:10}}
                    message="请从左边的项目树中选择一个具体的项目或项目集！"
                    description=""
                    type="warning"
                    showIcon
                />
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        selectedProjectSet: state.projectSet.selectedProjectSet,
    };
}


export default connect(mapStateToProps)(ProjectSetMilestones);
