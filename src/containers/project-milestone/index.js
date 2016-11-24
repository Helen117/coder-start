/**
 * Created by zhaojp on 2016/11/9.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Icon, Modal, message, Popover, Input, Form } from 'antd';
import {ProjectSetMilestones} from '../milestones'
import moment from 'moment'


class projectMilestones extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextprops,nextState){
        const getProjectInfo = nextprops.getProjectInfo;
        //console.log(nextprops,nextState)
        if(!getProjectInfo){
            return false;
        }else{
            return true;
        }

    }

    render(){
        const getProjectInfo = this.props.getProjectInfo;
        const projectId = getProjectInfo? getProjectInfo.id+'_p':'';
        /*if(projectId) {*/
            return (
                <ProjectSetMilestones projectId={projectId} defaultDate={moment()}/>
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
        getProjectInfo:state.getProjectInfo.projectInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(projectMilestones);
