/**
 * Created by zhaojp on 2016/11/9.
 */
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col, notification, Affix, Icon, Modal, message, Popover, Input, Form } from 'antd';
import {ProjectSetMilestones} from '../milestones'


class projectSetMilestones extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const selectedProjectSet = this.props.selectedProjectSet;
        const projectId = selectedProjectSet? selectedProjectSet.id:'';
        if(projectId) {
            return (
                <ProjectSetMilestones projectId={projectId}/>
            )
        }else{
            return ( <div/> )
        }
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
