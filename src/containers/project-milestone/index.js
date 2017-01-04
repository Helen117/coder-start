/**
 * Created by zhaojp on 2016/11/9.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Alert } from 'antd';
import {Milestones} from '../milestones'
import moment from 'moment'


class ProjectMilestones extends React.Component {
    constructor(props) {
        super(props);
    }

    isEmptyObject(obj){
        for(var key in obj){
            return false;
        }
        return true;
    }

    shouldComponentUpdate(nextprops,nextState){
        //const getProjectInfo = nextprops.getProjectInfo;
        const {project} = nextprops;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        //console.log(nextprops,nextState)
        if(this.isEmptyObject(projectInfo)){
            return false;
        }else{
            return true;
        }

    }

    render(){
        const {project} = this.props;
        let projectInfo = project.getProjectInfo?project.getProjectInfo.projectInfo:{};
        const projectId = !this.isEmptyObject(projectInfo)? projectInfo.id+'_p':'';
        const projectName = !this.isEmptyObject(projectInfo)? projectInfo.name:'';
        const milestoneDetailPath = "/projectSetMilestonesDetail";
        if(projectId) {
            return (
                <Milestones projectId={projectId}
                            projectName={projectName}
                            defaultDate={moment()}
                            milestoneDetailPath={milestoneDetailPath}/>
    )
        }else{
            return(
                <Alert style={{margin:10}}
                       message="请从左边的项目树中选择一个具体的项目！"
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
        project:state.project,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMilestones);
