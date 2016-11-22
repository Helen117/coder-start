/**
 * Created by helen on 2016/11/21.
 */
import React, {PropTypes,Component} from 'react';
import { Button,notification,Icon,Collapse,Steps,Table,Popover,Modal } from 'antd';
import Box from '../../components/box';
import * as jenkins from './actions/jenkins-build-action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import './index.less';

export class JenkinsView extends Component {

    constructor(props) {
        super(props);
        this.state = {visible:false};
    }

    componentWillMount() {
        // const {actions} = this.props;
        // actions.workflowStage(186);
    }

    componentWillReceiveProps(nextProps) {
        const errorMsg = nextProps.error;
        if(errorMsg&& errorMsg != this.props.errorMsg){
            this.errorMessage('获取信息失败！',error);
        }
    }

    render(){
        return(
            <Table columns={this.columns(this)} dataSource={}
                   bordered
                   size="middle"
                   loading={this.props.loading}
                   pagination={false}
                //rowClassName={this.rowClassName}
            >
            </Table>
        );
    }
}

JenkinsView.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        workflowStage:state.stageView.workflowStage,
        loading:state.stageView.loading,
        error:state.stageView.error,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(jenkins,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(JenkinsView);