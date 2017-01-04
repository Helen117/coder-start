/**
 * Created by zhaojp on 2017/1/3.
 */

import React, {PropTypes} from 'react';
import {Button,Spin,Breadcrumb, message, Alert} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {pushCodeToRelease, pushCodeToMaster} from './actions'
import moment from 'moment'

class BranchMerge extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const {codeToMasterResult, codeToReleaseResult} = nextProps;
        if (this.props.codeToMasterResult != codeToMasterResult && codeToMasterResult) {
            this.insertCallback("代码成功推送至master分支");
        } else if(this.props.codeToReleaseResult != codeToReleaseResult && codeToReleaseResult) {
            this.insertCallback("代码成功推送至release分支");
        }
    }

    insertCallback(type){
        message.success(type);
    }
    pushCodeToRelease(user_id,set_id){
        this.props.pushCodeToReleaseAction(user_id,set_id);
    }

    pushCodeToMaster(user_id,set_id){
        this.props.pushCodeToMasterAction(user_id,set_id);
    }

    render(){
        const {selectedProjectSet,loginInfo} = this.props;
        const set_id = selectedProjectSet? selectedProjectSet.id.substring(0,selectedProjectSet.id.length-2):null;
        const user_id = loginInfo.userId;
        if(set_id) {
            return(
                <div style={{textAlign:"right"}}>
                    <Button type="primary"  onClick={this.pushCodeToRelease.bind(this,user_id,set_id)}>release</Button>
                    <Button type="primary"  onClick={this.pushCodeToMaster.bind(this,user_id,set_id)}>master</Button>
                </div>
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

BranchMerge.contextTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        selectedProjectSet: state.projectSet.selectedProjectSet,
        loginInfo:state.login.profile,
        codeToMasterResult:state.branchMerge.codeToMasterResult,
        codeToMasterLoading:state.branchMerge.codeToMasterLoading,
        codeToReleaseResult:state.branchMerge.codeToReleaseResult,
        codeToReleaseLoading:state.branchMerge.codeToReleaseLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        pushCodeToReleaseAction: bindActionCreators(pushCodeToRelease,dispatch),
        pushCodeToMasterAction: bindActionCreators(pushCodeToMaster,dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchMerge);