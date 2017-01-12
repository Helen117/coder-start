/**
 * Created by helen on 2016/11/15.
 */

import React, {PropTypes,Component} from 'react';
import {notification,Spin  } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as jenkins from './actions/jenkins-build-action';
import Box from '../../components/box';
// import styles from './index-1.less';

class CodeChangesList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const gitCommitId = this.props.location.state.record.gitCommitId;
        const lastTimeGitCommitId = this.props.location.state.record.lastTimeGitCommitId;
        const projectId = this.props.location.state.record.projectId;
        const {actions} = this.props;
        // actions.codeChanges(projectId,gitCommitId,lastTimeGitCommitId);
        actions.codeChanges(184,'cafa8cb9c2ecf31488a55ecffbf0c1fb33380112','1f0e85e23021cd9daae243f226396d6abb013d35');
    }

    componentWillReceiveProps(nextProps) {
        // const errorMsg = nextProps.error;
        // if(errorMsg&& errorMsg != this.props.errorMsg){
        //     this.errorMessage('获取commit列表信息失败！',error);
        // }
    }

    // errorMessage(info,error){
    //     notification.error({
    //         message: info,
    //         description:error,
    //         duration:null,
    //     });
    // }

    render() {
        const { commits,loading } = this.props;

        const pending = loading?true:false;

        const list =commits?commits.map(data => <li key={data.id}>
            {data.title}
        </li>):[];

        return (
            <Spin spinning={pending}>
                <h1>代码变更</h1>
                <h2>概要</h2>
                    <div>
                        <ol>
                            {list}
                        </ol>
                    </div>
            </Spin>
        )
    }
}

function mapStateToProps(state) {
    return {
        commits:state.codeChange.codeCommit,
        loading:state.codeChange.loading,
        error:state.codeChange.error,
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators(jenkins,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CodeChangesList);