/**
 * Created by zhaojp on 2016/11/9.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Icon, Modal, message, Popover, Input, Form } from 'antd';
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

        /*if(projectId) {*/
            return (
                <Milestones projectId={projectId} projectName={projectName} defaultDate={moment()}/>
    )
        /*}else{
            return(
                <div className="null_type_div">
                    <span><Icon type="exclamation-circle-o" />   请选择一个项目或项目集合</span>
                </div>
            )
        }*/
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
