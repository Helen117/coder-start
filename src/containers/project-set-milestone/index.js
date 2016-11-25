/**
 * Created by zhaojp on 2016/11/9.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Icon} from 'antd';
import {ProjectSetMilestones} from '../milestones'
import moment from 'moment';
import './index.less';

class projectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const defaultDate = this.props.location.state?this.props.location.state.date:moment();
        const selectedProjectSet = this.props.selectedProjectSet;
        const projectId = selectedProjectSet? selectedProjectSet.id:'';
        const projectName = selectedProjectSet? selectedProjectSet.name:''
       /* if(projectId) {*/
            return (
                <ProjectSetMilestones projectId={projectId} projectName={projectName} defaultDate={defaultDate}/>
            )
       /* }else{
            return (
                <div className="null_type_div">
                    <span><Icon type="exclamation-circle-o" />   请选择一个项目或项目集合</span>
                </div>
            )
        }*/
    }
}

function mapStateToProps(state) {
    return {
        selectedProjectSet: state.projectSetToState.selectedProjectSet,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(projectSetMilestones);
